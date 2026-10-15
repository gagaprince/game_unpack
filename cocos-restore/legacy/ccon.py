import struct, json, os
def decode(b, i=0):
    c=b[i]; i+=1
    if c<=0x7f: return c,i
    if c>=0xe0: return c-256,i
    if 0x80<=c<=0x8f or c==0xde:
        n=c&0xf if c<0xde else struct.unpack('<H',b[i:i+2])[0]
        i += 0 if c<0xde else 2
        d={}
        for _ in range(n):
            k,i=decode(b,i); v,i=decode(b,i)
            try: d[k]=v
            except TypeError: d[json.dumps(k,ensure_ascii=False)]=v
        return d,i
    if 0x90<=c<=0x9f or c==0xdc:
        n=c&0xf if c<0xdc else struct.unpack('<H',b[i:i+2])[0]
        i += 0 if c<0xdc else 2
        a=[]
        for _ in range(n):
            v,i=decode(b,i); a.append(v)
        return a,i
    if 0xa0<=c<=0xbf: n=c&0x1f; return b[i:i+n].decode('utf8','replace'),i+n
    if c==0xc0: return None,i
    if c==0xc2: return False,i
    if c==0xc3: return True,i
    if c==0xc4: n=b[i];i+=1; return b[i:i+n],i+n
    if c==0xc5: n=struct.unpack('<H',b[i:i+2])[0];i+=2; return b[i:i+n],i+n
    if c==0xc6: n=struct.unpack('<I',b[i:i+4])[0];i+=4; return b[i:i+n],i+n
    if c==0xca: return struct.unpack('<f',b[i:i+4])[0],i+4
    if c==0xcb: return struct.unpack('<d',b[i:i+8])[0],i+8
    if c==0xcc: return b[i],i+1
    if c==0xcd: return struct.unpack('<H',b[i:i+2])[0],i+2
    if c==0xce: return struct.unpack('<I',b[i:i+4])[0],i+4
    if c==0xcf: return struct.unpack('<Q',b[i:i+8])[0],i+8
    if c==0xd0: return struct.unpack('b',b[i:i+1])[0],i+1
    if c==0xd1: return struct.unpack('<h',b[i:i+2])[0],i+2
    if c==0xd2: return struct.unpack('<i',b[i:i+4])[0],i+4
    if c==0xd3: return struct.unpack('<q',b[i:i+8])[0],i+8
    if c==0xc7:
        n=b[i]; t=struct.unpack('b',b[i+1:i+2])[0]; return ('ext%d'%t, b[i+2:i+2+n]), i+2+n
    if c==0xc8:
        n=struct.unpack('<H',b[i:i+2])[0]; t=struct.unpack('b',b[i+2:i+3])[0]; return ('ext%d'%t, b[i+3:i+3+n]), i+3+n
    if c==0xc9:
        n=struct.unpack('<I',b[i:i+4])[0]; t=struct.unpack('b',b[i+4:i+5])[0]; return ('ext%d'%t, b[i+5:i+5+n]), i+5+n
    extlens={0xd4:1,0xd5:2,0xd6:4,0xd7:8,0xd8:16}
    if c in extlens:
        t=struct.unpack('b',b[i:i+1])[0]; n=extlens[c]; return ('ext%d'%t, b[i+1:i+1+n]), i+1+n
    if c==0xdf:
        n=struct.unpack('<I',b[i:i+4])[0];i+=4
        d={}
        for _ in range(n):
            k,i=decode(b,i);v,i=decode(b,i)
            try:d[k]=v
            except TypeError:d[str(k)]=v
        return d,i
    if c==0xd9: n=b[i];i+=1;return b[i:i+n].decode('utf8','replace'),i+n
    if c==0xda: n=struct.unpack('<H',b[i:i+2])[0];i+=2;return b[i:i+n].decode('utf8','replace'),i+n
    if c==0xdb: n=struct.unpack('<I',b[i:i+4])[0];i+=4;return b[i:i+n].decode('utf8','replace'),i+n
    raise ValueError('byte %02x at %d'%(c,i-1))
def parse_ccon(path):
    b=open(path,'rb').read()
    assert b[:4]==b'CCON'
    ver,total,jlen=struct.unpack('<III',b[4:16])
    obj,_=decode(b,16)
    p=16+jlen
    if p%8: p+=8-p%8
    chunks=[]
    while p<len(b):
        ln=struct.unpack('<I',b[p:p+4])[0];p+=4
        chunks.append(b[p:p+ln]);p+=ln
        if p%8 and p<len(b): p+=8-p%8
    return obj,chunks
