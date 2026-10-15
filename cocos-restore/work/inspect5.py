import sys, json
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
inv=all_inventory()
for b in ('start-scene','game','secondary','fruits','vegetable'):
    cfg,out,imp,nat,po=inv[b]
    print(b, cfg['types'])
# expanded image import json resolved array
r=[x for x in inv['fruits'][1] if x['path']=='水果图标/西瓜'][0]
raw=json.load(open(os.path.join(ROOT,r['import_file'])))
up=unpack.Unpacker(raw)
print('sections',len(up.results),'resolved lens',[len(x) for x in up.resolved])
res=up.resolved[0]
for i,o in enumerate(res):
    print(' ',i, (o.get('__type__') or o.get('__custom__')) if isinstance(o,dict) else type(o).__name__, list(o.keys()) if isinstance(o,dict) else o)
print(json.dumps(res,ensure_ascii=False,default=str)[:3500])
