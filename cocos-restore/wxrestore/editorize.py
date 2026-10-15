"""Convert a deserialized built object graph into the editor flat-array JSON
used by .scene/.prefab asset files.

Input graph markers (from wxrestore.packed):
  {'__ref__': i}      reference to a top-level section instance
  {'__ref_fwd__': i}  unresolved forward reference (treated as None)
  {'__uuid__': s}     compressed/full asset uuid (may carry @sub)
  {'__vt__': name}    builtin value type Vec2/Vec3/Vec4/Quat/Color/Size/Rect
  {'__custom__': n}   custom-serialized class with 'data' payload (inlined)

Emit order (verified against Creator 3.8.8 .scene and taxi-template .prefab):
  prefab: [cc.Prefab, rootNode, DFS(node -> children -> components(+CompPrefabInfo) -> PrefabInfo)]
  scene:  [cc.SceneAsset, cc.Scene, same DFS, globals tail]
"""
import random
import string

from .uuid import decompress_uuid

_ID_ALPHABET = string.ascii_letters + string.digits


def _new_id():
    return "".join(random.choice(_ID_ALPHABET) for _ in range(22))


def _color(rgba):
    return {
        "__type__": "cc.Color",
        "r": (rgba >> 24) & 0xFF,
        "g": (rgba >> 16) & 0xFF,
        "b": (rgba >> 8) & 0xFF,
        "a": rgba & 0xFF,
    }


def _valuetype(v):
    name = v["__vt__"]
    if name == "Color":
        return _color(v["rgba"])
    if name == "Quat":
        return {"__type__": "cc.Quat", "x": v["x"], "y": v["y"], "z": v["z"], "w": v["w"]}
    if name in ("Vec2", "Vec3", "Vec4"):
        d = {"__type__": "cc." + name, "x": v["x"], "y": v["y"]}
        if name in ("Vec3", "Vec4"):
            d["z"] = v.get("z", 0.0)
        if name == "Vec4":
            d["w"] = v["w"]
        return d
    if name == "Size":
        return {"__type__": "cc.Size", "width": v["width"], "height": v["height"]}
    if name == "Rect":
        return {"__type__": "cc.Rect", "x": v["x"], "y": v["y"],
                "width": v["width"], "height": v["height"]}
    return {"__type__": name}


# value types / inline-only dicts: never become array slots
_INLINE_TYPES = {
    "cc.Vec2", "cc.Vec3", "cc.Vec4", "cc.Quat", "cc.Color", "cc.Size",
    "cc.Rect", "cc.Mat4", "TypedArrayRef",
}

_NODE_ORDER = [
    "__type__", "_name", "_objFlags", "_parent", "_children", "_active",
    "_components", "_prefab", "_lpos", "_lrot", "_lscale", "_layer",
    "_euler", "_mobility", "_id",
]
_COMP_FIRST = ["__type__", "_name", "_objFlags", "node", "_enabled", "__prefab"]


def _ordered(src, order):
    out = {}
    for k in order:
        if k in src:
            out[k] = src[k]
    for k, v in src.items():
        if k not in out:
            out[k] = v
    return out


