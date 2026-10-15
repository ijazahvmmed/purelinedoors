"""Prepare the reviewed Sonar/Upmind homepage photograph, preserving source pixels."""
from pathlib import Path
from PIL import Image, ImageOps
import json

source = Path('tmp/sourcing/7598374.jpg')
image = ImageOps.exif_transpose(Image.open(source)).convert('RGB')
out = Path('public/images/architecture')
out.mkdir(parents=True, exist_ok=True)
image.thumbnail((2400, 2400))
image.save(out / 'forest-residence.webp', 'WEBP', quality=82, method=6)
crop_width = round(image.height * .62)
left = round((image.width - crop_width) * .64)
box = (left, 0, left + crop_width, image.height)
portrait = image.crop(box)
portrait.thumbnail((1100, 1700))
portrait.save(out / 'forest-residence-mobile.webp', 'WEBP', quality=82, method=6)
common = dict(creator='Max Vakhtbovych', sourceUrl='https://www.pexels.com/photo/a-house-with-a-modern-design-7598374/',
    downloadUrl='https://images.pexels.com/photos/7598374/pexels-photo-7598374.jpeg?cs=srgb&fm=jpg&w=2400',
    licence='Pexels License', licenceUrl='https://www.pexels.com/license/', downloaded='2026-10-14',
    role='Architectural inspiration only; not a Pureline product, installation, UK location or facility.')
path = Path('docs/creative-assets.json')
records = json.loads(path.read_text(encoding='utf-8'))
records = [r for r in records if 'forest-residence' not in r['file']]
records.extend([
    dict(common, file='/images/architecture/forest-residence.webp', width=image.width, height=image.height,
         processing='EXIF orientation and WebP encoding; no retouching or product substitution.'),
    dict(common, file='/images/architecture/forest-residence-mobile.webp', width=portrait.width, height=portrait.height,
         parentImage='/images/architecture/forest-residence.webp', cropPixels=box,
         processing='Dedicated portrait crop and proportion-preserving WebP encoding; no enlargement or retouching.')
])
# Pre-encoded responsive AVIF avoids runtime encoding on the critical hero path.
for name, original, widths in [('forest-residence', image, [1280,1920,2400]),
                                ('forest-residence-mobile', portrait, [480,768,portrait.width])]:
    for width in widths:
        derived = original.copy()
        derived.thumbnail((width, 5000))
        file = out / f'{name}-{width}.avif'
        derived.save(file, 'AVIF', quality=45 if 'mobile' in name else 55, speed=6)
        records.append(dict(common, file='/' + file.relative_to('public').as_posix(),
            width=derived.width, height=derived.height, parentImage=f'/images/architecture/{name}.webp',
            processing='Proportion-preserving responsive AVIF encoding from the reviewed source pixels; no retouching.'))
# Keep the exact original logo in public/brand; the browser icon needs only 64px.
symbol = Image.open('public/brand/pureline-symbol.png').convert('RGBA')
symbol.thumbnail((64,64), Image.Resampling.LANCZOS)
icon = Image.new('RGBA',(64,64),(0,0,0,0))
icon.alpha_composite(symbol, ((64-symbol.width)//2,(64-symbol.height)//2))
icon.save('src/app/icon.png', optimize=True)
path.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
print('Prepared responsive WebP/AVIF hero sources and a source-faithful 64px browser icon.')
