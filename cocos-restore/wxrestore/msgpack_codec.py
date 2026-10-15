"""Minimal MessagePack decoder (CCON documents use standard msgpack)."""
import struct


class MsgpackDecoder:
    def __init__(self, data):
        self.b = data

    def decode(self, i=0):
        c = self.b[i]
        i += 1
        if c <= 0x7F:
            return c, i
        if c >= 0xE0:
            return c - 256, i
        if 0x80 <= c <= 0x8F:
            return self._map(c & 0x0F, i)
        if 0x90 <= c <= 0x9F:
            return self._array(c & 0x0F, i)
        if 0xA0 <= c <= 0xBF:
            n = c & 0x1F
            v = self.b[i:i + n].decode("utf-8", "replace")
            return v, i + n
        if c == 0xC0:
            return None, i
        if c == 0xC2:
            return False, i
        if c == 0xC3:
            return True, i
        if c == 0xC4:
            n = self.b[i]
            return self._bin(n, i + 1)
        if c == 0xC5:
            n = struct.unpack_from(">H", self.b, i)[0]
            return self._bin(n, i + 2)
        if c == 0xC6:
            n = struct.unpack_from(">I", self.b, i)[0]
            return self._bin(n, i + 4)
        if c in (0xC7, 0xC8, 0xC9):
            return self._ext(c, i)
        if c in (0xCA,):
            return struct.unpack_from(">f", self.b, i)[0], i + 4
        if c == 0xCB:
            return struct.unpack_from(">d", self.b, i)[0], i + 8
        if c == 0xCC:
            return self.b[i], i + 1
        if c == 0xCD:
            return struct.unpack_from(">H", self.b, i)[0], i + 2
        if c == 0xCE:
            return struct.unpack_from(">I", self.b, i)[0], i + 4
        if c == 0xCF:
            return struct.unpack_from(">Q", self.b, i)[0], i + 8
        if c == 0xD0:
            return struct.unpack_from(">b", self.b, i)[0], i + 1
        if c == 0xD1:
            return struct.unpack_from(">h", self.b, i)[0], i + 2
        if c == 0xD2:
            return struct.unpack_from(">i", self.b, i)[0], i + 4
        if c == 0xD3:
            return struct.unpack_from(">q", self.b, i)[0], i + 8
        if c == 0xD9:
            n = self.b[i]
            return self.b[i + 1:i + 1 + n].decode("utf-8", "replace"), i + 1 + n
        if c == 0xDA:
            n = struct.unpack_from(">H", self.b, i)[0]
            return self.b[i + 2:i + 2 + n].decode("utf-8", "replace"), i + 2 + n
        if c == 0xDB:
            n = struct.unpack_from(">I", self.b, i)[0]
            return self.b[i + 4:i + 4 + n].decode("utf-8", "replace"), i + 4 + n
        if c == 0xDC:
            n = struct.unpack_from(">H", self.b, i)[0]
            return self._array(n, i + 2)
        if c == 0xDD:
            n = struct.unpack_from(">I", self.b, i)[0]
            return self._array(n, i + 4)
        if c == 0xDE:
            n = struct.unpack_from(">H", self.b, i)[0]
            return self._map(n, i + 2)
        if c == 0xDF:
            n = struct.unpack_from(">I", self.b, i)[0]
            return self._map(n, i + 4)
        ext_sizes = {0xD4: 1, 0xD5: 2, 0xD6: 4, 0xD7: 8, 0xD8: 16}
        if c in ext_sizes:
            return self._ext(c, i)
        raise ValueError(f"unsupported msgpack byte 0x{c:02x}")

    def _bin(self, n, i):
        return bytes(self.b[i:i + n]), i + n

    def _ext(self, c, i):
        if c in (0xC7,):
            n = self.b[i]; t = struct.unpack_from(">b", self.b, i + 1)[0]; d = i + 2
        elif c == 0xC8:
            n = struct.unpack_from(">H", self.b, i)[0]; t = struct.unpack_from(">b", self.b, i + 2)[0]; d = i + 3
        elif c == 0xC9:
            n = struct.unpack_from(">I", self.b, i)[0]; t = struct.unpack_from(">b", self.b, i + 4)[0]; d = i + 5
        else:
            n = {0xD4: 1, 0xD5: 2, 0xD6: 4, 0xD7: 8, 0xD8: 16}[c]
            t = struct.unpack_from(">b", self.b, i)[0]; d = i + 1
        return {"__ext_type__": t, "data": bytes(self.b[d:d + n])}, d + n

    def _array(self, n, i):
        arr = []
        for _ in range(n):
            v, i = self.decode(i)
            arr.append(v)
        return arr, i

    def _map(self, n, i):
        d = {}
        for _ in range(n):
            k, i = self.decode(i)
            v, i = self.decode(i)
            if isinstance(k, bytes):
                k = k.decode("utf-8", "replace")
            d[k] = v
        return d, i


def unpack(data):
    return MsgpackDecoder(data).decode(0)[0]
