"""Scaffold a Creator 3.8.x project around the restored assets."""
import json
import os
import shutil

TEMPLATE = "/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/templates/empty-2d"


def _dump(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)


def scaffold(out_dir, game_name, src_settings, scene_url, overwrite=False):
    if os.path.exists(os.path.join(out_dir, "package.json")) and not overwrite:
        pass
    else:
        for name in ("settings", ".creator", "profiles"):
            src = os.path.join(TEMPLATE, name)
            dst = os.path.join(out_dir, name)
            if os.path.exists(dst):
                shutil.rmtree(dst)
            shutil.copytree(src, dst)
        shutil.copyfile(os.path.join(TEMPLATE, "tsconfig.json"),
                        os.path.join(out_dir, "tsconfig.json"))
        shutil.copyfile(os.path.join(TEMPLATE, ".gitignore"),
                        os.path.join(out_dir, ".gitignore"))
    _dump(os.path.join(out_dir, "package.json"), {"name": game_name})

    # project settings: design resolution + physics 2D groups/matrix
    screen = (src_settings or {}).get("screen", {})
    dr = screen.get("designResolution", {})
    policy = dr.get("policy", 4)
    project = {
        "__version__": "1.0.6",
        "general": {
            "designResolution": {
                "width": dr.get("width", 960),
                "height": dr.get("height", 640),
                "fitWidth": bool(policy in (2, 4)),
                "fitHeight": bool(policy in (1, 4)),
            }
        },
    }
    phys = (src_settings or {}).get("physics")
    if phys:
        groups = [{"index": 0, "name": "DEFAULT"}]
        for g in phys.get("collisionGroups", []):
            groups.append({"index": g["index"], "name": g["name"]})
        matrix_in = phys.get("collisionMatrix", {})
        matrix = []
        for i in range(max(32, max((int(k) for k in matrix_in), default=0) + 1)):
            matrix.append(int(matrix_in.get(str(i), 0)))
        g = phys.get("gravity", {})
        project["physics2d"] = {
            "gravity": {"x": g.get("x", 0), "y": g.get("y", -10)},
            "allowSleep": phys.get("allowSleep", True),
            "sleepThreshold": phys.get("sleepThreshold", 0.1),
            "autoSimulation": phys.get("autoSimulation", True),
            "fixedTimeStep": phys.get("fixedTimeStep", 1 / 60),
            "maxSubSteps": phys.get("maxSubSteps", 1),
            "collisionGroups": groups,
            "collisionMatrix": matrix,
        }
    _dump(os.path.join(out_dir, "settings", "v2", "packages", "project.json"), project)

    # builder: remember original launch scene
    if scene_url:
        _dump(os.path.join(out_dir, "settings", "v2", "packages", "builder.json"),
              {"__version__": "1.3.9", "startScene": scene_url})

    os.makedirs(os.path.join(out_dir, "assets"), exist_ok=True)
