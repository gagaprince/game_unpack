import sys, json
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
inv=all_inventory()
def dump_asset(b, pred, n=1):
    cfg,out,imp,nat,po=inv[b]
    c=0
    for r in out:
        if not pred(r): continue
        root,resolved=root_for_uuid_index(b,r['idx'])
        print('###',b,r['type'],r['path'],r['uuid_short'])
        print(json.dumps(root,ensure_ascii=False,default=str)[:1600])
        c+=1
        if c>=n: break
# one spriteframe
dump_asset('fruits', lambda r: r['type']=='cc.SpriteFrame' and r['path'].endswith('spriteFrame'))
dump_asset('game', lambda r: r['type']=='cc.Material')
dump_asset('start-scene', lambda r: r['type']=='cc.PhysicsMaterial')
dump_asset('game', lambda r: r['type']=='cc.JsonAsset')
dump_asset('game', lambda r: r['type']=='cc.ParticleAsset')
dump_asset('game', lambda r: r['type']=='cc.SpriteAtlas')
