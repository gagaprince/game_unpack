import sys, json, os, struct, shutil
sys.path.insert(0,'.')
from wxrestore.bundle import load_game
from wxrestore import editorize
from wxrestore.uuid import decompress_uuid

OUT='/Users/zidong.wang/aiwork/game_unpack/cpgame/assets/_restore_test'
shutil.rmtree(OUT, ignore_errors=True)
os.makedirs(OUT, exist_ok=True)

game = load_game('/Users/zidong.wang/aiwork/game_unpack/package/wxf41b76649658b9e3_unpacked')
fruits=game['fruits']

def meta(ver, importer, uuid, files=None, sub=None, user=None):
    return {"ver":ver,"importer":importer,"imported":True,"uuid":uuid,
            "files":files or [],"subMetas":sub or {},"userData":user or {}}

def write(path, obj):
    with open(path,'w',encoding='utf-8') as f:
        json.dump(obj,f,ensure_ascii=False,indent=2)

# prefab
root, resolved, _ = fruits.section_for(0)
own = decompress_uuid(fruits.rows[0].uuid)
pref = editorize.to_prefab(resolved, 0, own)
write(os.path.join(OUT,'fruit1.prefab'), pref)
write(os.path.join(OUT,'fruit1.prefab.meta'),
      meta("1.1.35","prefab",own,[".json"],user={"syncNodeName":"fruit1"}))

# image
img_uuid='0f8f8520-df86-4755-aee0-49a4491dee3f'
src='/Users/zidong.wang/aiwork/game_unpack/package/wxf41b76649658b9e3_unpacked/subpackages/fruits/native/0f/'+img_uuid+'.png'
shutil.copy(src, os.path.join(OUT,'xigua.png'))
with open(src,'rb') as f:
    hdr=f.read(24)
w,h=struct.unpack('>II',hdr[16:24])
hw,hh=w/2,h/2
sf={
 "importer":"sprite-frame","uuid":img_uuid+"@f9941","displayName":"xigua","id":"f9941","name":"spriteFrame",
 "userData":{
   "trimThreshold":1,"rotated":False,"offsetX":0,"offsetY":0,"trimX":0,"trimY":0,
   "width":w,"height":h,"rawWidth":w,"rawHeight":h,
   "borderTop":0,"borderBottom":0,"borderLeft":0,"borderRight":0,
   "packable":True,"pixelsToUnit":100,"pivotX":0.5,"pivotY":0.5,"meshType":0,
   "vertices":{"rawPosition":[-hw,-hh,0,hw,-hh,0,-hw,hh,0,hw,hh,0],
     "indexes":[0,1,2,2,1,3],"uv":[0,h,w,h,0,0,w,0],"nuv":[0,0,1,0,0,1,1,1],
     "minPos":[-hw,-hh,0],"maxPos":[hw,hh,0]},
   "isUuid":True,"imageUuidOrDatabaseUri":img_uuid+"@6c48a","atlasUuid":"","trimType":"auto"},
 "ver":"1.0.12","imported":True,"files":[".json"],"subMetas":{}}
tex={"importer":"texture","uuid":img_uuid+"@6c48a","displayName":"xigua","id":"6c48a","name":"texture",
 "userData":{"wrapModeS":"clamp-to-edge","wrapModeT":"clamp-to-edge",
   "imageUuidOrDatabaseUri":img_uuid,"isUuid":True,"visible":False,
   "minfilter":"linear","magfilter":"linear","mipfilter":"none","anisotropy":0},
 "ver":"1.0.22","imported":True,"files":[".json"],"subMetas":{}}
imgm=meta("1.0.27","image",img_uuid,[".json",".png"],sub={"6c48a":tex,"f9941":sf},
          user={"type":"sprite-frame","fixAlphaTransparencyArtifacts":False,"hasAlpha":True,"redirect":img_uuid+"@6c48a"})
write(os.path.join(OUT,'xigua.png.meta'), imgm)
print('done', w, h)
