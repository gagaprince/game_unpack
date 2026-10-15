import sys, json; sys.path.insert(0,'/tmp/cocos_unpack')
import unpack
path = sys.argv[1]
raw = json.load(open(path))
up = unpack.Unpacker(raw)
roots = list(zip(up.results, up.resolved))

def resolve_factory(resolved):
    def resolve(o):
        if isinstance(o, dict):
            if set(o.keys()) == {'__ref__'}:
                return resolved[o['__ref__']]
            return {k: resolve(v) for k,v in o.items()}
        if isinstance(o, list):
            return [resolve(x) for x in o]
        return o
    return resolve

target = int(sys.argv[2]) if len(sys.argv) > 2 else None
for idx,(root,resolved) in enumerate(roots):
    if target is not None and idx != target: continue
    root = resolve_factory(resolved)(root)
    print("="*80)
    print("SECTION", idx, "ROOT", root.get('__type__') or root.get('__custom__'), root.get('_name',''))
    if isinstance(root, dict) and '__custom__' in root:
        print(json.dumps(root.get('data'), ensure_ascii=False)[:500]); continue
    if root.get('__type__') == 'cc.SceneAsset':
        scene = root.get('scene')
        def dump_node(n, depth=0):
            name = n.get('_name'); active = n.get('_active')
            comps = n.get('_components') or []
            print('  '*depth + '- NODE %r active=%s lpos=%s' % (name, active, (n.get('_lpos') or {}).get('v', n.get('_lpos'))))
            for c in comps:
                if not isinstance(c, dict): continue
                t = c.get('__type__','?')
                detail = {k:v for k,v in c.items() if k not in ('node','__type__') and not (isinstance(v,dict) and '__vt__' in v)}
                print('  '*(depth+1) + '[%s] %s' % (t, json.dumps(detail, ensure_ascii=False)[:300]))
            for ch in (n.get('_children') or []):
                dump_node(ch, depth+1)
        dump_node(scene)
