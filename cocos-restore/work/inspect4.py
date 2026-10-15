import sys, json
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
inv=all_inventory()
for b in ('start-scene','game','secondary','fruits','vegetable'):
    cfg,out,imp,nat,po=inv[b]
    for r in out:
        if r['type'] in ('cc.Material','cc.ParticleAsset','cc.EffectAsset'):
            print(b,r['type'],r['path'],r['uuid_short'],'pack',r['in_pack'],'nat',r['native_file'])
# image section: watermelon base uuid idx
cfg,out,imp,nat,po=inv['fruits']
rows=[r for r in out if '西瓜' in r['path']]
for r in rows: print(r['idx'],r['type'],r['path'],r['uuid_short'],'pack',r['in_pack'])
base=[r for r in rows if r['type']=='cc.ImageAsset'][0]
pid=po[base['idx']]
print('pack id',pid, 'indices', cfg['packs'][pid])
raw,up,pf=get_pack('fruits',pid)
pos=cfg['packs'][pid].index(base['idx'])
res=up.resolved[pos]
print('section object count',len(res))
for i,o in enumerate(res):
    print(' ',i, o.get('__type__') or o.get('__custom__'), list(o.keys()) if isinstance(o,dict) else type(o))
print(json.dumps(res,ensure_ascii=False,default=str)[:3000])
