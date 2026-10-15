import sys, json, os, struct, collections
sys.path.insert(0,'.')
from wxrestore.bundle import load_game
from wxrestore.uuid import decompress_uuid

ROOT='/Users/zidong.wang/aiwork/game_unpack/package/wxf41b76649658b9e3_unpacked'
game=load_game(ROOT)

def png_size(path):
    try:
        with open(path,'rb') as f:
            d=f.read(32)
        if d[:8]==b'\x89PNG\r\n\x1a\n':
            return struct.unpack('>II', d[16:24])
        if d[:2]==b'\xff\xd8':
            f=open(path,'rb'); f.read(2)
            while True:
                b=f.read(2)
                if not b: break
                if b[0]!=0xFF: continue
                m=b[1]
                if 0xC0<=m<=0xCF and m not in (0xC4,0xC8,0xCC):
                    f.read(3); h,w=struct.unpack('>HH', f.read(4)); return (w,h)
                l=struct.unpack('>H', f.read(2))[0]; f.read(l-2)
    except Exception:
        return None

report={}
for name,b in game.items():
    types=collections.Counter(r.type for r in b.rows)
    report[name]={'rows':len(b.rows),'types':dict(types),'packs':len(b.packs)}
    print(f"== bundle {name}: {len(b.rows)} rows, {len(b.packs)} packs")
    for t,c in types.most_common(): print(f"   {c:4d} {t}")

# image consistency check on fruits
print('\n== image native vs originalSize check (all bundles) ==')
bad=[]; ok=0; nonative=[]
for bname,b in game.items():
    for r in b.rows:
        if r.type!='cc.SpriteFrame': continue
        root,resolved,_=b.section_for(r.idx)
        nat=b.disk_file(r,'native')
        if not nat:
            nonative.append((bname,r.uuid,r.path)); continue
        sz=png_size(nat)
        d=root.get('data',{}) if isinstance(root,dict) else {}
        os_=d.get('originalSize') or {}
        if sz and os_ and (sz[0]!=os_.get('width') or sz[1]!=os_.get('height')):
            bad.append((bname,r.path,sz,os_.get('width'),os_.get('height')))
        else: ok+=1
print('ok:',ok,'mismatch:',len(bad),'no-native:',len(nonative))
for x in bad[:15]: print('MISMATCH',x)
for x in nonative[:15]: print('NONATIVE',x)
json.dump(report, open('/tmp/census.json','w'), ensure_ascii=False, indent=1)
