"""CCON binary (.bin) -> editor .anim document (plain JSON).

CCON layout (engine cocos/serialization/ccon.ts, v2):
u32 magic 'CCON', u32 version, u32 totalLen,
u32 jsonLen, msgpack document,
[u32 chunkLen, chunk bytes (8-byte aligned)]...

cc.RealCurve is custom-serialized (cocos/core/curves/curve.ts):
the "bytes" TypedArrayRef points into the first chunk:
  u8 preExtrapolation, u8 postExtrapolation, u32 keyframeCount,
  per frame f32 time, per frame variable-length RealKeyframeValue.
"""
import struct

from . import msgpack_codec

MAGIC = 0x4E4F4343
ALIGN = 8

FLAG_VALUE = 1 << 0
FLAG_INTERPOLATION_MODE = 1 << 1
FLAG_TANGENT_WEIGHT_MODE = 1 << 2
FLAG_LEFT_TANGENT = 1 << 3
FLAG_LEFT_TANGENT_WEIGHT = 1 << 4
FLAG_RIGHT_TANGENT = 1 << 5
FLAG_RIGHT_TANGENT_WEIGHT = 1 << 6


def parse_ccon(data: bytes):
    magic, version, total = struct.unpack_from("<III", data, 0)
    if magic != MAGIC:
        raise ValueError("not a CCON file")
    json_len = struct.unpack_from("<I", data, 12)[0]
    doc = msgpack_codec.unpack(data[16:16 + json_len])
    p = 16 + json_len
    chunks = []
    while p < total:
        if p % ALIGN:
            p += ALIGN - p % ALIGN
        ln = struct.unpack_from("<I", data, p)[0]
        p += 4
        chunks.append(data[p:p + ln])
        p += ln
    return version, doc, chunks


def _decode_real_curve(chunk, off, length):
    p = off
    pre = chunk[p]
    post = chunk[p + 1]
    p += 2
    count = struct.unpack_from("<I", chunk, p)[0]
    p += 4
    times = list(struct.unpack_from("<%df" % count, chunk, p))
    p += 4 * count
    values = []
    for _ in range(count):
        flags = struct.unpack_from("<I", chunk, p)[0]
        p += 4
        value = struct.unpack_from("<f", chunk, p)[0]
        p += 4
        kf = {
            "__type__": "cc.RealKeyframeValue",
            "interpolationMode": 0,
            "tangentWeightMode": 0,
            "value": value,
            "rightTangent": 0.0,
            "rightTangentWeight": 0.0,
            "leftTangent": 0.0,
            "leftTangentWeight": 0.0,
        }
        if flags & FLAG_INTERPOLATION_MODE:
            kf["interpolationMode"] = chunk[p]
            p += 1
        if flags & FLAG_TANGENT_WEIGHT_MODE:
            kf["tangentWeightMode"] = chunk[p]
            p += 1
        if flags & FLAG_LEFT_TANGENT:
            kf["leftTangent"] = struct.unpack_from("<f", chunk, p)[0]
            p += 4
        if flags & FLAG_LEFT_TANGENT_WEIGHT:
            kf["leftTangentWeight"] = struct.unpack_from("<f", chunk, p)[0]
            p += 4
        if flags & FLAG_RIGHT_TANGENT:
            kf["rightTangent"] = struct.unpack_from("<f", chunk, p)[0]
            p += 4
        if flags & FLAG_RIGHT_TANGENT_WEIGHT:
            kf["rightTangentWeight"] = struct.unpack_from("<f", chunk, p)[0]
            p += 4
        kf["easingMethod"] = (flags >> 8) & 0xFF
        values.append(kf)
    return {
        "__type__": "cc.RealCurve",
        "_times": times,
        "_values": values,
        "preExtrapolation": pre,
        "postExtrapolation": post,
    }, p - off


def to_editor_doc(data: bytes):
    version, doc, chunks = parse_ccon(data)
    main = chunks[0] if chunks else b""

    from .uuid import decompress_uuid

    def fix(o):
        if isinstance(o, dict):
            if o.get("__type__") == "cc.RealCurve" and isinstance(o.get("bytes"), dict):
                ref = o["bytes"]
                if ref.get("ctor") != "Uint8Array":
                    raise ValueError(f"unsupported TypedArrayRef ctor {ref.get('ctor')}")
                decoded, _used = _decode_real_curve(main, ref["offset"], ref["length"])
                return decoded
            if "__uuid__" in o and isinstance(o["__uuid__"], str):
                o["__uuid__"] = decompress_uuid(o["__uuid__"])
            return {k: fix(v) for k, v in o.items() if k != "keyframeValueEditorExtras"}
        if isinstance(o, list):
            return [fix(v) for v in o]
        return o

    return fix(doc)
