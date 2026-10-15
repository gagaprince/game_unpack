import sys, json
sys.path.insert(0, '/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
inv = all_inventory()
cfg,out,imp,nat,po = inv['fruits']
for r in out:
    if r['path']=='prefab/fruit1' or r['path'].endswith('fruit1'):
        print(json.dumps(r,ensure_ascii=False))
# dump fruit1 fully resolved
r=[x for x in out if x['type']=='cc.Prefab' and 'fruit1' in x['path']][0]
root,resolved=get_prefab('fruits',r['idx'])
print("ROOT keys:", list(root.keys()))
data=root['data']
def show(o,depth=0,maxd=6):
    if depth>maxd: return
    if isinstance(o,dict):
        keys=[k for k in o.keys()]
        print('  '*depth+ (o.get('__type__','?') if '__type__' in o else '{%s}'%','.join(keys)[:80]))
        for k,v in o.items():
            if k=='__type__':continue
            if isinstance(v,(dict,list)):
                print('  '*depth+'.'+k+':')
                show(v,depth+1,maxd)
            else:
                print('  '*depth+'.'+k+' = '+json.dumps(v,ensure_ascii=False)[:120])
    elif isinstance(o,list):
        print('  '*depth+'[%d]'%len(o))
        for i,v in enumerate(o[:10]): show(v,depth+1,maxd)
show(data)
