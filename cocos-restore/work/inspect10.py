import sys, json
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
inv=all_inventory()
def walk(o,seen,cb):
    if id(o) in seen: return
    seen.add(id(o))
    if isinstance(o,dict):
        cb(o)
        for v in o.values(): walk(v,seen,cb)
    elif isinstance(o,list):
        for v in o: walk(v,seen,cb)
cfg,out,imp,nat,po=inv['secondary']
r=[x for x in out if x['path']=='prefab/Home/GbzRankLayer'][0]
root,res=root_for_uuid_index('secondary',r['idx'])
def cb(o):
    if o.get('__type__')=='cc.PrefabInfo' and isinstance(o.get('instance'),dict):
        print('NESTED PrefabInfo:', json.dumps({k:v for k,v in o.items() if k!='root'},ensure_ascii=False,default=str)[:800])
        inst=o['instance']
        n=inst['prefabRootNode']
        print('nested root node name',n.get('_name'))
        np=n.get('_prefab')
        print('its prefabInfo:',json.dumps({k:v for k,v in np.items() if k!='root'},ensure_ascii=False,default=str)[:800])
walk(root,set(),cb)
# find PrefabLink anywhere
for b in ('game','secondary','fruits','vegetable'):
    cfg,out,imp,nat,po=inv[b]
    for rr in out:
        if rr['type']!='cc.Prefab': continue
        try: rt,_=root_for_uuid_index(b,rr['idx'])
        except: continue
        if not rt: continue
        def cb2(o):
            if o.get('__type__') in ('cc.PrefabLink',):
                print('PREFABLINK in',b,rr['path'],json.dumps(o,ensure_ascii=False,default=str)[:1500])
        walk(rt,set(),cb2)
