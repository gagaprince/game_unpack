import sys, json
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
inv=all_inventory()
cfg,out,imp,nat,po=inv['secondary']
r=[x for x in out if x['path']=='prefab/Home/GbzRankLayer'][0]
root,resolved=root_for_uuid_index('secondary',r['idx'])
data=root['data']
# walk and print nodes whose _prefab has instance
def walk(o,seen,depth=0,path='root'):
    if id(o) in seen: return
    seen.add(id(o))
    if isinstance(o,dict):
        if o.get('__type__')=='cc.Node':
            p=o.get('_prefab')
            inst = p.get('instance') if isinstance(p,dict) else None
            print(path, 'node',o.get('_name'),'prefabInfo keys', list(p.keys()) if isinstance(p,dict) else p, 'instance?',bool(inst))
        if o.get('__type__')=='cc.PrefabInstance':
            print('  PrefabInstance keys:',list(o.keys()))
            for k,v in o.items():
                if k in ('propertyOverrides',): 
                    print('   overrides',len(v)); continue
                print('   ',k,'=',json.dumps(v,ensure_ascii=False,default=str)[:200])
        for k,v in o.items(): walk(v,seen,depth+1,path+'.'+k)
    elif isinstance(o,list):
        for i,v in enumerate(o): walk(v,seen,depth+1,path+'[%d]'%i)
walk(data,set())
