import sys, json
sys.path.insert(0, '.')
from wxrestore.bundle import load_game

def show(o, depth=0, seen=None, maxd=4):
    if seen is None: seen = set()
    ind = '  ' * depth
    if isinstance(o, dict):
        if '__type__' in o or '__vt__' in o or '__custom__' in o:
            tag = o.get('__type__') or ('VT:'+o.get('__vt__')) or ('CUSTOM:'+o.get('__custom__'))
            oid = id(o)
            cyc = oid in seen
            print(f"{ind}<{tag}>" + (" ...(cycle)" if cyc else ""))
            if cyc or depth >= maxd: return
            seen.add(oid)
            for k, v in o.items():
                if k in ('__type__','__vt__','__custom__'): continue
                print(f"{ind}  {k}:")
                show(v, depth+2, seen, maxd)
            seen.discard(oid)
        else:
            print(ind + str({k: (v if not isinstance(v,(dict,list)) else '...') for k,v in o.items()}))
    elif isinstance(o, list):
        print(f"{ind}[{len(o)}]")
        if depth < maxd:
            for v in o[:20]:
                show(v, depth+1, seen, maxd)
    else:
        print(f"{ind}{o!r}")

if __name__ == '__main__':
    game = load_game('/Users/zidong.wang/aiwork/game_unpack/package/wxf41b76649658b9e3_unpacked')
    b = game[sys.argv[1]]
    idx = int(sys.argv[2])
    root, resolved, path = b.section_for(idx)
    print('file:', path, 'sections objs:', len(resolved))
    show(resolved[int(sys.argv[3]) if len(sys.argv)>3 else 1])
