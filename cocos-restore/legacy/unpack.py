# Cocos Creator 3.x packed JSON unpacker (format v1), logic ported from engine 3.8.8
# cocos/serialization/deserialize.js (deserializeCCObject/parseInstances/dereference/parseResult)
import json, sys

SIMPLE, INSTANCE_REF, ARR_INSTANCE_REF, ARR_ASSETREF_INNER, CLASS, VALUETYPE_CREATED, \
ASSETREF_INNER, TRS, VALUETYPE, ARR_CLASS, CUSTOM_CLASS, DICT, ARRAY, ARRAY_LENGTH = range(14)
VT_NAMES = ['Vec2','Vec3','Vec4','Quat','Color','Size','Rect','Mat4']

def decode_strings(v, strings):
    if isinstance(v, int) and v < 0:
        return strings[~v]
    return v

class Unpacker:
    def __init__(self, raw, uuid_table=None):
        self.raw = raw
        self.version = raw[0]
        self.uuids = raw[1] or []
        self.strings = raw[2] or []
        self.classes = raw[3] or []
        self.masks = raw[4] or []
        if len(raw) >= 11:
            # expanded single-asset file: [v,uuids,strings,classes,masks,instances,instTypes,refs,depObjs,depKeys,depUuids]
            self.sections = [raw[5:11]]
        else:
            self.sections = raw[5]
        self.results = []
        self.resolved = []
        for sec in self.sections:
            self.results.append(self._parse_section(sec))
            self.resolved.append(self._last_resolved)

    def _class_name(self, ci):
        c = self.classes[ci]
        return c if isinstance(c, str) else c[0]

    def _parse_section(self, sec):
        self._refs = []
        instances_raw = sec[0]
        inst_types = sec[1] if len(sec) > 1 else 0
        refs = sec[2] if len(sec) > 2 else 0
        depend_objs = sec[3] if len(sec) > 3 else []
        depend_keys = sec[4] if len(sec) > 4 else []
        depend_uuids = sec[5] if len(sec) > 5 else []
        if inst_types == 0:
            inst_types = []
        if refs == 0:
            refs = []
        self._refs = refs
        self._depend_objs = depend_objs
        n = len(instances_raw)
        types_len = len(inst_types)
        root_index = 0
        normal_count = n - types_len
        tail = instances_raw[-1] if instances_raw else None
        if isinstance(tail, (int, float)) and not isinstance(tail, bool):
            root_index = tail
            if root_index < 0:
                root_index = ~root_index
            normal_count -= 1
        resolved = [None]*n
        for i in range(normal_count):
            resolved[i] = self._deserialize_obj(instances_raw[i], instances_raw, resolved, refs)
        for t in range(types_len):
            i = normal_count + t
            tv = inst_types[t]
            each = instances_raw[i]
            if tv >= 0:
                ctor = self._class_name(tv)
                resolved[i] = {'__custom__': ctor, 'data': each}
            else:
                op = ~tv
                resolved[i] = self._dispatch_primitive(op, instances_raw, i, each)
        # dereference refs
        if refs:
            data_len = len(refs) - 1
            inst_offset = refs[data_len] * 3
            ri = 0
            while ri < inst_offset:
                owner, key_idx, target_idx = refs[ri], refs[ri+1], refs[ri+2]
                key = self.strings[key_idx] if key_idx >= 0 else ~key_idx
                owner[key] = resolved[target_idx]
                ri += 3
            while ri < data_len:
                owner_idx, key_idx, target_idx = refs[ri], refs[ri+1], refs[ri+2]
                key = self.strings[key_idx] if key_idx >= 0 else ~key_idx
                resolved[owner_idx][key] = resolved[target_idx]
                ri += 3
        # asset uuid deps
        for di in range(len(depend_objs)):
            owner = depend_objs[di]
            if owner is None:
                continue
            if isinstance(owner, int):
                owner = resolved[owner]
            k = depend_keys[di]
            if isinstance(k, int):
                k = self.strings[k] if k >= 0 else ~k
            u = depend_uuids[di]
            if isinstance(u, int):
                u = self.uuids[u]
            owner[k] = {'__uuid__': u}
        self._last_resolved = resolved
        return resolved[root_index]

    def _dispatch_primitive(self, op, data, owner, key, value=None):
        # for tail primitive: owner=instances array, key=index
        if op == ARRAY:
            arr = value[0]
            for i in range(len(arr)):
                t = value[i+1]
                if t != SIMPLE:
                    arr[i] = self._dispatch_val(t, arr[i], data)
            return arr
        return self._dispatch_val(op, value, data)

    def _dispatch_val(self, t, v, instances_raw):
        if t == SIMPLE:
            return decode_strings(v, self.strings)
        if t == INSTANCE_REF:
            if v >= 0:
                return {'__ref__': v}
            return {'__ref_fwd__': ~v}
        if t == ARR_INSTANCE_REF:
            arr = []
            for x in v:
                if isinstance(x, int) and x < 0 and self._refs is not None:
                    self._refs[~x*3] = arr
                    arr.append(None)
                else:
                    arr.append(self._dispatch_val(INSTANCE_REF, x, instances_raw))
            return arr
        if t == CLASS or t == ARR_CLASS:
            if t == ARR_CLASS:
                return [self._deserialize_obj(x, instances_raw, None, getattr(self,'_refs',None)) for x in v]
            return self._deserialize_obj(v, instances_raw, None, getattr(self,'_refs',None))
        if t in (VALUETYPE, VALUETYPE_CREATED):
            return self._value_type(v)
        if t == TRS:
            return {'__trs__': v}
        if t == ASSETREF_INNER:
            return {'__dep_idx__': v}
        if t == ARR_ASSETREF_INNER:
            return [{'__dep_idx__': x} for x in v]
        if t == CUSTOM_CLASS:
            return {'__custom__': self._class_name(v[0]), 'data': v[1]}
        if t == DICT:
            d = dict(v[0]) if v[0] else {}
            i = 1
            while i+2 < len(v):
                sk, st, sv = v[i], v[i+1], v[i+2]
                if isinstance(sk, int):
                    sk = self.strings[sk] if sk >= 0 else ~sk
                d[sk] = self._dispatch_val(st, sv, instances_raw)
                i += 3
            return d
        if t == ARRAY:
            arr = v[0]
            for i in range(len(arr)):
                st = v[i+1]
                if st == SIMPLE:
                    continue
                sv = arr[i]
                if st == INSTANCE_REF and isinstance(sv, int) and sv < 0 and self._refs is not None:
                    self._refs[~sv*3] = arr
                    arr[i] = None
                else:
                    arr[i] = self._dispatch_val(st, sv, instances_raw)
            return arr
        return {'__unknown_t%d__' % t: v}

    def _value_type(self, v):
        ti = v[0]
        name = VT_NAMES[ti] if ti < len(VT_NAMES) else 'VT%d' % ti
        if name == 'Vec2': return {'__vt__':'Vec2','x':v[1],'y':v[2]}
        if name == 'Vec3': return {'__vt__':'Vec3','x':v[1],'y':v[2],'z':v[3]}
        if name in ('Vec4','Quat'): return {'__vt__':name,'x':v[1],'y':v[2],'z':v[3],'w':v[4]}
        if name == 'Color': return {'__vt__':'Color','rgba':v[1]}
        if name == 'Size': return {'__vt__':'Size','width':v[1],'height':v[2]}
        if name == 'Rect': return {'__vt__':'Rect','x':v[1],'y':v[2],'width':v[3],'height':v[4]}
        return {'__vt__':name,'v':v[1:]}

    def _deserialize_obj(self, object_data, instances_raw, resolved, refs):
        mask = self.masks[object_data[0]]
        clazz = self.classes[mask[0]]
        if isinstance(clazz, str):
            name = clazz; keys = []; offset = 0
        else:
            name = clazz[0]; keys = clazz[1]; offset = clazz[2]
        obj = {'__type__': name}
        type_off = mask[-1]
        i = 1
        while i < type_off:
            m = mask[i]
            obj[keys[m]] = object_data[i]
            i += 1
        while i < len(object_data):
            m = mask[i]
            key = keys[m]
            t = clazz[m + offset]
            v = object_data[i]
            tname = {1:'ref',2:'aref',4:'class',5:'vtc',6:'dep',7:'trs',8:'vt',9:'aclass',10:'custom',11:'dict',12:'arr'}.get(t, t)
            if t == SIMPLE:
                obj[key] = v
            elif t == INSTANCE_REF:
                if v >= 0:
                    obj[key] = {'__ref__': v}
                else:
                    obj[key] = None
                    if refs is not None:
                        refs[~v*3] = obj
            elif t == ASSETREF_INNER:
                obj[key] = None
                self._depend_objs[v] = obj
            elif t == ARR_ASSETREF_INNER:
                arr=[]
                for x in v:
                    arr.append(None); self._depend_objs[x] = arr
                obj[key] = arr
            elif t in (ARR_INSTANCE_REF, CLASS, ARR_CLASS, VALUETYPE,
                       VALUETYPE_CREATED, TRS, CUSTOM_CLASS, DICT, ARRAY):
                obj[key] = self._dispatch_val(t, v, instances_raw)
            else:
                obj[key] = self._dispatch_val(t, v, instances_raw)
            i += 1
        return obj

if __name__ == '__main__':
    raw = json.load(open(sys.argv[1]))
    up = Unpacker(raw)
    json.dump(up.results, open(sys.argv[2],'w'), ensure_ascii=False, indent=1)
    print('sections:', len(up.results))
