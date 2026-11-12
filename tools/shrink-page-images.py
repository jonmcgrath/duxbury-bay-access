# Convert page images to 1000px grayscale JPEG (quality 60). usage: python -I tools/shrink-page-images.py <folder>
import sys, os, glob
from PIL import Image
root = sys.argv[1]
for f in glob.glob(os.path.join(root, '**', '*.jpg'), recursive=True):
    im = Image.open(f).convert('L')
    if im.width > 1000: im = im.resize((1000, int(im.height * 1000 / im.width)))
    im.save(f, 'JPEG', quality=60, optimize=True)
