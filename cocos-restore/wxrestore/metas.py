"""Editor .meta file generators for Cocos Creator 3.8.x.

Versions/importer names were collected from 3.8.8 templates (taxi, empty-2d)
and the editor's own importer registry, then verified by real re-import.
"""


def base(ver, importer, uuid, files=None, user_data=None, sub_metas=None):
    return {
        "ver": ver,
        "importer": importer,
        "imported": True,
        "uuid": uuid,
        "files": files or [],
        "subMetas": sub_metas or {},
        "userData": user_data or {},
    }


def directory_meta(uuid, bundle_name=None):
    user = {}
    if bundle_name:
        user = {
            "isSubpackage": True,
            "subpackageName": bundle_name,
            "compressionType": {},
            "isRemoteBundle": {},
        }
    return base("1.2.0", "directory", uuid, [], user)


def prefab_meta(uuid, sync_node_name=None):
    user = {"syncNodeName": sync_node_name} if sync_node_name else {}
    return base("1.1.35", "prefab", uuid, [".json"], user)


def scene_meta(uuid):
    return base("1.1.50", "scene", uuid, [".json"], {})


def audio_meta(uuid, ext=".mp3"):
    return base("1.0.0", "audio-clip", uuid, [ext, ".json"], {"downloadMode": 0})


def json_meta(uuid):
    return base("2.0.1", "json", uuid, [".json"], {})


def anim_meta(uuid, name):
    return base("2.0.4", "animation-clip", uuid, [".bin"], {"name": name})


def particle_meta(uuid):
    return base("1.0.0", "particle", uuid, [".plist", ".json"], {})


def physics_material_meta(uuid):
    return base("1.0.1", "physics-material", uuid, [".json"], {})


def _verts(w, h):
    hw, hh = w / 2.0, h / 2.0
    return {
        "rawPosition": [-hw, -hh, 0, hw, -hh, 0, -hw, hh, 0, hw, hh, 0],
        "indexes": [0, 1, 2, 2, 1, 3],
        "uv": [0, h, w, h, 0, 0, w, 0],
        "nuv": [0, 0, 1, 0, 0, 1, 1, 1],
        "minPos": [-hw, -hh, 0],
        "maxPos": [hw, hh, 0],
    }


def image_meta(uuid, name, w, h, ext=".png", has_alpha=True):
    """Full-frame standalone image meta (sprite-frame type)."""
    sf_user = {
        "trimThreshold": 1,
        "rotated": False,
        "offsetX": 0,
        "offsetY": 0,
        "trimX": 0,
        "trimY": 0,
        "width": w,
        "height": h,
        "rawWidth": w,
        "rawHeight": h,
        "borderTop": 0,
        "borderBottom": 0,
        "borderLeft": 0,
        "borderRight": 0,
        "packable": True,
        "pixelsToUnit": 100,
        "pivotX": 0.5,
        "pivotY": 0.5,
        "meshType": 0,
        "vertices": _verts(w, h),
        "isUuid": True,
        "imageUuidOrDatabaseUri": f"{uuid}@6c48a",
        "atlasUuid": "",
        "trimType": "auto",
    }
    sprite_frame = {
        "importer": "sprite-frame",
        "uuid": f"{uuid}@f9941",
        "displayName": name,
        "id": "f9941",
        "name": "spriteFrame",
        "userData": sf_user,
        "ver": "1.0.12",
        "imported": True,
        "files": [".json"],
        "subMetas": {},
    }
    texture = {
        "importer": "texture",
        "uuid": f"{uuid}@6c48a",
        "displayName": name,
        "id": "6c48a",
        "name": "texture",
        "userData": {
            "wrapModeS": "clamp-to-edge",
            "wrapModeT": "clamp-to-edge",
            "imageUuidOrDatabaseUri": uuid,
            "isUuid": True,
            "visible": False,
            "minfilter": "linear",
            "magfilter": "linear",
            "mipfilter": "none",
            "anisotropy": 0,
        },
        "ver": "1.0.22",
        "imported": True,
        "files": [".json"],
        "subMetas": {},
    }
    files = [".json", ext] if ext == ".png" else [ext, ".json"]
    user = {
        "type": "sprite-frame",
        "fixAlphaTransparencyArtifacts": False,
        "hasAlpha": has_alpha,
        "redirect": f"{uuid}@6c48a",
    }
    return base("1.0.27", "image", uuid, files, user,
                sub_metas={"6c48a": texture, "f9941": sprite_frame})


def script_meta(uuid):
    return base("4.0.24", "typescript", uuid, [], {})
