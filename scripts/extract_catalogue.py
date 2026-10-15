from pathlib import Path
import pymupdf as fitz
from PIL import Image
import io
p=Path('tmp/pdfs/embedded');p.mkdir(exist_ok=True)
d=fitz.open('Pureline_GRP_Door_Catalogue (2).pdf')
for i,page in enumerate(d):
 for img in page.get_images():
  if img[2]>600:
   x=img[0]; data=d.extract_image(x);im=Image.open(io.BytesIO(data['image']));im.save(p/f'page-{i+1}-xref-{x}.png')
