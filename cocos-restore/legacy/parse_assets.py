import sys, os, json; sys.path.insert(0,'/tmp/cocos_unpack')
import unpack
from inventory import all_inventory, BUNDLES, ROOT

inv = all_inventory()

def pack_file(bundle, packid):
    bdir = BUNDLES[bundle]
    # packid may be compressed uuid or short hex
    cands = [os.path.join(ROOT,bdir,'import',packid[:2],packid+'.json')]
    for c in cands:
        if os.path.exists(c): return c
    # search
    d = os.path.join(ROOT,bdir,'import',packid[:2])
    if os.path.isdir(d):
        for f in os.listdir(d):
            if f.startswith(packid): return os.path.join(d,f)
    return None

_cache = {}
def get_pack(bundle, packid):
    key=(bundle,packid)
    if key in _cache: return _cache[key]
    pf = pack_file(bundle, packid)
    raw = json.load(open(pf))
    up = unpack.Unpacker(raw)
    _cache[key] = (raw, up, pf)
    return _cache[key]

def root_for_uuid_index(bundle, idx):
    cfg, out, imp, nat, pack_of = inv[bundle]
    r = out[idx]
    if r['import_file']:
        raw = json.load(open(os.path.join(ROOT, r['import_file'])))
        up = unpack.Unpacker(raw)
        return up.results[0], up.resolved[0]
    pid = pack_of.get(idx)
    if pid is None: return None, None
    raw, up, pf = get_pack(bundle, pid)
    # find section whose root uuid corresponds: use pack indices order
    indices = cfg['packs'][pid]
    pos = indices.index(idx)
    return up.results[pos], up.resolved[pos]

if __name__=='__main__':
    # quick test on a known prefab uuid index
    import sys
    b='secondary'
    cfg, out, imp, nat, pack_of = inv[b]
    pref=[r for r in out if r['type']=='cc.Prefab']
    r = pref[0]
    print("test:", r['path'], r['uuid_short'], 'pack', pack_of.get(r['idx']))
    root, resolved = root_for_uuid_index(b, r['idx'])
    print(root.get('__type__'), list(root.keys()))

def resolve_refs(root, resolved):
    # in-place, identity-preserving, cycle-safe
    def fix(o, seen):
        if id(o) in seen: return
        seen.add(id(o))
        if isinstance(o, dict):
            for k,v in list(o.items()):
                if isinstance(v, dict) and set(v.keys())=={'__ref__'}:
                    o[k]=resolved[v['__ref__']]
                fix(o[k], seen)
        elif isinstance(o, list):
            for i,v in enumerate(o):
                if isinstance(v, dict) and set(v.keys())=={'__ref__'}:
                    o[i]=resolved[v['__ref__']]
                fix(o[i], seen)
    for inst in resolved:
        if inst is not None: fix(inst, set())
    return root

def dump_prefab_node(n, depth=0, lines=None, custom_stats=None, maxdepth=99):
    if lines is None: lines=[]
    if not isinstance(n,dict): return lines
    nm=n.get('_name'); active=n.get('_active')
    lines.append('  '*depth + f"- {nm!r} active={active}")
    for c in (n.get('_components') or []):
        if not isinstance(c,dict): continue
        t=c.get('__type__','?')
        props={k:v for k,v in c.items() if k not in ('__type__','node')}
        if not t.startswith('cc.') and not t.startswith('sp.'):
            if custom_stats is not None:
                custom_stats.setdefault(t, []).append((nm, list(props.keys())))
        lines.append('  '*(depth+1) + f"[{t}] " + json.dumps(props,ensure_ascii=False,default=str)[:400])
    if depth<maxdepth:
        for ch in (n.get('_children') or []):
            dump_prefab_node(ch,depth+1,lines,custom_stats,maxdepth)
    return lines

def get_prefab(bundle, idx, resolve=True):
    root, resolved = root_for_uuid_index(bundle, idx)
    if root is None: return None,None
    if resolve:
        root = resolve_refs(root, resolved)
    return root, resolved
