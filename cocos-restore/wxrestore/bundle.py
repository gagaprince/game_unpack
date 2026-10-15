"""Read a built bundle directory (config.json + import/ + native/)."""
import json
import os

from . import packed
from .uuid import decompress_uuid


def discover_bundles(root):
    """Return {bundle_name: dir_abs_path} from an unpacked WeChat game dir."""
    bundles = {}
    for parent in ("assets", "subpackages", "remote", ""):
        base = os.path.join(root, parent) if parent else root
        if not os.path.isdir(base):
            continue
        for name in sorted(os.listdir(base)):
            d = os.path.join(base, name)
            if os.path.isfile(os.path.join(d, "config.json")):
                bundles[name] = d
    return bundles


class AssetRow:
    def __init__(self, idx, uuid, path, type_name, bundle):
        self.idx = idx
        self.uuid = uuid                    # possibly compressed, possibly @sub
        self.base_uuid = uuid.split("@")[0]
        self.sub = uuid.split("@")[1] if "@" in uuid else ""
        self.path = path
        self.type = type_name
        self.bundle = bundle

    @property
    def full_uuid(self):
        return decompress_uuid(self.uuid)


class Bundle:
    def __init__(self, name, root_dir):
        self.name = name
        self.dir = root_dir
        with open(os.path.join(root_dir, "config.json"), encoding="utf-8") as f:
            self.config = json.load(f)
        self.uuids = self.config.get("uuids", [])
        self.types = self.config.get("types", [])
        self.paths = self.config.get("paths", {})
        self.packs = self.config.get("packs", {})
        self.rows = []
        idxmap = {}
        for k, (p, ti, cnt) in self.paths.items():
            for off in range(cnt):
                tname = self.types[ti] if ti < len(self.types) else f"type{ti}"
                idxmap[int(k) + off] = (p if off == 0 else f"{p}_{off}", tname)
        for i, u in enumerate(self.uuids):
            p, t = idxmap.get(i, ("", ""))
            self.rows.append(AssetRow(i, u, p, t, self.name))
        self._import = self._scan("import")
        self._native = self._scan("native")
        self._pack_cache = {}

    def _scan(self, sub):
        res = {}
        d = os.path.join(self.dir, sub)
        if not os.path.isdir(d):
            return res
        for dp, _, fs in os.walk(d):
            for fn in fs:
                key = os.path.splitext(fn)[0]
                res[key] = os.path.join(dp, fn)
        return res

    def disk_file(self, row, kind):
        table = self._import if kind == "import" else self._native
        fid = row.base_uuid
        if fid in table:
            return table[fid]
        full = decompress_uuid(fid)
        if full in table:
            return table[full]
        # short pack file name lookup by prefix
        if len(fid) <= 9:
            d = os.path.join(self.dir, kind, fid[:2])
            if os.path.isdir(d):
                for f in os.listdir(d):
                    if f.startswith(fid):
                        return os.path.join(d, f)
        return None

    @property
    def pack_of(self):
        m = {}
        for pid, indices in self.packs.items():
            for i in indices:
                m[i] = pid
        return m

    def _load_pack(self, pack_id):
        if pack_id in self._pack_cache:
            return self._pack_cache[pack_id]
        candidates = [
            os.path.join(self.dir, "import", pack_id[:2], pack_id + ".json"),
        ]
        path = next((p for p in candidates if os.path.exists(p)), None)
        if path is None:
            d = os.path.join(self.dir, "import", pack_id[:2])
            if os.path.isdir(d):
                for f in os.listdir(d):
                    if f.startswith(pack_id):
                        path = os.path.join(d, f)
                        break
        with open(path, encoding="utf-8") as f:
            raw = json.load(f)
        if isinstance(raw, dict):
            # typed mini-pack, e.g. {"type": "cc.Texture2D",
            # "data": [["2,2,2,2,0,0", ["imageUuid", ...]], ...]}
            self._pack_cache[pack_id] = (self.config["packs"][pack_id], raw, path)
            return self._pack_cache[pack_id]
        up = packed.Unpacker(raw)
        self._pack_cache[pack_id] = (self.config["packs"][pack_id], up, path)
        return self._pack_cache[pack_id]

    def section_for(self, idx):
        """Return (root_object, resolved_array, source_path).

        Packed indices take priority: a sub-asset (e.g. image SpriteFrame)
        shares the image uuid on disk but its data lives inside the pack.
        """
        pid = self.pack_of.get(idx)
        if pid is not None:
            indices, up, path = self._load_pack(pid)
            if isinstance(up, dict):
                return None, None, path
            pos = indices.index(idx)
            return up.results[pos], up.resolved[pos], path
        row = self.rows[idx]
        imp = self.disk_file(row, "import")
        if imp:
            with open(imp, encoding="utf-8") as f:
                raw = json.load(f)
            if not isinstance(raw, list) or not raw or not isinstance(raw[0], int):
                return None, None, imp
            up = packed.Unpacker(raw)
            return up.results[0], up.resolved[0], imp
        return None, None, None

    def section_for_row(self, row):
        return self.section_for(row.idx)

    def all_sections_in_file(self, path):
        with open(path, encoding="utf-8") as f:
            raw = json.load(f)
        up = packed.Unpacker(raw)
        return up.results


def load_game(root):
    """Load every on-disk bundle under the unpacked game directory."""
    return {name: Bundle(name, d) for name, d in discover_bundles(root).items()}
