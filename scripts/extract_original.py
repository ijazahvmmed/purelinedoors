from pathlib import Path
import pymupdf as fitz
from PIL import Image
import io
p=Path('tmp/pdfs/original');p.mkdir(exist_ok=True)
d=fitz.open('PURELINE DOOR.pdf')
for i in [0,6,8,9,10,12,14,16,18,21]:
 page=d[i];data=d.extract_image(page.get_images()[0][0]);im=Image.open(io.BytesIO(data['image']));im.save(p/f'page-{i+1}.jpg',quality=95)
 if i==9:
  im.thumbnail((1650,1650));im.save(p/'page-10-review.jpg')
