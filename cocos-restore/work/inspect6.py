import sys, json, os
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
from inventory import decompress_uuid
inv=all_inventory()
allshort={}
for b,(cfg,out,imp,nat,po) in inv.items():
    for r in out: allshort[r['uuid_short'].split('@')[0]]=(b,r['path'],r['type'])
u='fdoJXLgx1GAa2UhGATlj3o'
print(u,'->',decompress_uuid(u),'in inventory?',decompress_uuid(u) in allshort or u in allshort)
for b,(cfg,out,imp,nat,po) in inv.items():
    for fkey,f in imp.items():
        p=os.path.join(ROOT,f)
        try: raw=json.load(open(p))
        except: continue
        if not isinstance(raw,list) or not raw or not isinstance(raw[0],int): continue
        try: up=unpack.Unpacker(raw)
        except Exception as e: continue
        for s,sec in enumerate(up.resolved):
            for o in sec:
                if isinstance(o,dict) and o.get('__type__') in ('cc.Material','cc.EffectAsset'):
                    print(b,fkey,'sec',s,o.get('__type__'),json.dumps(o,ensure_ascii=False,default=str)[:400])
