from pathlib import Path
import pymupdf as fitz
from PIL import Image,ImageDraw
root=Path.cwd()
for f in root.glob('*.pdf'):
 d=fitz.open(f)
 print('\nFILE',f.name,'PAGES',len(d))
 thumbs=[]
 out=root/'tmp'/'pdfs'/f.stem
 out.mkdir(parents=True,exist_ok=True)
 for i,p in enumerate(d):
  print('\nPAGE',i+1,'SIZE',p.rect,'IMAGES',[(x[0],x[2],x[3]) for x in p.get_images()]);print(p.get_text()[:12000])
  pix=p.get_pixmap(matrix=fitz.Matrix(.45,.45),alpha=False)
  im=Image.frombytes('RGB',[pix.width,pix.height],pix.samples)
  im.thumbnail((300,400)); tile=Image.new('RGB',(320,440),'#dddddd');tile.paste(im,((320-im.width)//2,30));ImageDraw.Draw(tile).text((10,10),str(i+1),fill='black');thumbs.append(tile)
  pix.save(str(out/f'page-{i+1}.png'))
 for start in range(0,len(thumbs),16):
  ts=thumbs[start:start+16]; sheet=Image.new('RGB',(1280,440*((len(ts)+3)//4)),'white')
  for n,t in enumerate(ts):sheet.paste(t,((n%4)*320,(n//4)*440))
  sheet.save(out/f'contact-{start//16+1}.jpg')
