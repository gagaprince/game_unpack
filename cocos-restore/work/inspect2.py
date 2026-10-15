import sys, json
sys.path.insert(0, '/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
inv = all_inventory()
cfg,out,imp,nat,po = inv['fruits']
r=[x for x in out if x['type']=='cc.Prefab' and x['path']=='fruit1'][0]
root,resolved = root_for_uuid_index('fruits', r['idx'])
print("n instances:", len(resolved))
for i,o in enumerate(resolved):
    if not isinstance(o,dict):
        print(i, type(o).__name__, json.dumps(o,ensure_ascii=False)[:80]); continue
    print(i, o.get('__type__') or o.get('__custom__'), '| keys:', [k for k in o.keys() if k not in ('__type__',)])
print("="*40, "RAW-ish JSON of key objects")
for i,o in enumerate(resolved):
    print("----", i)
    print(json.dumps(o,ensure_ascii=False,default=str)[:900])
