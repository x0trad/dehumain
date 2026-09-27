import importlib.util
import json
import tempfile
import unittest
from pathlib import Path
from PIL import Image

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('generator',ROOT/'scripts/generate-collection.py')
gen=importlib.util.module_from_spec(spec); spec.loader.exec_module(gen)

class GeneratorTests(unittest.TestCase):
    def test_real_assets_reproducibility_metadata_and_no_overwrite(self):
        with tempfile.TemporaryDirectory() as tmp:
            a=gen.generate(ROOT/'generator/collection.json',Path(tmp)/'a',3,'test-seed')
            b=gen.generate(ROOT/'generator/collection.json',Path(tmp)/'b',3,'test-seed','ipfs://example')
            self.assertEqual([x['pixel_sha256'] for x in a['items']],[x['pixel_sha256'] for x in b['items']])
            self.assertEqual(len(set(x['pixel_sha256'] for x in a['items'])),3)
            for record in a['items']:
                meta=json.loads((Path(tmp)/'a'/record['metadata']).read_text())
                self.assertEqual(meta['attributes'],record['attributes'])
                with Image.open(Path(tmp)/'a'/record['image']) as image:
                    self.assertEqual(image.size,(900,900))
            self.assertEqual(json.loads((Path(tmp)/'b/metadata/0001.json').read_text())['image'],'ipfs://example/0001.png')
            with self.assertRaisesRegex(ValueError,'already exists'):
                gen.generate(ROOT/'generator/collection.json',Path(tmp)/'a',3)
    def test_capacity(self):
        with tempfile.TemporaryDirectory() as tmp:
            with self.assertRaisesRegex(ValueError,'exceeds'):
                gen.generate(ROOT/'generator/collection.json',Path(tmp)/'out',1085761)

    def test_balanced_counts(self):
        with tempfile.TemporaryDirectory() as tmp:
            manifest=gen.generate(ROOT/'generator/collection.json',Path(tmp)/'balanced',131,'balanced-test',balanced=True)
            self.assertEqual(manifest['selection'],'balanced')
            for group in ['Eyes','Head','Mouth','Body']:
                counts={}
                for item in manifest['items']:
                    value=next(attribute['value'] for attribute in item['attributes'] if attribute['trait_type']==group)
                    counts[value]=counts.get(value,0)+1
                self.assertLessEqual(max(counts.values())-min(counts.values()),1)

if __name__=='__main__': unittest.main()
