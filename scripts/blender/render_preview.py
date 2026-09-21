"""Render an opened avatar .blend at front, three-quarter and side angles."""
import bpy
import math
import sys
from pathlib import Path
from mathutils import Vector
scene=bpy.context.scene
animation=sys.argv[sys.argv.index('--')+1] if '--' in sys.argv else None
if animation:
    rig=bpy.data.objects['Armature']
    rig.animation_data.action=bpy.data.actions[animation]
    scene.frame_set(31 if animation=='Wave' else 9)
scene.render.engine='CYCLES'
scene.cycles.samples=24
scene.cycles.use_denoising=True
scene.render.resolution_x=640; scene.render.resolution_y=720; scene.render.resolution_percentage=100
scene.world.color=(.25,.25,.25)
scene.view_settings.view_transform='AgX'
def aim(obj,point): obj.rotation_euler=(Vector(point)-obj.location).to_track_quat('-Z','Y').to_euler()
for name,loc,power,color,size in [('Key',(-3,-4,5),400,(1,.88,.78),4),('Fill',(3,-2,2),200,(.79,.86,1),3),('Rim',(1,3,3),500,(.75,.65,1),3)]:
    bpy.ops.object.light_add(type='AREA',location=loc)
    light=bpy.context.object; light.name=name; light.data.energy=power; light.data.color=color; light.data.shape='DISK'; light.data.size=size; aim(light,(0,0,.8))
bpy.ops.mesh.primitive_plane_add(size=200)
floor=bpy.context.object
m=bpy.data.materials.new('Studio'); m.diffuse_color=(.20,.19,.25,1); floor.data.materials.append(m)
bpy.ops.object.camera_add(location=(0,-3.4,1.18))
camera=bpy.context.object; scene.camera=camera; camera.data.type='ORTHO'; camera.data.ortho_scale=1.9
out=Path(bpy.data.filepath).parent/'previews'; out.mkdir(exist_ok=True)
for name,angle in [('front',0),('quarter',math.pi/4),('side',math.pi/2)]:
    camera.location=(3.4*math.sin(angle),-3.4*math.cos(angle),1.18); aim(camera,(0,0,.77))
    scene.render.filepath=str(out/(Path(bpy.data.filepath).stem+'_'+(animation+'_' if animation else '')+name+'.png'))
    bpy.ops.render.render(write_still=True)
