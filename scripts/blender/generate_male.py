"""blender --background --python scripts/blender/generate_male.py"""
import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent))
from character_factory import build
build('male')
