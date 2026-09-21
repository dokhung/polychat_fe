"""Reusable selected-character GLB export, also executable on an open .blend."""
from pathlib import Path
import bpy

def export_character(path):
    bpy.ops.object.select_all(action='DESELECT')
    for obj in bpy.context.scene.objects:
        if obj.type in {'MESH', 'ARMATURE', 'EMPTY'} and not obj.get('studio'):
            obj.select_set(True)
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    bpy.ops.export_scene.gltf(
        filepath=str(path), export_format='GLB', use_selection=True,
        export_yup=True, export_apply=False, export_animations=True,
        export_animation_mode='NLA_TRACKS', export_nla_strips=True,
        export_skins=True, export_morph=True, export_extras=True,
        export_force_sampling=True, export_frame_range=False,
    )

if __name__ == '__main__':
    import sys
    args = sys.argv[sys.argv.index('--') + 1:] if '--' in sys.argv else []
    export_character(args[0] if args else Path(bpy.data.filepath).with_suffix('.glb'))
