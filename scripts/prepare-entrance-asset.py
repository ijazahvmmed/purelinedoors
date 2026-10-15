"""Extract the visible Arch leaf from the existing catalogue image, unchanged.

The photographed outer surround stays out of the moving plane. This is a crop,
not a reconstruction: glazing, panels, finish, handle and right-hand hinges are
retained. No dimensions or construction specifications are inferred from it.
"""
from pathlib import Path
from PIL import Image
import json

target = Path('public/images/entrance')
target.mkdir(parents=True, exist_ok=True)
source = Image.open('public/images/arch.webp')
assert source.size == (650, 1270)
source.crop((29, 28, 625, 1242)).save(target / 'arch-leaf.webp', 'WEBP', quality=94, method=6)
manifest = Path('docs/creative-assets.json')
records = json.loads(manifest.read_text(encoding='utf-8'))
records = [record for record in records if record['file'] != '/images/entrance/arch-leaf.webp']
records.append(dict(file='/images/entrance/arch-leaf.webp', width=596, height=1214,
    parentImage='/images/arch.webp', sourceFile='PURELINE DOOR.pdf', sourcePage=10,
    sourceProductSlug='arch', cropPixels=[29, 28, 625, 1242], reviewStatus='needs_review', imageRightsConfirmed=False,
    role='Original catalogue leaf artwork for the interactive spatial study. Right-hand hinges and left-hand handle are visible in the source.',
    processing='Crop and WebP encoding only. No recolouring, hardware replacement, generated product pixels or construction inference.'))
manifest.write_text(json.dumps(records, ensure_ascii=False, indent=2), encoding='utf-8')
print('Arch leaf: 596 × 1214; original right-hand hinges retained.')
