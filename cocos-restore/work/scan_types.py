import sys, json, os
sys.path.insert(0,'/Users/zidong.wang/aiwork/game_unpack/cocos-restore/legacy')
from parse_assets import *
from collections import Counter, defaultdict
inv = all_inventory()
type_counter=Counter(); vt=Counter(); custom=Counter(); trs=0; fields=defaultdict(Counter)

def walk(o, seen):
    global trs
    if id(o) in seen: return
    if isinstance(o,(dict,list)): seen.add(id(o))
    if isinstance(o,dict):
        if '__type__' in o:
            t=o['__type__']; type_counter[t]+=1
            if not (t.startswith('cc.') or t.startswith('sp.')): custom[t]+=1
            for k in o:
                if k not in ('node',): fields[t][k]+=1
        if '__vt__' in o: vt[o['__vt__']]+=1
        if '__trs__' in o: trs+=1
        if '__custom__' in o: custom['<custom:'+o['__custom__']+'>']+=1
        for k,v in o.items():
            if k=='__ref__': continue
            walk(v,seen)
    elif isinstance(o,list):
        for v in o: walk(v,seen)

for b in ('start-scene','game','secondary','fruits','vegetable'):
    cfg,out,imp,nat,po = inv[b]
    for r in out:
        try:
            root,resolved = root_for_uuid_index(b,r['idx'])
        except Exception as e:
            continue
        if root is None: continue
        walk(root,set())
print('TRS:',trs,'VT:',dict(vt),'custom ids:',len(custom))
for k,v in sorted(custom.items(), key=lambda x:-x[1]): print(' ',v,k)
print('all types:')
for t,c in type_counter.most_common(): print(' ',c,t)
