"""Optimise reviewed architectural photographs and exact catalogue details.
Inputs in tmp/sourcing are downloaded from the individual Pexels photo pages.
No product recolouring, retouching, or fabricated construction imagery.
"""
from pathlib import Path
from PIL import Image, ImageOps
import pymupdf
import json

out = Path('public/images/architecture')
out.mkdir(parents=True, exist_ok=True)
photos = [
    ('residential-exterior', 8134820, 'Max Vakhtbovych', 'modern-minimalist-house-exterior-design', 2200),
    ('woodland-entrance', 18950082, 'Nici Gottstein', 'trees-and-pavement-by-house', 1400),
    ('quiet-interior', 6447394, 'Max Vakhtbovych', 'interior-of-light-hall-in-apartment', 1400),
    ('public-interior', 3964535, 'ready made', 'hall-of-modern-spacious-building-on-sunny-day', 1400),
]
records = []
for name, ident, author, slug, size in photos:
    im = ImageOps.exif_transpose(Image.open(f'tmp/sourcing/{ident}.jpg')).convert('RGB')
    im.thumbnail((size, size * 2))
    target = out / f'{name}.webp'
    im.save(target, 'WEBP', quality=83, method=6)
    records.append(dict(file='/' + target.relative_to('public').as_posix(), width=im.width, height=im.height,
        creator=author, sourceUrl=f'https://www.pexels.com/photo/{slug}-{ident}/',
        downloadUrl=f'https://images.pexels.com/photos/{ident}/pexels-photo-{ident}.jpeg?auto=compress&cs=tinysrgb&w={2200 if ident != 6447394 else 1600}',
        licence='Pexels License', licenceUrl='https://www.pexels.com/license/',
        downloaded='2026-10-14', role='Architectural inspiration only; not a Pureline product, installation or facility.',
        processing='EXIF orientation, proportion-preserving resize and WebP encoding only.'))

# Portrait art direction uses original pixels, without enlargement or retouching.
im = ImageOps.exif_transpose(Image.open('tmp/sourcing/8134820.jpg')).convert('RGB')
crop_width = im.height // 2
crop_left = round((im.width - crop_width) * .45)
box = (crop_left, 0, crop_left + crop_width, im.height)
mobile = im.crop(box)
mobile.save(out / 'residential-exterior-mobile.webp', 'WEBP', quality=86, method=6)
parent = next(record for record in records if record['file'] == '/images/architecture/residential-exterior.webp')
records.append(dict(parent, file='/images/architecture/residential-exterior-mobile.webp',
    width=mobile.width, height=mobile.height, parentImage=parent['file'], cropPixels=box,
    processing='Portrait crop from original download and WebP encoding; no enlargement or retouching.'))

doc = pymupdf.open('PURELINE DOOR.pdf')
details = Path('public/images/details')
details.mkdir(parents=True, exist_ok=True)
for name, box in [('grp-construction', (27, 205, 190, 346)), ('frame-construction', (221, 414, 378, 554))]:
    pix = doc[22].get_pixmap(matrix=pymupdf.Matrix(4, 4), clip=pymupdf.Rect(box), alpha=False)
    im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
    target = details / f'{name}.webp'
    im.save(target, 'WEBP', quality=94)
    records.append(dict(file='/' + target.relative_to('public').as_posix(), width=im.width, height=im.height,
        sourceFile='PURELINE DOOR.pdf', sourcePage=23, cropPoints=box,
        reviewStatus='needs_review', imageRightsConfirmed=False,
        role='Exact source construction illustration; catalogue reference, applicability and rights pending approval.'))

box = (40, 102, 188, 405)
pix = doc[15].get_pixmap(matrix=pymupdf.Matrix(4, 4), clip=pymupdf.Rect(box), alpha=False)
im = Image.frombytes('RGB', (pix.width, pix.height), pix.samples)
im.save(details / 'bathroom-range.webp', 'WEBP', quality=94)
records.append(dict(file='/images/details/bathroom-range.webp', sourceFile='PURELINE DOOR.pdf',
    sourcePage=16, sourceLabel='6 Panels (Bathroom / Door)', cropPoints=box,
    reviewStatus='needs_review', imageRightsConfirmed=False,
    role='Exact bathroom-family catalogue photograph; not fire-rating evidence or a newly approved UK model.'))

im = Image.open('public/images/rectangle-top.webp')
box = (145, 690, 480, 1150)
im = im.crop(box)
im.save(details / 'woodgrain-detail.webp', 'WEBP', quality=92)
records.append(dict(file='/images/details/woodgrain-detail.webp', sourceFile='PURELINE DOOR.pdf',
    sourcePage=10, parentImage='/images/rectangle-top.webp', cropPixels=box,
    role='Exact detail of Rectangle Top catalogue photograph; depicts wood-effect finish, not solid timber.'))
Path('docs/creative-assets.json').write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
print('Prepared', len(records), 'assets')
