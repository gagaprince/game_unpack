import json, os
from collections import Counter

ROOT = '/Users/zidong.wang/aiwork/game_unpack/package/wxf41b76649658b9e3_unpacked'
BUNDLES = {
    'start-scene': 'assets/start-scene',
    'game': 'subpackages/game',
    'secondary': 'subpackages/secondary',
    'fruits': 'subpackages/fruits',
    'vegetable': 'subpackages/vegetable',
}

def build(bundle):
    bdir = BUNDLES[bundle]
    cfg = json.load(open(os.path.join(ROOT, bdir, 'config.json')))
    uuids, types, paths, packs = cfg.get('uuids',[]), cfg.get('types',[]), cfg.get('paths',{}), cfg.get('packs',{})
    idxmap = {}
    for k,(p,ti,cnt) in paths.items():
        for off in range(cnt):
            tname = types[ti] if ti < len(types) else 'type%d'%ti
            idxmap[int(k)+off] = {'path': p + ('' if off==0 else '_%d'%off), 'type': tname}
    out=[]
    for i,u in enumerate(uuids):
        info = idxmap.get(i, {'path':'', 'type':''})
        base = u.split('@')[0]
        info.update(idx=i, uuid_short=u, base_id=base, sub=u.split('@')[1] if '@' in u else '')
        out.append(info)
    pack_of={}
    for pu,indices in packs.items():
        for ii in indices: pack_of[ii]=pu
    return cfg, out, pack_of

def disk_files(bundle, sub):
    bdir = os.path.join(ROOT, BUNDLES[bundle], sub)
    res={}
    if os.path.isdir(bdir):
        for dp,_,fs in os.walk(bdir):
            for f in fs:
                res[os.path.splitext(f)[0]] = os.path.relpath(os.path.join(dp,f), ROOT)
    return res

def all_inventory():
    inv={}
    for b in BUNDLES:
        cfg, out, pack_of = build(b)
        imp, nat = disk_files(b,'import'), disk_files(b,'native')
        def find(fid, table):
            if fid in table: return table[fid]
            if len(fid) > 9:
                full = decompress_uuid(fid)
                if full in table: return table[full]
                if len(fid)==23:
                    for v in '89ab':
                        h=list(full.replace('-','')); h[16]=v
                        u='%s-%s-%s-%s-%s'%(''.join(h[0:8]),''.join(h[8:12]),''.join(h[12:16]),''.join(h[16:20]),''.join(h[20:32]))
                        if u in table: return table[u]
            return ''
        for r in out:
            r['in_pack'] = pack_of.get(r['idx'],'')
            fid = r['base_id']
            r['import_file'] = find(fid, imp)
            r['native_file'] = find(fid, nat)
        inv[b]=(cfg,out,imp,nat,pack_of)
    return inv

BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
def decompress_uuid(short):
    import re as _re
    if len(short)==36 or len(short)<=9 or '-' in short or not _re.fullmatch(r'[A-Za-z0-9+/]{22,23}', short): return short
    bv={c:i for i,c in enumerate(BASE64_KEYS)}
    h=list('0'*32)
    h[0]=short[0]; h[1]=short[1]
    j=2
    for i in range(2,22,2):
        lhs=bv[short[i]]; rhs=bv[short[i+1]]
        h[j]='%x'%(lhs>>2); h[j+1]='%x'%(((lhs&3)<<2)|(rhs>>4)); h[j+2]='%x'%(rhs&15)
        j+=3
    if len(short)==23:
        h[12]='4'; h[16]='8'
    out=''.join(h)
    return '%s-%s-%s-%s-%s'%(out[0:8],out[8:12],out[12:16],out[16:20],out[20:32])

if __name__=='__main__':
    inv = all_inventory()
    for b,(cfg,out,imp,nat,pack_of) in inv.items():
        print('='*20,b,'uuids:',len(out),'import files:',len(imp),'native:',len(nat),'packs:',len(pack_of))
        print(Counter(r['type'] for r in out))
        exts=Counter(os.path.splitext(v)[1] for v in nat.values())
        print('native ext:',exts)

BASE64_KEYS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
def decompress_uuid(short):
    import re as _re
    if len(short)==36 or len(short)<=9 or '-' in short or not _re.fullmatch(r'[A-Za-z0-9+/]{22,23}', short): return short
    bv={c:i for i,c in enumerate(BASE64_KEYS)}
    h=list('0'*32)
    h[0]=short[0]; h[1]=short[1]
    j=2
    for i in range(2,22,2):
        lhs=bv[short[i]]; rhs=bv[short[i+1]]
        h[j]='%x'%(lhs>>2)
        h[j+1]='%x'%(((lhs&3)<<2)|(rhs>>4))
        h[j+2]='%x'%(rhs&15)
        j+=3
    # v4 marker handling for length 23 with null marker at index 22
    if len(short)==23:
        # standard cc format uses '\u0000' to mark version/variant nibbles
        h[12]='4'
        h[16]='8'  # may be 8/9/a/b; default 8, corrected below from marker context unavailable
    out=''.join(h)
    return '%s-%s-%s-%s-%s'%(out[0:8],out[8:12],out[12:16],out[16:20],out[20:32])
