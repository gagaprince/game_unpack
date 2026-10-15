"""Cocos Creator uuid compression.

Ports the official editor algorithms verbatim
(Editor-extends utils/source/uuid.ts, Creator 3.8.8):
- 22-char base64: first 2 hex nibbles kept, remaining 30 nibbles -> 20 b64 chars
- 23-char base64: first 5 hex nibbles kept, remaining 27 nibbles -> 18 b64 chars
- sub asset suffix such as "@f9941" is preserved
"""
import re

BASE64_KEYS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
_B64 = {c: i for i, c in enumerate(BASE64_KEYS)}
_HEX = "0123456789abcdef"

_RE_COMPRESSED = re.compile(r"^[0-9a-zA-Z+/]{22,23}$")
_RE_FULL = re.compile(r"^[0-9a-fA-F]{32}$")
_RE_UUID = re.compile(r"^[0-9a-fA-F-]{36}$")


def compress_hex(hex_string, reserved_head):
    out = list(hex_string[:reserved_head])
    i = reserved_head
    n = len(hex_string)
    while i < n:
        v1 = int(hex_string[i], 16)
        v2 = int(hex_string[i + 1], 16) if i + 1 < n else 0
        v3 = int(hex_string[i + 2], 16) if i + 2 < n else 0
        out.append(BASE64_KEYS[(v1 << 2) | (v2 >> 2)])
        out.append(BASE64_KEYS[((v2 & 3) << 4) | v3])
        i += 3
    return "".join(out)


def compress_uuid(uuid, minified=True):
    """36-char uuid -> 22-char (min) or 23-char (head 5)."""
    if "@" in uuid:
        main, _, sub = uuid.partition("@")
        return compress_uuid(main, minified) + "@" + sub
    h = uuid.replace("-", "") if _RE_UUID.match(uuid) else uuid
    if not _RE_FULL.match(h):
        return uuid
    return compress_hex(h, 2 if minified else 5)


def _decompress_normal(s):
    if len(s) == 23:
        head, start = s[:5], 5
    elif len(s) == 22:
        head, start = s[:2], 2
    else:
        return s
    chars = list(head)
    for i in range(start, len(s), 2):
        lhs = _B64[s[i]]
        rhs = _B64[s[i + 1]]
        chars.append(_HEX[lhs >> 2])
        chars.append(_HEX[((lhs & 3) << 2) | (rhs >> 4)])
        chars.append(_HEX[rhs & 0xF])
    h = "".join(chars)
    return f"{h[0:8]}-{h[8:12]}-{h[12:16]}-{h[16:20]}-{h[20:32]}"


def decompress_uuid(value):
    """Decompress any 22/23-char base64 uuid (and @sub forms); else return input."""
    if not isinstance(value, str):
        return value
    parts = value.split("@")
    head = parts[0]
    if _RE_COMPRESSED.match(head) or len(head) in (22, 23):
        parts[0] = _decompress_normal(head)
    return "@".join(parts)


def is_legacy_dashed_id(s):
    """Cocos 2.x migrated script class id like '920f995b--b39-4-...' (not invertible here)."""
    return bool(s) and len(s) >= 20 and s.count("-") >= 5 and re.match(r"^[0-9a-f]{8}--", s or "")

_HEX32_RE = re.compile(r"^[0-9a-f]{32}$")


def is_script_type_id(t):
    """User component __type__ in a 3.x build = compressed script uuid
    (22/23 chars invertible to 32 hex) or a legacy migrated dashed id.
    Plain class names (CCPropertyOverrideInfo, ...) are engine internals."""
    if not isinstance(t, str):
        return False
    if is_legacy_dashed_id(t):
        return True
    if len(t) in (22, 23):
        try:
            dec = decompress_uuid(t)
        except Exception:
            return False
        return bool(_HEX32_RE.match(dec.replace("-", "")))
    return False

