import sys, os, json; sys.path.insert(0,'/tmp/cocos_unpack')
from parse_assets import *
from inventory import all_inventory, BUNDLES, ROOT

inv = all_inventory()
# global uuid index -> (bundle, path, type)
UUIDMAP={}
for b,(cfg,out,imp,nat,po) in inv.items():
    for r in out:
        UUIDMAP[r['uuid_short']]=(b,r['path'],r['type'])

def asset_ref(u):
    if not isinstance(u,str): return None
    base=u.split('@')[0]
    if u in UUIDMAP: return '%s:%s' % (UUIDMAP[u][0], UUIDMAP[u][1] or UUIDMAP[u][2])
    if base in UUIDMAP:
        b,p,t=UUIDMAP[base]
        sub=u.split('@')[1] if '@' in u else ''
        return '%s:%s%s' % (b,p,('@'+sub if sub else ''))
    return u

def shortval(v, depth=0):
    if isinstance(v,dict):
        if '__uuid__' in v: return '<%s>' % asset_ref(v['__uuid__'])
        if v.get('__vt__')=='Color': return 'Color(%s)'%v.get('rgba')
        if v.get('__vt__') in ('Size',): return '%sx%s'%(v.get('width'),v.get('height'))
        if v.get('__vt__')=='Vec3': return '(%s,%s,%s)'%(v.get('x'),v.get('y'),v.get('z'))
        return '{...}'
    if isinstance(v,list):
        if depth>0: return '[%d]'%len(v)
        return '['+','.join(shortval(x,depth+1) for x in v[:8])+('...' if len(v)>8 else '')+']'
    return repr(v)

def node_lines(n, depth=0):
    lines=[]
    comps=[]
    customs=[]
    labels=[]
    for c in (n.get('_components') or []):
        if not isinstance(c,dict): continue
        t=c.get('__type__','?')
        if t.startswith('cc.') or t.startswith('sp.'):
            extra=''
            if t=='cc.Label': extra='=%r'%c.get('_string')
            if t=='cc.Sprite':
                sf=c.get('_spriteFrame')
                if isinstance(sf,dict) and '__uuid__' in sf: extra=' sf=%s'%asset_ref(sf['__uuid__'])
            if t=='sp.Skeleton': extra=' anim=%r skin=%r'%(c.get('defaultAnimation'),c.get('defaultSkin'))
            if t=='cc.Animation':
                clips=c.get('_clips') or []
                extra=' clips=%s'%[shortval(x) for x in clips]
            if t=='cc.ParticleSystem2D': extra=' plist=%s'%shortval(c.get('_file'))
            comps.append(t.replace('cc.','')+extra)
        else:
            props={k:v for k,v in c.items() if k not in ('__type__','node','__prefab')}
            customs.append((t,props))
            comps.append('SCRIPT:%s'%t)
    act='' if n.get('_active',True) is not False else ' INACTIVE'
    lines.append('  '*depth + '- %s%s :: %s' % (n.get('_name'), act, ' | '.join(comps)))
    for t,props in customs:
        ps='; '.join('%s=%s'%(k,shortval(v)) for k,v in props.items() if k!='node')
        lines.append('  '*depth + '    * CUSTOM %s {%s}' % (t, ps[:500]))
    for ch in (n.get('_children') or []):
        lines += node_lines(ch,depth+1)
    return lines

def custom_stats(n, prefab, stats=None):
    if stats is None: stats={}
    for c in (n.get('_components') or []):
        if isinstance(c,dict):
            t=c.get('__type__','?')
            if not (t.startswith('cc.') or t.startswith('sp.')):
                props={k:shortval(v) for k,v in c.items() if k not in ('__type__','node','__prefab')}
                stats.setdefault(t,[]).append({'prefab':prefab,'node':n.get('_name'),'props':props})
    for ch in (n.get('_children') or []):
        custom_stats(ch,prefab,stats)
    return stats

ALLSTATS={}
allprefabs=[]
for b in ('game','secondary','fruits','vegetable'):
    cfg,out,imp,nat,po = inv[b]
    for r in out:
        if r['type']!='cc.Prefab': continue
        try:
            root,resolved=get_prefab(b,r['idx'])
            data=root.get('data') if root else None
            st=custom_stats(data,r['path'],{})
            for k,v in st.items(): ALLSTATS.setdefault(k,[]).extend(v)
            lines=node_lines(data)
            allprefabs.append((b,r['path'],lines))
        except Exception as e:
            allprefabs.append((b,r['path'],['ERROR %r'%e]))

with open('/tmp/cocos_unpack/prefabs_tree.txt','w') as f:
    for b,p,lines in allprefabs:
        f.write('\n### [%s] %s\n'% (b,p))
        f.write('\n'.join(lines)+'\n')
json.dump(ALLSTATS, open('/tmp/cocos_unpack/custom_scripts.json','w'), ensure_ascii=False, indent=1)
print("prefabs:",len(allprefabs),"custom script uuids:",len(ALLSTATS))
for k,v in sorted(ALLSTATS.items(), key=lambda x:-len(x[1])):
    prefs=sorted(set(x['prefab'] for x in v))
    print(f"\n{k}  used {len(v)}x in {len(prefs)} prefabs: {prefs[:8]}")
