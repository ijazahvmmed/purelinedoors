from pathlib import Path
from PIL import Image, ImageDraw
import json
out=Path('public/images');out.mkdir(parents=True,exist_ok=True)
# Coordinates refer to visually inspected extracted 1650px-wide catalogue product sheets.
entries=[
 ('Arch','arch','Exterior',10,(75,17,400,652),{'thicknessMm':44,'doorFrameWidthMm':'840-1100','doorFrameHeightMm':2040},'Dark blue'),
 ('Twin Vertical & W/Transom','twin-vertical','Exterior',7,(508,15,783,587),{'thicknessMm':44,'doorFrameWidthMm':'900 / 1000','doorFrameHeightMm':2450},'Rosewood'),
 ('Triple Square & W/Transom','triple-square','Exterior',9,(503,18,817,648),{'thicknessMm':44,'doorFrameWidthMm':'900 / 1000','doorFrameHeightMm':2450},'Rosewood'),
 ('Single Diamond','single-diamond','Exterior',9,(863,254,1160,828),{'thicknessMm':44,'doorFrameWidthMm':'900 / 1000','doorFrameHeightMm':2100},'Dark blue'),
 ('Rectangle Top','rectangle-top','Exterior',10,(866,233,1187,868),{'thicknessMm':44,'doorFrameWidthMm':'840-1100','doorFrameHeightMm':2040},'Light Oak'),
 ('Half (4p) Glazed','half-glazed','Exterior',7,(863,258,1149,837),{'thicknessMm':44,'doorFrameWidthMm':'900 / 1000','doorFrameHeightMm':2100},'Dark blue'),
 ('ENM Metal 4 Panel','enm-four-panel','ENM Metal',11,(850,236,1161,828),{'thicknessMm':46,'doorFrameWidthMm':1000,'doorFrameHeightMm':2100},'Dark blue / Rosewood'),
 ('Smooth','smooth','Smooth',13,(78,11,361,643),{'thicknessMm':44,'doorFrameWidthMm':'970 / 824','doorFrameHeightMm':2070},'White'),
 ('Smooth 2 Panel Molding','smooth-two-panel','Smooth',13,(917,175,1201,793),{'thicknessMm':44,'doorFrameWidthMm':'970 / 824','doorFrameHeightMm':2070},'Light gray'),
 ('8 Feet Smooth','sight-glass','Sight Glass / Balcony',15,(86,6,388,659),{'thicknessMm':60,'doorFrameWidthMm':1000,'doorFrameHeightMm':2400},'White'),
 ('SDA-307','abs-sda-307','ABS',22,(929,171,1225,852),{'thicknessMm':35,'doorFrameWidthMm':'600-1000','doorFrameHeightMm':'1800-2100'},None),
 ('SDA-302','abs-sda-302','ABS',22,(1292,168,1587,850),{'thicknessMm':35,'doorFrameWidthMm':'800-1000','doorFrameHeightMm':'1900-2100'},None),
 ('Hinged Door Frame','grp-hinged-frame','GRP Frames',17,(918,7,1156,604),{'sourceModel':'SPDWFR112625','dimensionsMm':'1100 × 2640 × 250'},'White'),
 ('Shoe cabinet with 3 compartments','shoe-cabinet','GRP Cabinets',19,(70,23,449,295),{'sourceModel':'SSC3XX183294','dimensionsMm':'1800 × 320 × 940'},None)
]
products=[]
for name,slug,family,page,box,specs,colour in entries:
 im=Image.open(f'tmp/pdfs/original/page-{page}.jpg')
 offset=200 if page<17 else 195
 b=(box[0]*2,(box[1]+offset)*2,box[2]*2,(box[3]+offset)*2)
 crop=im.crop(b);crop.save(out/f'{slug}.webp','WEBP',quality=94)
 products.append({'name':name,'family':family,'slug':slug,'image':f'/images/{slug}.webp','imageWidth':crop.width,'imageHeight':crop.height,'sourcePage':page,'sourceFile':'PURELINE DOOR.pdf','sourceLabel':name,'corroboratingSourceFile':'Pureline_GRP_Door_Catalogue (2).pdf','corroboratingSourcePage':page,'sourceCropPixels':b,'specifications':specs,'depictedColour':colour,'reviewStatus':'needs_review','ukPublished':False,'ukAvailabilityConfirmed':False,'imageRightsConfirmed':False,'certificationApproved':False,'publicationNotes':'Catalogue transcription only. Review exact model, frame versus leaf dimensions, UK availability, image rights and applicability before publication. No performance or compliance claim is verified by this record.'})
# Exact supplied catalogue cover image; not product evidence or completed-project photography.
hero=Image.open('tmp/pdfs/embedded/page-1-xref-3.png');hero.save(out/'entrance-editorial.webp','WEBP',quality=94)
Path('docs/source-products.json').write_text(json.dumps(products,ensure_ascii=False,indent=2),encoding='utf-8')
contact=Image.new('RGB',(1400,1000),'#f1eee8');draw=ImageDraw.Draw(contact)
for n,p in enumerate(products):
 im=Image.open('public'+p['image']);im.thumbnail((170,370));x=(n%7)*200;y=(n//7)*500;contact.paste(im,(x+(200-im.width)//2,y+30));draw.text((x+10,y+415),p['slug'],fill='#141f18');draw.text((x+10,y+440),'Source page '+str(p['sourcePage']),fill='#141f18')
contact.save('docs/assets-contact-sheet.jpg',quality=92)
print('Wrote',len(products),'products and editorial hero.')