class Editorizer:
    def __init__(self, resolved, root_index, own_uuid=None, kind="prefab"):
        self.resolved = resolved
        self.own_uuid = own_uuid
        self.kind = kind                    # 'prefab' | 'scene' | 'raw'
        self.src = {}                       # out index -> source object
        self.depth = {}                     # out index -> node depth
        self.index_of = {}                  # id(obj) -> out index
        self.out = []
        self.body_slot = None               # index currently being serialized
        self.root = resolved[root_index]
        self.instance_owner = {}            # id(PrefabInstance) -> owner node

    # ---- registration ----------------------------------------------------
    def _register(self, obj):
        key = id(obj)
        if key in self.index_of:
            return self.index_of[key]
        idx = len(self.out)
        self.index_of[key] = idx
        self.out.append(None)
        self.src[idx] = obj
        return idx

    def _resolve_ref(self, v):
        if isinstance(v, dict) and "__ref__" in v:
            t = self.resolved[v["__ref__"]]
            return t if isinstance(t, dict) else None
        return v if isinstance(v, dict) else None

    # ---- main entry ------------------------------------------------------
    def build(self):
        root_idx = self._register(self.root)
        assert root_idx == 0
        if self.kind == "raw":
            self._sweep()
            return self.out[0]

        field = "scene" if self.kind == "scene" else "data"
        root_node = self._resolve_ref(self.root.get(field))
        if root_node is not None:
            assert self._register(root_node) == 1
            self._emit_node(root_node, 1)
        self._sweep()
        self._prune()
        out = self.out
        if self.kind == "prefab":
            out[0] = self._wrap_prefab_asset(out[0])
        elif self.kind == "scene":
            out[0] = self._wrap_scene_asset(out[0])
        return out

    def _emit_node(self, node, depth):
        self.depth[id(node)] = depth
        for child_ref in node.get("_children") or []:
            child = self._resolve_ref(child_ref)
            if child is not None:
                self._register(child)
                self._emit_node(child, depth + 1)
        for comp in node.get("_components") or []:
            if isinstance(comp, dict):
                self._register(comp)
                cpi = comp.get("__prefab")
                if isinstance(cpi, dict):
                    self._register(cpi)
        pi = node.get("_prefab")
        if isinstance(pi, dict):
            self._register(pi)
            inst = pi.get("instance")
            if isinstance(inst, dict):
                self._register(inst)
                self.instance_owner[id(inst)] = node
                for ov in inst.get("propertyOverrides") or []:
                    if isinstance(ov, dict):
                        self._register(ov)
                        ti = ov.get("targetInfo")
                        if isinstance(ti, dict) and "__type__" in ti:
                            self._register(ti)
                rn = inst.get("prefabRootNode")
                root2 = self._resolve_ref(rn)
                if root2 is not None and id(root2) not in self.index_of:
                    self._register(root2)
                    self._emit_node(root2, depth + 1)

    def _prune(self):
        reach = set()
        stack = [0]
        while stack:
            i = stack.pop()
            if i in reach or i >= len(self.out) or self.out[i] is None:
                continue
            reach.add(i)
            def walk(v):
                if isinstance(v, dict):
                    if "__id__" in v and isinstance(v["__id__"], int):
                        stack.append(v["__id__"])
                    else:
                        for vv in v.values():
                            walk(vv)
                elif isinstance(v, list):
                    for vv in v:
                        walk(vv)
            walk(self.out[i])
        if len(reach) == len(self.out):
            return
        old = self.out
        remap = {}
        new = []
        for i, o in enumerate(old):
            if i in reach:
                remap[i] = len(new)
                new.append(o)
        def fix(v):
            if isinstance(v, dict):
                if "__id__" in v and isinstance(v["__id__"], int):
                    v["__id__"] = remap[v["__id__"]]
                else:
                    for vv in v.values():
                        fix(vv)
            elif isinstance(v, list):
                for vv in v:
                    fix(vv)
        for o in new:
            fix(o)
        self.out = new

    def _sweep(self):
        while True:
            pending = [i for i, v in enumerate(self.out) if v is None]
            if not pending:
                break
            for i in pending:
                self.body_slot = i
                self.out[i] = self._serialize(self.src[i])
                self.body_slot = None

    # ---- serialization ---------------------------------------------------
    def _serialize(self, v):
        if isinstance(v, dict):
            return self._serialize_dict(v)
        if isinstance(v, list):
            return [self._serialize(x) for x in v]
        return v

    def _serialize_dict(self, o):
        keys = o.keys()
        if set(keys) == {"__ref__"}:
            target = self.resolved[o["__ref__"]]
            if not isinstance(target, dict):
                return None
            return {"__id__": self._register(target)}
        if set(keys) == {"__ref_fwd__"}:
            return None
        if "__uuid__" in o and len(o) <= 2:
            ref = {"__uuid__": decompress_uuid(o["__uuid__"])}
            if "__expectedType__" in o:
                ref["__expectedType__"] = o["__expectedType__"]
            return ref
        if "__vt__" in o:
            return _valuetype(o)
        if "__trs__" in o:
            raise ValueError("TRS encoding encountered (needs expansion)")
        if "__custom__" in o:
            out = {"__type__": o["__custom__"]}
            data = o.get("data")
            if isinstance(data, dict):
                for k, vv in data.items():
                    out[k] = self._serialize(vv)
            return self._object_slot(o, out)

        t = o.get("__type__")
        if t and t not in _INLINE_TYPES:
            idx = self.index_of.get(id(o))
            if idx is not None and idx != self.body_slot:
                return {"__id__": idx}
            if idx is None:
                idx = self._register(o)
                if idx != self.body_slot:
                    return {"__id__": idx}
            body = {"__type__": t}
            for k, vv in o.items():
                if k == "__type__":
                    continue
                body[k] = self._serialize(vv)
            return self._post_treat(t, body, o)

        out = {"__type__": t}
        for k, vv in o.items():
            if k == "__type__":
                continue
            out[k] = self._serialize(vv)
        return out

    def _object_slot(self, src_marker, body):
        """Custom objects usually inline; if they were pre-registered, ref them."""
        idx = self.index_of.get(id(src_marker))
        if idx is not None and idx != self.body_slot:
            return {"__id__": idx}
        return body

    def _post_treat(self, t, out, src):
        if t in ("cc.Node", "cc.Scene"):
            return self._enrich_node(out, t, src)
        if t == "cc.PrefabInfo":
            return self._fix_prefab_info(out, src)
        if t == "cc.PrefabInstance":
            return self._fix_prefab_instance(out, src)
        if t in ("cc.Prefab", "cc.SceneAsset"):
            return out
        if "node" in src and not t.startswith("cc.Scene"):
            return self._enrich_component(out)
        return out

    # ---- canonical shapes ------------------------------------------------
    def _enrich_node(self, out, t, src):
        out.setdefault("_objFlags", 0)
        out["_parent"] = out.get("_parent")
        out.setdefault("_children", [])
        out.setdefault("_active", True)
        out.setdefault("_components", [])
        if "_prefab" not in out:
            out["_prefab"] = None
        if self.kind == "prefab":
            out["_level"] = self.depth.get(id(src), 1)
        out.setdefault("_lpos", {"__type__": "cc.Vec3", "x": 0, "y": 0, "z": 0})
        out.setdefault("_lrot", {"__type__": "cc.Quat", "x": 0, "y": 0, "z": 0, "w": 1})
        out.setdefault("_lscale", {"__type__": "cc.Vec3", "x": 1, "y": 1, "z": 1})
        out.setdefault("_layer", 33554432)
        out.setdefault("_euler", {"__type__": "cc.Vec3", "x": 0, "y": 0, "z": 0})
        out.setdefault("_mobility", 0)
        if t == "cc.Scene":
            out.setdefault("autoReleaseAssets", False)
            out["_prefab"] = None
            out["_id"] = self.own_uuid or _new_id()
        elif "_id" not in out:
            out["_id"] = _new_id()
        order = list(_NODE_ORDER)
        if self.kind == "prefab":
            order.insert(order.index("_components") + 1, "_level")
        for tail in ("autoReleaseAssets", "_globals", "_id"):
            if tail not in order:
                order.append(tail)
        return _ordered(out, order)

    def _enrich_component(self, out):
        out.setdefault("_name", "")
        out.setdefault("_objFlags", 0)
        if not isinstance(out.get("node"), dict):
            out["node"] = None
        out.setdefault("_enabled", True)
        if "__prefab" not in out:
            out["__prefab"] = None
        if "_id" not in out:
            out["_id"] = _new_id()
        return _ordered(out, _COMP_FIRST)

    def _fix_prefab_info(self, out, src):
        asset_ref = src.get("asset")
        if isinstance(asset_ref, dict) and "__ref__" in asset_ref and self.own_uuid:
            target = self.resolved[asset_ref["__ref__"]]
            if isinstance(target, dict) and target.get("__type__") in ("cc.Prefab", "cc.SceneAsset"):
                out["asset"] = {"__uuid__": self.own_uuid}
        if self.kind == "prefab":
            out["root"] = {"__id__": 1}
        elif not isinstance(out.get("root"), dict):
            out["root"] = None
        for k in ("instance", "targetOverrides", "nestedPrefabInstanceRoots"):
            if out.get(k) is None:
                out.pop(k, None)
        out.setdefault("fileId", _new_id())
        return _ordered(out, ["__type__", "root", "asset", "fileId",
                              "instance", "targetOverrides", "nestedPrefabInstanceRoots"])

    def _fix_prefab_instance(self, out, src):
        owner = self.instance_owner.get(id(src))
        out["prefabRootNode"] = ({"__id__": self.index_of[id(owner)]}
                                 if owner is not None and id(owner) in self.index_of else None)
        return _ordered(out, ["__type__", "fileId", "prefabRootNode",
                              "propertyOverrides"])

    def _wrap_prefab_asset(self, out):
        out.setdefault("_name", "")
        out.setdefault("_objFlags", 0)
        out.setdefault("_native", "")
        out.setdefault("optimizationPolicy", 0)
        out.setdefault("asyncLoadAssets", False)
        return _ordered(out, ["__type__", "_name", "_objFlags", "_native",
                              "data", "optimizationPolicy", "asyncLoadAssets"])

    def _wrap_scene_asset(self, out):
        out.setdefault("_name", "")
        out.setdefault("_objFlags", 0)
        out.setdefault("_native", "")
        out.setdefault("asyncLoadAssets", False)
        return _ordered(out, ["__type__", "_name", "_objFlags", "_native",
                              "scene", "asyncLoadAssets"])


def to_prefab(resolved, root_index, own_uuid):
    return Editorizer(resolved, root_index, own_uuid=own_uuid, kind="prefab").build()


def to_scene(resolved, root_index, own_uuid=None):
    return Editorizer(resolved, root_index, own_uuid=own_uuid, kind="scene").build()


def to_raw_object(resolved, root_index):
    return Editorizer(resolved, root_index, kind="raw").build()
