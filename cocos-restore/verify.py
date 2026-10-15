#!/usr/bin/env python3
"""Headless integrity check for a restored project.

Checks:
  1. every .scene/.prefab/.anim/.plist/.json under assets parses;
  2. duplicate meta uuids;
  3. {__uuid__} references resolve to an emitted asset or an engine builtin;
  4. {__id__} references stay inside the same serialized array;
  5. custom-script component types resolve to generated .ts meta uuids.
"""
import argparse
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from wxrestore.builtins import load_builtin_uuids
from wxrestore.uuid import decompress_uuid, is_legacy_dashed_id, is_script_type_id

DOC_EXTS = (".scene", ".prefab", ".anim", ".plist", ".json")


def collect_meta_uuids(assets_dir):
    uuid_to_files = {}
    sub_uuids = set()
    for dp, _d, fns in os.walk(assets_dir):
        for fn in fns:
            if not fn.endswith(".meta"):
                continue
            p = os.path.join(dp, fn)
            try:
                m = json.load(open(p, encoding="utf-8"))
            except Exception as e:
                yield ("meta-parse", p, str(e))
                continue
            top = m.get("uuid")
            if isinstance(top, str):
                uuid_to_files.setdefault(top, []).append(p)
            for sub in (m.get("subMetas") or {}).values():
                if isinstance(sub, dict) and isinstance(sub.get("uuid"), str):
                    sub_uuids.add(sub["uuid"])
    for u, ps in uuid_to_files.items():
        if len(ps) > 1:
            yield ("duplicate-uuid", u, ps)
    yield ("__uuids__", set(uuid_to_files) | sub_uuids, None)


def walk_refs(o, doc, stats):
    if isinstance(o, dict):
        if "__uuid__" in o and isinstance(o["__uuid__"], str):
            stats["uuid_refs"].add(o["__uuid__"].split("@", 1)[0])
        if "__id__" in o and isinstance(o["__id__"], int):
            stats["id_refs"].append(o["__id__"])
        t = o.get("__type__")
        if isinstance(t, str) and is_script_type_id(t):
            stats["script_types"].add(t)
        for v in o.values():
            walk_refs(v, doc, stats)
    elif isinstance(o, list):
        for v in o:
            walk_refs(v, doc, stats)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("project")
    ap.add_argument(
        "--src",
        help="original unpacked game dir; enables degraded-ref classification",
    )
    args = ap.parse_args()
    assets = os.path.join(args.project, "assets")

    problems = []
    gen = collect_meta_uuids(assets)
    emitted = set()
    for kind, a, b in gen:
        if kind == "__uuids__":
            emitted = a
        elif kind == "duplicate-uuid":
            problems.append(("duplicate-uuid", a, b))
        else:
            problems.append((kind, a, b))

    builtin = load_builtin_uuids()
    source_entries = {}
    if args.src:
        from wxrestore.bundle import load_game
        from wxrestore.indexer import build_index
        source_entries = build_index(load_game(args.src))
    docs = []
    for dp, _d, fns in os.walk(assets):
        for fn in fns:
            if fn.endswith(".meta") or not fn.endswith(DOC_EXTS):
                continue
            docs.append(os.path.join(dp, fn))

    total_refs = unresolved = bad_id = 0
    script_types = set()
    for p in sorted(docs):
        try:
            doc = json.load(open(p, encoding="utf-8"))
        except Exception as e:
            problems.append(("doc-parse", p, str(e)))
            continue
        if not isinstance(doc, list):
            continue
        stats = {"uuid_refs": set(), "id_refs": [], "script_types": set()}
        walk_refs(doc, doc, stats)
        script_types |= stats["script_types"]
        for r in stats["uuid_refs"]:
            total_refs += 1
            full = decompress_uuid(r)
            if full not in emitted and full not in builtin and r not in emitted:
                src = source_entries.get(full)
                if src is not None:
                    problems.append(("degraded-ref", os.path.relpath(p, args.project),
                                     f"{full} ({src.kind}, not reconstructed by B-tier policy)"))
                else:
                    unresolved += 1
                    problems.append(("unresolved-uuid", os.path.relpath(p, args.project), full))
        for i in stats["id_refs"]:
            if i < 0 or i >= len(doc):
                bad_id += 1
                problems.append(("bad-id", os.path.relpath(p, args.project), i))

    ts_meta_uuids = set()
    legacy_seen = set()
    for dp, _d, fns in os.walk(assets):
        for fn in fns:
            if fn.endswith(".ts.meta"):
                m = json.load(open(os.path.join(dp, fn), encoding="utf-8"))
                u = m.get("uuid")
                if u:
                    ts_meta_uuids.add(u)
    missing_scripts = []
    for t in script_types:
        if is_legacy_dashed_id(t):
            legacy_seen.add(t)
            continue
        full = decompress_uuid(t)
        if full not in ts_meta_uuids:
            missing_scripts.append(t)
            problems.append(("missing-script-shell", t, full))

    summary = {
        "documents": len(docs),
        "emitted_meta_uuids": len(emitted),
        "uuid_refs": total_refs,
        "unresolved_uuid_refs": unresolved,
        "bad_id_refs": bad_id,
        "script_types_used": len(script_types),
        "legacy_script_ids": sorted(legacy_seen),
        "missing_script_shells": missing_scripts,
        "problems": problems,
        "ok": all(x[0] != "unresolved-uuid" for x in problems)
        and all(x[0] not in ("doc-parse", "meta-parse", "duplicate-uuid",
                             "bad-id", "missing-script-shell") for x in problems),
    }
    print(json.dumps(summary, ensure_ascii=False, indent=2))
    sys.exit(0 if summary["ok"] else 1)


if __name__ == "__main__":
    main()
