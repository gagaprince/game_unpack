import { readFileSync, writeFileSync } from 'fs';
import { notepackDecode } from '/Applications/Cocos/Creator/3.8.8/CocosCreator.app/Contents/Resources/resources/3d/engine/external/deserialize/notepack_decode.ts';
const root='/Users/zidong.wang/aiwork/game_unpack/package/wxf41b76649658b9e3_unpacked/';
const files=process.argv.slice(2);
for (const f of files) {
  const b=readFileSync(root+f);
  const dv=new DataView(b.buffer,b.byteOffset,b.byteLength);
  const total=dv.getUint32(8,true), jlen=dv.getUint32(12,true);
  const seg=new Uint8Array(b.buffer,b.byteOffset+16,jlen);
  const obj=notepackDecode(seg.buffer.slice(seg.byteOffset,seg.byteOffset+seg.byteLength));
  writeFileSync('/tmp/cocos_unpack/ccon_'+f.split('/').pop()+'.json', JSON.stringify(obj,(k,v)=> v instanceof ArrayBuffer ? {__bin:v.byteLength} : v,1));
}
