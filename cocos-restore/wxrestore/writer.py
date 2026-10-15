"""Write a restored editor asset tree from a global asset index."""
import hashlib
import json
import os
import re
import shutil

from . import ccon, editorize, images, metas
from .uuid import is_legacy_dashed_id, is_script_type_id
import re as _re

_FULL_UUID_RE = _re.compile(r"^[0-9a-f]{32}(?:@|$)")


def _is_real_uuid(u):
    return bool(_FULL_UUID_RE.match(u.replace("-", "")))

ENGINE_PREFIXES = ("cc.", "sp.", "dragonBones.", "cce.")

_DIR_UUID_CACHE = {}


def dir_uuid(rel_path):
    if rel_path in _DIR_UUID_CACHE:
        return _DIR_UUID_CACHE[rel_path]
    h = hashlib.md5(rel_path.encode("utf-8")).hexdigest()
    u = f"{h[:8]}-{h[8:12]}-4{h[13:16]}-a{h[17:20]}-{h[20:32]}"
    _DIR_UUID_CACHE[rel_path] = u
    return u


def safe_name(name):
    name = re.sub(r'[\\/:*?"<>|\x00-\x1f]', "_", name).strip().rstrip(".")
    return name or "unnamed"


class Report:
    def __init__(self):
        self.written = []
        self.cropped = []
        self.skipped = []
        self.missing_native = []
        self.failed = []
        self.no_pil_passthrough = []
        self.script_ids = set()
        self.legacy_script_ids = set()
        self.script_fields = {}

    def add_file(self, path):
        self.written.append(path)


