import sys, json
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
inv=all_inventory()
def find_all(o,t,seen,out):
    if id(o) in seen: return
    seen.add(id(o))
    if isinstance(o,dict):
        if o.get('__type__')==t: out.append(o)
        for v in o.values(): find_all(v,t,seen,out)
    elif isinstance(o,list):
        for v in o: find_all(v,t,seen,out)
for b in ('game','secondary','fruits','vegetable'):
    cfg,out,imp,nat,po=inv[b]
    for r in out:
        if r['type']!='cc.Prefab': continue
        try: root,res=root_for_uuid_index(b,r['idx'])
        except: continue
        if not root: continue
        hits=[]; find_all(root.get('data'),'cc.PrefabInstance',set(),hits)
        if hits:
            print('###',b,r['path'])
            for h in hits:
                print(json.dumps(h,ensure_ascii=False,default=str,indent=1)[:5000])
