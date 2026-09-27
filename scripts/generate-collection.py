#!/usr/bin/env python3
"""Offline Trait Lab compositor. No model, network, wallet or API calls."""
import argparse
import csv
import hashlib
import json
import math
import random
from collections import Counter
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]

def digest(data):
    return hashlib.sha256(data).hexdigest()

def load_config(path):
    config = json.loads(path.read_text())
    order = config['paint_order']
    if set(order) != set(config['groups']) or len(order) != len(set(order)):
        raise ValueError('Paint order must list every group exactly once')
    images = {}
    for item in [config['base']] + [t for g in order for t in config['groups'][g]]:
        data = (path.parent / item['file']).read_bytes()
        if digest(data) != item['sha256']:
            raise ValueError('Asset checksum mismatch: ' + item['file'])
        with Image.open(path.parent / item['file']) as image:
            images[item['file']] = image.convert('RGBA')
        if list(images[item['file']].size) != config['base']['size']:
            raise ValueError('All layers must have matching dimensions')
    for g in order:
        traits = config['groups'][g]
        if len({t['name'] for t in traits}) != len(traits):
            raise ValueError('Duplicate trait names in ' + g)
        if any(not isinstance(t['weight'], (int, float)) or not math.isfinite(t['weight']) or t['weight'] < 0 for t in traits):
            raise ValueError('Weights must be finite nonnegative numbers')
        if not any(t['weight'] > 0 for t in traits):
            raise ValueError('Every group needs an enabled trait')
    for rule in config['exclude']:
        if not rule or any(g not in order or name not in [t['name'] for t in config['groups'][g]] for g, name in rule.items()):
            raise ValueError('Invalid exclusion rule')
    return config, images

def balanced_quotas(config, order, count, rng):
    quotas = {}
    for group in order:
        enabled = [trait for trait in config['groups'][group] if trait['weight'] > 0]
        base, extra = divmod(count, len(enabled))
        extras = set(rng.sample(range(len(enabled)), extra))
        quotas[group] = {trait['name']: base + (index in extras) for index, trait in enumerate(enabled)}
    return quotas

def choose_remaining(traits, remaining, rng):
    available = [trait for trait in traits if remaining.get(trait['name'], 0) > 0]
    return rng.choices(available, weights=[remaining[trait['name']] for trait in available])[0]

def generate(config_path, output, count, seed=None, image_base=None, balanced=False):
    if count < 1:
        raise ValueError('Count must be positive')
    if output.exists():
        raise ValueError('Output already exists; choose a new directory to preserve prior batches')
    config, images = load_config(config_path)
    order = config['paint_order']
    capacity = math.prod(sum(t['weight'] > 0 for t in config['groups'][g]) for g in order)
    if count > capacity:
        raise ValueError(f'Count exceeds {capacity} enabled combinations before exclusions')
    seed = seed or config['seed']
    rng = random.Random(seed)
    quotas = balanced_quotas(config, order, count, rng) if balanced else None
    seen, pixels, records = set(), set(), []
    frequencies = {g: Counter() for g in order}
    (output / 'images').mkdir(parents=True)
    (output / 'metadata').mkdir()
    thumb_size = 180
    sheet = Image.new('RGB', (thumb_size * 10, (thumb_size + 24) * math.ceil(min(count, 100)/10)), '#11120f')
    draw = ImageDraw.Draw(sheet)
    rejected = Counter()
    try:
        for attempt in range(max(10000, count * 100)):
            chosen = {
                g: choose_remaining(config['groups'][g], quotas[g], rng)
                if balanced else rng.choices(config['groups'][g], weights=[t['weight'] for t in config['groups'][g]])[0]
                for g in order
            }
            signature = tuple(chosen[g]['name'] for g in order)
            if signature in seen:
                rejected['duplicate_combination'] += 1
                continue
            seen.add(signature)
            if any(all(chosen[g]['name'] == name for g, name in rule.items()) for rule in config['exclude']):
                rejected['excluded'] += 1
                continue
            image = images[config['base']['file']].copy()
            for g in order:
                image.alpha_composite(images[chosen[g]['file']])
            pixel_hash = digest(image.tobytes())
            if pixel_hash in pixels:
                rejected['identical_pixels'] += 1
                continue
            pixels.add(pixel_hash)
            if balanced:
                for g in order:
                    quotas[g][chosen[g]['name']] -= 1
            token = len(records) + 1
            filename = f'{token:04}.png'
            image.save(output / 'images' / filename)
            attributes = [{'trait_type': g, 'value': chosen[g]['name']} for g in ['Eyes','Head','Mouth','Body'] if g in chosen]
            metadata = {'name': f"{config['name']} #{token:04}", 'description': config['description'], 'image': f"{image_base.rstrip('/')}/{filename}" if image_base else f'../images/{filename}', 'attributes': attributes}
            (output / 'metadata' / f'{token:04}.json').write_text(json.dumps(metadata, indent=2)+'\n')
            records.append({'token_id': token, 'image': f'images/{filename}', 'metadata': f'metadata/{token:04}.json', 'pixel_sha256': pixel_hash, 'file_sha256': digest((output/'images'/filename).read_bytes()), 'attributes': attributes})
            for g in order:
                frequencies[g][chosen[g]['name']] += 1
            if token <= 100:
                x, y = ((token-1)%10)*thumb_size, ((token-1)//10)*(thumb_size+24)
                sheet.paste(image.convert('RGB').resize((thumb_size,thumb_size), Image.Resampling.LANCZOS), (x,y))
                draw.text((x+8,y+thumb_size+5), f'Dehumain #{token:04}', fill='white')
            if token % 25 == 0:
                print(f'Rendered {token}/{count}', flush=True)
            if token == count:
                break
        if len(records) != count:
            raise ValueError(f'Only {len(records)} unique images found; revise constraints or weights')
        sheet.save(output/'contact-sheet.jpg', quality=90)
        with (output/'rarity.csv').open('w', newline='') as handle:
            writer = csv.writer(handle)
            writer.writerow(['category','trait','weight','count','percent'])
            for g in order:
                for t in config['groups'][g]:
                    n=frequencies[g][t['name']]
                    writer.writerow([g,t['name'],t['weight'],n,round(n/count*100,4)])
        (output/'config.json').write_text(json.dumps(config,indent=2)+'\n')
        if balanced and any(value for group in quotas.values() for value in group.values()):
            raise ValueError('Balanced quota accounting did not finish at zero')
        manifest = {'status':'complete','selection':'balanced' if balanced else 'weighted','seed':seed,'count':count,'dimensions':config['base']['size'],'config_sha256':digest(config_path.read_bytes()),'image_base':image_base,'ready_for_upload':bool(image_base),'rejections':dict(rejected),'items':records}
        (output/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
        print(f'Complete: {output}; metadata image URIs '+('configured' if image_base else 'LOCAL ONLY — replace before minting'))
        return manifest
    except Exception:
        (output/'INCOMPLETE.txt').write_text('Generation failed. This folder is not a mint-ready collection. Use a new output directory for retry.\n')
        raise

if __name__ == '__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--config',type=Path,default=ROOT/'generator/collection.json')
    parser.add_argument('--out',type=Path,required=True)
    parser.add_argument('--count',type=int,default=100)
    parser.add_argument('--seed')
    parser.add_argument('--image-base',help='Final image-folder URI, e.g. ipfs://CID')
    parser.add_argument('--balanced',action='store_true',help='Distribute every enabled trait as evenly as mathematically possible')
    args=parser.parse_args()
    generate(args.config.resolve(),args.out.resolve(),args.count,args.seed,args.image_base,args.balanced)
