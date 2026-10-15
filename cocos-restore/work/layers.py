import sys, json
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
from collections import Counter
inv=all_inventory()
def walk_layers(o,seen,c):
    if id(o) in seen:return
    seen.add(id(o))
    if isinstance(o,dict):
        if o.get('__type__')=='cc.Node': c[o.get('_layer')]+=1
        for v in o.values():
            if k_skip(v): continue
            walk_layers(v,seen,c)
    elif isinstance(o,list):
        for v in o:
            if k_skip(v):continue
            walk_layers(v,seen,c)
def k_skip(v): return isinstance(v,dict) and '__ref__' in v and len(v)==1
c=Counter()
for b in ('game','secondary','fruits','vegetable'):
    cfg,out,imp,nat,po=inv[b]
    for r in out:
        if r['type']!='cc.Prefab':continue
        rt,_=root_for_uuid_index(b,r['idx'])
        if rt: walk_layers(rt,set(),c)
print('prefab node layers:',c)
# scene
raw=json.load(open(os.path.join(ROOT,'assets/start-scene/import/09/098e8e875.json')))
up=unpack.Unpacker(raw)
c2=Counter()
for sec in up.resolved:
    for o in sec:
        if isinstance(o,dict) and o.get('__type__')=='cc.Node': c2[o.get('_layer')]+=1
print('scene node layers:',c2)
# camera visibility
for sec in up.resolved:
    for o in sec:
        if isinstance(o,dict) and o.get('__type__')=='cc.Camera':
            print('camera visibility',o.get('_visibility'),'projection',o.get('_projection'),'ortho',o.get('_orthoHeight'))