class Writer:
    def __init__(self, game, entries, out_dir, builtin_uuids=None):
        self.game = game
        self.entries = entries
        self.out = out_dir
        self.builtin_uuids = builtin_uuids or set()
        self.report = Report()
        self._made_dirs = set()
        self._used_paths = {}

    # ---- helpers ---------------------------------------------------------
    def _write_json(self, abs_path, obj):
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        with open(abs_path, "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)
        self.report.add_file(abs_path)

    def _write_bytes(self, abs_path, data):
        os.makedirs(os.path.dirname(abs_path), exist_ok=True)
        with open(abs_path, "wb") as f:
            f.write(data)
        self.report.add_file(abs_path)

    def _copy(self, src, dst):
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        shutil.copyfile(src, dst)
        self.report.add_file(dst)

    def _uniq(self, rel_no_ext):
        p = self._used_paths.get(rel_no_ext)
        if p is None:
            self._used_paths[rel_no_ext] = 1
            return rel_no_ext
        self._used_paths[rel_no_ext] += 1
        return f"{rel_no_ext}_{p}"

    def _ensure_dir_meta(self, abs_dir, bundle_name=None):
        if abs_dir in self._made_dirs or not abs_dir.startswith(self.out):
            return
        self._made_dirs.add(abs_dir)
        parent = os.path.dirname(abs_dir)
        if parent != self.out and parent.startswith(self.out):
            self._ensure_dir_meta(parent)
        rel = os.path.relpath(abs_dir, self.out).replace(os.sep, "/")
        if os.path.exists(os.path.join(abs_dir, ".meta")):
            return
        m = metas.directory_meta(dir_uuid(rel), bundle_name if rel == bundle_name else None)
        with open(os.path.join(abs_dir, ".meta"), "w", encoding="utf-8") as f:
            json.dump(m, f, ensure_ascii=False, indent=2)

    def _rel_for_entry(self, e, default_bundle, sub="_misc"):
        """Source-relative file path without extension."""
        if e.path:
            parts = [safe_name(p) for p in e.path.split("/") if p]
            return os.path.join(default_bundle, *parts)
        name = safe_name(e.name or e.section[0].get("_name") or e.uuid[:8])
        return os.path.join(default_bundle, sub, self._uniq(name))

    # ---- main ------------------------------------------------------------
    def run(self):
        for e in self.entries.values():
            try:
                self._write_entry(e)
            except Exception as exc:
                self.report.failed.append((e.uuid, e.kind, repr(exc)))
        # directory metas for every directory containing files
        for path in list(self.report.written):
            self._ensure_dir_meta(os.path.dirname(path))
        return self.report

    def _write_entry(self, e):
        kind = e.kind
        if not _is_real_uuid(e.uuid):
            self.report.skipped.append((e.uuid, kind, e.path))
            return
        if e.uuid in self.builtin_uuids:
            self.report.skipped.append((e.uuid, "builtin-engine-asset", e.path))
            return
        if kind in ("cc.EffectAsset", "cc.Material", "cc.SpriteAtlas",
                    "cc.RenderPipeline", "cc.ForwardPipeline", None):
            self.report.skipped.append((e.uuid, kind, e.path))
            return
        if kind == "cc.SceneAsset":
            self._write_scene(e)
        elif kind == "cc.Prefab":
            self._write_prefab(e)
        elif kind in ("cc.ImageAsset", "cc.SpriteFrame"):
            self._write_image(e)
        elif kind == "cc.AudioClip":
            self._write_audio(e)
        elif kind == "cc.AnimationClip":
            self._write_anim(e)
        elif kind == "cc.JsonAsset":
            self._write_json_asset(e)
        elif kind == "cc.ParticleAsset":
            self._write_particle(e)
        elif kind == "cc.PhysicsMaterial":
            self._write_physics_material(e)
        else:
            self.report.skipped.append((e.uuid, kind, e.path))

    # ---- asset writers ---------------------------------------------------
    def _bundle_of(self, e):
        return e.rows[0][0] if e.rows else "assets"

    def _write_scene(self, e):
        bname, row = next((b, r) for b, r in e.rows if r.type == "cc.SceneAsset") \
            if any(r.type == "cc.SceneAsset" for _, r in e.rows) else e.rows[0]
        b = self.game[bname]
        root, resolved, _ = b.section_for(row.idx)
        out = editorize.to_scene(resolved, resolved.index(root), own_uuid=e.uuid)
        url = next(iter(b.config.get("scenes", {}).keys()), None)
        if url and url.startswith("db://assets/"):
            rel = url[len("db://assets/"):]
        else:
            rel = f"{bname}/{safe_name(root.get('_name') or 'scene')}.scene"
        dst = os.path.join(self.out, rel)
        self._write_json(dst, out)
        self._write_json(dst + ".meta", metas.scene_meta(e.uuid))
        self._scan_scripts(out)

    def _write_prefab(self, e):
        bname = self._bundle_of(e)
        # find a section that actually yields a cc.Prefab root
        chosen = None
        for bn, row in e.rows:
            root, resolved, _ = self.game[bn].section_for(row.idx)
            if isinstance(root, dict) and root.get("__type__") == "cc.Prefab":
                chosen = (root, resolved)
                bname = bn
                break
        if chosen is None:
            self.report.skipped.append((e.uuid, "cc.Prefab?", e.path))
            return
        root, resolved = chosen
        out = editorize.to_prefab(resolved, resolved.index(root), own_uuid=e.uuid)
        rel = self._rel_for_entry(e, bname, sub="_prefabs") + ".prefab"
        dst = os.path.join(self.out, rel)
        self._write_json(dst, out)
        sync_name = root.get("data") and None
        self._write_json(dst + ".meta", metas.prefab_meta(e.uuid, root.get("_name") or ""))
        self._scan_scripts(out)

    def _write_image(self, e):
        bname = self._bundle_of(e)
        rel_no_ext = self._rel_for_entry(e, bname, sub="_images")
        ext = e.native_ext or ".png"
        cropped = False
        img = None
        if e.native:
            ext = os.path.splitext(e.native)[1] or ext
            try:
                from PIL import Image
                img = Image.open(e.native)
                img.load()
            except Exception:
                img = None
        if img is None and e.native:
            # Pillow unavailable: pass standalone native files through byte-for-byte.
            # Dimensions are parsed from the PNG/JPEG header without third-party libs.
            size = images.image_size(e.native)
            if size is None:
                self.report.failed.append((e.uuid, "image-size", e.path))
                return
            w, h = size
            dst = os.path.join(self.out, rel_no_ext + ext)
            self._copy(e.native, dst)
            name = os.path.basename(rel_no_ext)
            has_alpha = ext.lower() not in (".jpg", ".jpeg")
            self._write_json(dst + ".meta",
                             metas.image_meta(e.uuid, name, w, h, ext, has_alpha))
            self.report.no_pil_passthrough.append((e.uuid, rel_no_ext + ext))
            return
        if img is None and e.sf_data and e.texture_source:
            try:
                atlas = self.entries.get(e.texture_source)
                if atlas and atlas.native:
                    img = images.crop_frame(e.sf_data, atlas.native)
                    ext = ".png"
                    cropped = True
            except ImportError:
                self.report.failed.append((e.uuid, "atlas-crop-needs-Pillow", e.path))
                return
        if img is None:
            self.report.missing_native.append((e.uuid, e.path))
            return
        if ext.lower() in (".jpg", ".jpeg"):
            has_alpha = img.mode in ("RGBA", "LA", "P") and (img.mode != "P")
            src_img = img.convert("RGB")
        else:
            if img.mode != "RGBA":
                img = img.convert("RGBA")
            src_img = img
            has_alpha = True
        w, h = src_img.size
        dst = os.path.join(self.out, rel_no_ext + ext)
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        src_img.save(dst)
        self.report.add_file(dst)
        name = os.path.basename(rel_no_ext)
        self._write_json(dst + ".meta",
                         metas.image_meta(e.uuid, name, w, h, ext, has_alpha))
        if cropped:
            self.report.cropped.append((rel_no_ext + ext, e.texture_source))

    def _write_audio(self, e):
        if not e.native:
            self.report.missing_native.append((e.uuid, e.path))
            return
        bname = self._bundle_of(e)
        ext = e.native_ext or ".mp3"
        rel = self._rel_for_entry(e, bname, sub="_audio") + ext
        dst = os.path.join(self.out, rel)
        self._copy(e.native, dst)
        self._write_json(dst + ".meta", metas.audio_meta(e.uuid, ext))

    def _write_anim(self, e):
        bname = self._bundle_of(e)
        row = next((r for bn, r in e.rows if bn == bname), e.rows[0][1])
        b = self.game[bname]
        path = b.disk_file(row, "import")
        data = open(path, "rb").read()
        if data[:4] != b"CCON":
            self.report.failed.append((e.uuid, "anim", "not CCON"))
            return
        doc = ccon.to_editor_doc(data)
        rel = self._rel_for_entry(e, bname, sub="_anim") + ".anim"
        dst = os.path.join(self.out, rel)
        self._write_json(dst, doc)
        name = os.path.basename(rel)[:-5]
        self._write_json(dst + ".meta", metas.anim_meta(e.uuid, name))

    def _write_json_asset(self, e):
        if not e.section:
            return
        root = e.section[0]
        payload = root.get("json")
        bname = self._bundle_of(e)
        rel = self._rel_for_entry(e, bname, sub="_data") + ".json"
        dst = os.path.join(self.out, rel)
        self._write_json(dst, payload)
        self._write_json(dst + ".meta", metas.json_meta(e.uuid))

    def _write_particle(self, e):
        if not e.native:
            self.report.missing_native.append((e.uuid, e.path))
            return
        bname = self._bundle_of(e)
        root = e.section[0] if e.section else {}
        name = safe_name(root.get("_name") or e.name or e.uuid[:8])
        rel = self._uniq(os.path.join(bname, "_particle", name)) + ".plist"
        dst = os.path.join(self.out, rel)
        self._copy(e.native, dst)
        self._write_json(dst + ".meta", metas.particle_meta(e.uuid))

    def _write_physics_material(self, e):
        if not e.section:
            return
        bname = self._bundle_of(e)
        root = e.section[0]
        obj = {
            "__type__": "cc.PhysicsMaterial",
            "_name": root.get("_name", ""),
            "_objFlags": 0,
            "_native": "",
        }
        for k in ("_friction", "_restitution", "_density", "restitution", "friction"):
            if k in root:
                obj[k] = root[k]
        rel = self._uniq(os.path.join(bname, "_physics",
                                      safe_name(root.get("_name") or "physicsMaterial"))) + ".pmtl"
        dst = os.path.join(self.out, rel)
        self._write_json(dst, obj)
        self._write_json(dst + ".meta", metas.physics_material_meta(e.uuid))

    # ---- script collection ----------------------------------------------
    def _scan_scripts(self, out_array):
        for o in out_array:
            if not isinstance(o, dict):
                continue
            t = o.get("__type__")
            if not t or t.startswith(ENGINE_PREFIXES):
                continue
            if is_script_type_id(t):
                if is_legacy_dashed_id(t):
                    self.report.legacy_script_ids.add(t)
                else:
                    self.report.script_ids.add(t)
                fields = self.report.script_fields.setdefault(t, {})
                for k, v in o.items():
                    if k in ("__type__", "node", "_name", "_objFlags", "_enabled",
                             "__prefab", "_id"):
                        continue
                    fields.setdefault(k, set()).add(self._value_kind(v))

    @staticmethod
    def _value_kind(v):
        if isinstance(v, dict):
            if "__uuid__" in v:
                return "asset"
            if "__id__" in v:
                return "node"
            if v.get("__type__") in ("cc.Vec2", "cc.Vec3", "cc.Vec4", "cc.Color", "cc.Size"):
                return v["__type__"][3:]
            return "object"
        if isinstance(v, list):
            return "array"
        if isinstance(v, bool):
            return "boolean"
        if isinstance(v, (int, float)):
            return "number"
        if isinstance(v, str):
            return "string"
        return "any"
