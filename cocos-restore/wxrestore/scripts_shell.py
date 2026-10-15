"""Generate compilable empty script shells preserving original component ids.

For each custom component id found in scenes/prefabs:
- meta uuid = decompressed uuid (so the classId matches built references)
- @ccclass('<id>') keeps the runtime class name identical
- serialized property names are restored with loose types; method bodies empty
Legacy dashed ids (2.x migrated scripts) cannot be mapped back to a uuid;
a deterministic uuid is generated, the dashed literal is kept as ccclass and
registered as a one-way class-id alias via js.setClassAlias (the editor
derives the runtime class id from the meta uuid, which never matches a dashed
migrated id).
"""
import hashlib
import os

from .uuid import decompress_uuid, is_legacy_dashed_id
from . import metas

TYPE_MAP = {
    "number": ("number", "0", None),
    "boolean": ("boolean", "false", None),
    "string": ("string", "''", None),
    "node": ("Node", "null", "Node"),
    "asset": ("Asset", "null", "Asset"),
    "Vec2": ("Vec2", "null", "Vec2"),
    "Vec3": ("Vec3", "null", "Vec3"),
    "Vec4": ("Vec4", "null", "Vec4"),
    "Color": ("Color", "null", "Color"),
    "Size": ("Size", "null", "Size"),
    "array": ("any[]", "[]", None),
    "object": ("any", "null", None),
    "any": ("any", "null", None),
}


def legacy_uuid(script_id):
    h = hashlib.md5(script_id.encode("utf-8")).hexdigest()
    return f"{h[:8]}-{h[8:12]}-4{h[13:16]}-a{h[17:20]}-{h[20:32]}"


def class_name(index):
    return f"RestoredComponent_{index:03d}"


def field_decl(name, kinds):
    primitives = {"number", "boolean", "string"}
    if len(kinds) == 1:
        (kind,) = kinds
    else:
        kind = "any" if kinds - primitives else "number"
        if kinds - primitives:
            kind = "any"
    ts_type, default, cc_type = TYPE_MAP[kind]
    if cc_type:
        decorator = f"    @property({{ type: {cc_type} }})"
    else:
        decorator = "    @property"
    return f"{decorator}\n    public {name}: {ts_type} = {default};"


def script_source(script_id, classname, fields):
    legacy = is_legacy_dashed_id(script_id)
    imports = ["_decorator", "Component"]
    extra = sorted({TYPE_MAP[k][2] for ks in fields.values() for k in ks if TYPE_MAP[k][2]})
    imports += extra
    if legacy:
        imports.append("js")
    lines = [f"import {{ {', '.join(imports)} }} from 'cc';"]
    lines += ["const { ccclass, property } = _decorator", "",
              f"@ccclass('{script_id}')",
              f"export class {classname} extends Component {{"]
    for name in sorted(fields):
        lines.append(field_decl(name, fields[name]))
        lines.append("")
    lines.append("}")
    if legacy:
        # Editor derives the runtime class id from the script meta uuid, which
        # cannot match a 2.x migrated dashed id; register the dashed literal
        # as a one-way id alias so legacy serialized components resolve.
        lines += ["",
                  f"js.setClassAlias({classname}, '{script_id}');"]
    return "\n".join(lines) + "\n"


def write_scripts(script_fields, legacy_ids, out_assets_dir):
    base = os.path.join(out_assets_dir, "scripts", "restored")
    os.makedirs(base, exist_ok=True)
    all_ids = sorted(set(script_fields) | set(legacy_ids))
    manifest = {}
    for i, sid in enumerate(all_ids):
        cn = class_name(i)
        fields = script_fields.get(sid, {})
        src = script_source(sid, cn, fields)
        fname = f"{cn}.ts"
        with open(os.path.join(base, fname), "w", encoding="utf-8") as f:
            f.write(src)
        if is_legacy_dashed_id(sid):
            uuid = legacy_uuid(sid)
        else:
            uuid = decompress_uuid(sid)
        with open(os.path.join(base, fname + ".meta"), "w", encoding="utf-8") as f:
            import json
            json.dump(metas.script_meta(uuid), f, ensure_ascii=False, indent=2)
        manifest[sid] = {"file": f"scripts/restored/{fname}", "uuid": uuid,
                         "class": cn, "legacy": is_legacy_dashed_id(sid),
                         "fields": {k: sorted(v) for k, v in fields.items()}}
    return base, manifest
