"""Built-in engine asset UUIDs.

Cocos builds can embed copies of engine built-in assets (default particle
plist, default UI images, ...).  Materializing those into the restored
project collides with the editor's own read-only copies, so they must be
skipped; uuid references still resolve to the built-ins automatically.
"""
import json
import os


def default_editor_app():
    base = "/Applications/Cocos/Creator"
    if not os.path.isdir(base):
        return None
    versions = sorted(
        d for d in os.listdir(base)
        if os.path.isdir(os.path.join(base, d)) and d[0].isdigit()
    )
    if not versions:
        return None
    return os.path.join(base, versions[-1], "CocosCreator.app")


def builtin_assets_root(editor_app):
    return os.path.join(
        editor_app,
        "Contents", "Resources", "resources", "3d", "engine",
        "editor", "assets",
    )


def load_builtin_uuids(editor_app=None):
    """Return a set of fully-dashed uuids shipped inside the editor app."""
    editor_app = editor_app or default_editor_app()
    uuids = set()
    if not editor_app:
        return uuids
    root = builtin_assets_root(editor_app)
    if not os.path.isdir(root):
        return uuids
    for dirpath, _dirs, files in os.walk(root):
        for fn in files:
            if not fn.endswith(".meta"):
                continue
            try:
                with open(os.path.join(dirpath, fn), encoding="utf-8") as f:
                    meta = json.load(f)
            except Exception:
                continue
            top = meta.get("uuid")
            if isinstance(top, str):
                uuids.add(top.split("@", 1)[0])
            for sub in (meta.get("subMetas") or {}).values():
                if isinstance(sub, dict) and isinstance(sub.get("uuid"), str):
                    uuids.add(sub["uuid"].split("@", 1)[0])
    return uuids
