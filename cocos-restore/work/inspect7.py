import sys, json
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
inv=all_inventory()
cfg,out,imp,nat,po=inv['game']
r=[x for x in out if x['path']=='prefab/game/GbzLvCommon'][0]
root,resolved=root_for_uuid_index('game',r['idx'])
data=root['data']
def find(o,t,seen):
    if id(o) in seen: return None
    seen.add(id(o))
    if isinstance(o,dict):
        if o.get('__type__')==t: return o
        for v in o.values():
            x=find(v,t,seen)
            if x: return x
    elif isinstance(o,list):
        for v in o:
            x=find(v,t,seen)
            if x: return x
    return None
pi=find(data,'cc.PrefabInstance',set())
print('PrefabInstance:')
print(json.dumps(pi,ensure_ascii=False,default=str,indent=1)[:4000])
