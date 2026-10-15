#!/usr/bin/env python3
"""wxrestore: restore a WeChat mini-game (Cocos Creator 3.x build) into a
Creator project that opens in the editor.

Usage: python3 restore.py <unpacked_game_dir> <output_project_dir>
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from wxrestore.bundle import load_game, discover_bundles
from wxrestore.builtins import load_builtin_uuids, default_editor_app
from wxrestore.indexer import build_index
from wxrestore.writer import Writer
from wxrestore.scripts_shell import write_scripts
from wxrestore import project


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--name", default="restored-game")
    ap.add_argument(
        "--editor",
        default=None,
        help="CocosCreator.app path (default: newest version under /Applications/Cocos/Creator)",
    )
    args = ap.parse_args()

    print("[1/5] scanning bundles ...")
    available = discover_bundles(args.src)
    game = load_game(args.src)
    print("      on-disk bundles:", ", ".join(sorted(game)))

    print("[2/5] building global asset index ...")
    entries = build_index(game)

    print("[3/5] scaffolding project ...")
    settings_path = os.path.join(args.src, "src", "settings.json")
    src_settings = json.load(open(settings_path, encoding="utf-8")) if os.path.exists(settings_path) else {}
    launch = (src_settings.get("launch") or {}).get("launchScene")
    project.scaffold(args.out, args.name, src_settings, launch)
    assets_dir = os.path.join(args.out, "assets")

    print("[4/5] writing assets ...")
    editor_app = args.editor or default_editor_app()
    builtin_uuids = load_builtin_uuids(editor_app)
    print(f"      builtin uuids excluded: {len(builtin_uuids)} ({editor_app})")
    w = Writer(game, entries, assets_dir, builtin_uuids=builtin_uuids)
    report = w.run()

    print("[5/5] generating script shells ...")
    scripts_dir, manifest = write_scripts(report.script_fields,
                                           report.legacy_script_ids, assets_dir)

    # restore report
    declared = set()
    cfg = src_settings.get("assets") or {}
    # declared subpackages come from game.json
    game_json = os.path.join(args.src, "game.json")
    missing_bundles = []
    if os.path.exists(game_json):
        gj = json.load(open(game_json, encoding="utf-8"))
        sub = gj.get("subPackages") or []
        for p in sub:
            root = p.get("root", "")
            name = root.rstrip("/").split("/")[-1]
            declared.append(name)
            if name not in game:
                missing_bundles.append(name)

    rep = {
        "source": args.src,
        "bundles_on_disk": sorted(game),
        "declared_subpackages": declared,
        "missing_bundles": missing_bundles,
        "counts": {
            "written_files": len(report.written),
            "cropped_from_atlas": len(report.cropped),
            "skipped": len(report.skipped),
            "skipped_builtin": sum(1 for x in report.skipped if x[1] == "builtin-engine-asset"),
            "missing_native": len(report.missing_native),
            "no_pil_passthrough": len(report.no_pil_passthrough),
            "failed": len(report.failed),
            "scripts": len(manifest),
            "legacy_scripts": sorted(report.legacy_script_ids),
        },
        "cropped": report.cropped,
        "skipped_assets": report.skipped,
        "missing_native": report.missing_native,
        "failed": report.failed,
        "scripts": manifest,
        "launch_scene": launch,
        "degraded_notes": [
            "custom cc.Material/cc.EffectAsset not reconstructed (build only contains compiled EffectAsset descriptors, not .effect source); dangling material refs fall back to builtin materials",
            "engine built-in assets found inside the build are not emitted; their uuids resolve to the editor's own built-in copies",
            "SpriteAtlas/AutoAtlas assets are not rebuilt; frames are exported as standalone images with original uuids",
            "script files are empty property shells (method bodies unavailable in compiled builds)",
        ],
    }
    rp = os.path.join(args.out, "restore-report.json")
    with open(rp, "w", encoding="utf-8") as f:
        json.dump(rep, f, ensure_ascii=False, indent=2,
                  default=lambda o: sorted(o) if isinstance(o, set) else str(o))

    print(json.dumps(rep["counts"], ensure_ascii=False, indent=2))
    print("report:", rp)


if __name__ == "__main__":
    main()
