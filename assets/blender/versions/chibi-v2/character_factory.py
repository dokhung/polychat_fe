"""Original Moonvale avatars. Blender 5.2 LTS; no external assets or add-ons.

Coordinates: X right, -Y forward, Z up. Export converts to glTF Y-up.
Profile lofts, swept hair locks and fitted face details are authored meshes.
Weights are deterministic anatomical blends, never automatic heat weights.
"""
import math
import json
import sys
from pathlib import Path
import bpy
import bmesh
from mathutils import Vector, Euler
from export_character import export_character
import art_surfaces

ROOT = Path(__file__).resolve().parents[2]
PARTS = {}
MATERIALS = {}

def material(name, color, roughness=.72):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    rgb = [int(color[i:i+2], 16)/255 for i in (1, 3, 5)]
    rgb = [v/12.92 if v < .04045 else ((v+.055)/1.055)**2.4 for v in rgb]
    m.diffuse_color = (*rgb, 1)
    bsdf = m.node_tree.nodes.get('Principled BSDF')
    bsdf.inputs['Base Color'].default_value = (*rgb, 1)
    bsdf.inputs['Roughness'].default_value = roughness
    MATERIALS[name] = m
    return m

def finish(obj, name, mat, part, bone):
    obj.name = name
    bpy.context.view_layer.objects.active = obj
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    obj.data.materials.append(MATERIALS[mat])
    bm=bmesh.new(); bm.from_mesh(obj.data)
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    bm.to_mesh(obj.data); bm.free()
    for p in obj.data.polygons:
        p.use_smooth = True
    obj['slot'] = part
    obj['binding'] = bone
    PARTS.setdefault(part, []).append(obj)
    return obj

def ellipsoid(name, center, scale, mat, part, bone='head', segments=24, rings=16):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings, location=center)
    obj = bpy.context.object
    obj.scale = scale
    obj=finish(obj, name, mat, part, bone)
    if name in {'EyeWhite','Iris','Pupil','EyeSpark','EyeSparkSmall','CheekTint'}:
        def surface(x,z): return -.245*math.sqrt(max(.04,1-(x/.276)**2-((z-1.205)/.274)**2))
        for v in obj.data.vertices:
            v.co.y += surface(v.co.x,v.co.z)-surface(center[0],center[2])
    return obj

def mesh(name, verts, faces, mat, part, bone):
    data = bpy.data.meshes.new(name)
    data.from_pydata(verts, [], faces)
    data.update()
    obj = bpy.data.objects.new(name, data)
    bpy.context.collection.objects.link(obj)
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    return finish(obj, name, mat, part, bone)

def loft(name, profiles, mat, part, bone, n=32):
    # Ring profile: z, x center, y center, x radius, y radius.
    verts = [(x+rx*math.cos(j*math.tau/n), y+ry*math.sin(j*math.tau/n), z)
             for z,x,y,rx,ry in profiles for j in range(n)]
    faces = [(i*n+j, i*n+(j+1)%n, (i+1)*n+(j+1)%n, (i+1)*n+j)
             for i in range(len(profiles)-1) for j in range(n)]
    faces += [tuple(reversed(range(n))), tuple((len(profiles)-1)*n+j for j in range(n))]
    return mesh(name, verts, faces, mat, part, bone)

def sweep(name, points, widths, depths, mat, part, bone='head', n=12):
    # Smooth Catmull-Rom sweep. Flattened locks taper to a sculpted tip.
    pts = [Vector(p) for p in points]
    samples = []
    for i in range(len(pts)-1):
        p0,p1,p2,p3 = pts[max(i-1,0)],pts[i],pts[i+1],pts[min(i+2,len(pts)-1)]
        for k in range(5):
            t=k/5
            p=.5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t*t+(-p0+3*p1-3*p2+p3)*t*t*t)
            samples.append((p, widths[i]*(1-t)+widths[i+1]*t, depths[i]*(1-t)+depths[i+1]*t))
    samples.append((pts[-1], widths[-1], depths[-1]))
    verts=[]
    for i,(p,w,d) in enumerate(samples):
        tangent=(samples[min(i+1,len(samples)-1)][0]-samples[max(i-1,0)][0]).normalized()
        across=tangent.cross(Vector((0,1,0))).normalized()
        depth=across.cross(tangent).normalized()
        verts += [p+across*(w*math.cos(j*math.tau/n))+depth*(d*math.sin(j*math.tau/n)) for j in range(n)]
    faces=[(i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n) for i in range(len(samples)-1) for j in range(n)]
    faces += [tuple(reversed(range(n))),tuple((len(samples)-1)*n+j for j in range(n))]
    return mesh(name,verts,faces,mat,part,bone)

def stroke(name, points, radius, mat, part, bone='head'):
    return sweep(name, points, [radius]*len(points), [radius]*len(points),mat,part,bone,n=8)

def create_rig():
    arm=bpy.data.armatures.new('AvatarSkeleton')
    rig=bpy.data.objects.new('Armature',arm)
    bpy.context.collection.objects.link(rig)
    bpy.context.view_layer.objects.active=rig
    rig.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    def bone(name,head,tail,parent=None):
        b=arm.edit_bones.new(name); b.head=head; b.tail=tail
        # Explicit roll keeps arm abduction in the frontal plane.
        b.align_roll(Vector((0,1,0)))
        if parent: b.parent=arm.edit_bones[parent]
    bone('root',(0,0,0),(0,0,.12))
    bone('hips',(0,0,.52),(0,0,.66),'root')
    bone('spine',(0,0,.66),(0,0,.80),'hips')
    bone('chest',(0,0,.80),(0,0,.94),'spine')
    bone('neck',(0,0,.94),(0,0,1.02),'chest')
    bone('head',(0,0,1.02),(0,0,1.45),'neck')
    for s,suffix in [(1,'L'),(-1,'R')]:
        bone('upper_arm.'+suffix,(s*.19,0,.89),(s*.29,0,.74),'chest')
        bone('lower_arm.'+suffix,(s*.29,0,.74),(s*.345,-.005,.63),'upper_arm.'+suffix)
        bone('hand.'+suffix,(s*.345,-.005,.63),(s*.36,-.012,.565),'lower_arm.'+suffix)
        bone('upper_leg.'+suffix,(s*.103,0,.56),(s*.106,0,.34),'hips')
        bone('lower_leg.'+suffix,(s*.106,0,.34),(s*.106,0,.13),'upper_leg.'+suffix)
        bone('foot.'+suffix,(s*.106,0,.13),(s*.106,-.14,.065),'lower_leg.'+suffix)
    bpy.ops.object.mode_set(mode='OBJECT')
    return rig

def skin(obj,rig):
    binding=obj['binding']
    for v in obj.data.vertices:
        z=v.co.z
        weights={binding:1.0}
        if binding=='torso':
            t=max(0,min(1,(z-.64)/.20)); weights={'spine':1-t,'chest':t}
        elif binding=='garment':
            t=max(0,min(1,(z-.64)/.20))
            arm=max(0,min(1,(abs(v.co.x)-.145)/.105)); arm=arm*arm*(3-2*arm)
            shoulder=max(0,min(1,(z-.73)/.105)); arm*=shoulder*shoulder*(3-2*shoulder)
            weights={'spine':(1-t)*(1-arm),'chest':t*(1-arm),'upper_arm.'+('L' if v.co.x>0 else 'R'):arm}
        elif binding.startswith('arm.'):
            suffix=binding[-1]; t=max(0,min(1,(.79-z)/.09))
            weights={'upper_arm.'+suffix:1-t,'lower_arm.'+suffix:t}
        elif binding.startswith('leg.'):
            suffix=binding[-1]; t=max(0,min(1,(.39-z)/.10))
            weights={'upper_leg.'+suffix:1-t,'lower_leg.'+suffix:t}
        for name,w in weights.items():
            if w>0:
                group=obj.vertex_groups.get(name) or obj.vertex_groups.new(name=name)
                group.add([v.index],w,'REPLACE')
    mod=obj.modifiers.new('Avatar skin','ARMATURE'); mod.object=rig

def animations(rig):
    scene=bpy.context.scene; scene.render.fps=30
    rig.animation_data_create()
    for name,frames in [('Idle',90),('Walk',30),('Wave',60),('TurnAround',120),('Run',24),('Sit',60)]:
        action=bpy.data.actions.new(name); rig.animation_data.action=action
        for frame in range(1,frames+2,3):
            t=(frame-1)/frames; phase=t*math.tau
            for b in rig.pose.bones:
                b.rotation_mode='XYZ'; b.rotation_euler=(0,0,0); b.location=(0,0,0); b.scale=(1,1,1)
            rig.pose.bones['chest'].scale=(1+.012*math.sin(phase),1+.009*math.sin(phase),1+.008*math.sin(phase))
            rig.pose.bones['head'].rotation_euler[1]=.035*math.sin(phase)
            for s,suffix in [(1,'L'),(-1,'R')]:
                rig.pose.bones['upper_arm.'+suffix].rotation_euler[2]=s*.025*math.sin(phase)
                if name in {'Walk','Run'}:
                    a=phase+(0 if s==1 else math.pi)
                    rig.pose.bones['upper_leg.'+suffix].rotation_euler[0]=.48*math.sin(a)
                    rig.pose.bones['lower_leg.'+suffix].rotation_euler[0]=.48*max(0,math.cos(a))
                    rig.pose.bones['upper_arm.'+suffix].rotation_euler[0]=-.32*math.sin(a)
                    rig.pose.bones['foot.'+suffix].rotation_euler[0]=-.14*math.sin(a)
            # Pose-bone local Y follows the vertical root bone (world Z).
            if name in {'Walk','Run'}: rig.pose.bones['root'].location[1]=.018*(1-math.cos(2*phase))
            if name=='Wave':
                envelope=math.sin(math.pi*t)**2
                rig.pose.bones['upper_arm.R'].rotation_euler[2]=1.65*envelope
                rig.pose.bones['lower_arm.R'].rotation_euler[2]=(.35+.30*math.sin(phase*3))*envelope
                rig.pose.bones['head'].rotation_euler[2]=-.09*envelope
            if name=='TurnAround': rig.pose.bones['root'].rotation_euler[1]=phase
            if name=='Sit':
                rig.pose.bones['root'].location[1]=-.30
                for suffix in ['L','R']:
                    rig.pose.bones['upper_leg.'+suffix].rotation_euler[0]=-1.35
                    rig.pose.bones['lower_leg.'+suffix].rotation_euler[0]=1.10
            for b in rig.pose.bones:
                b.keyframe_insert('rotation_euler',frame=frame,group=b.name)
                b.keyframe_insert('location',frame=frame,group=b.name)
                b.keyframe_insert('scale',frame=frame,group=b.name)
        track=rig.animation_data.nla_tracks.new(); track.name=name
        track.strips.new(name,1,action); track.mute=True
        rig.animation_data.action=None
    scene.frame_set(1)
    for b in rig.pose.bones:
        b.location=(0,0,0); b.rotation_euler=(0,0,0); b.scale=(1,1,1)

def build(gender):
    bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
    PARTS.clear(); MATERIALS.clear()
    female=gender=='female'
    for name,color,rough in [('Skin','#f3d0b7',.78),('Hair','#604036' if female else '#76503c',.66),('HairSheen','#805646',.70),('Top','#b9dace' if female else '#bdaee9',.78),('Bottom','#303b59',.78),('Shoes','#fff9ef',.66),('Sole','#d9ddea',.8),('White','#fff9f1',.5),('Eyes','#43303d',.4),('Pupil','#231f2c',.4),('Highlight','#ffffff',.25),('Blush','#e8afa5',.85),('Mouth','#a36567',.8),('Trim','#eae3fa',.8),('Gold','#efc786',.7)]:
        material(name,color,rough)
    # Broad cheeks with a gently tapered chin: authored latitude profile.
    profiles=[]
    for i in range(1,25):
        a=-math.pi/2+math.pi*i/25
        z=1.205+.274*math.sin(a)
        cheek=1+.075*math.exp(-((z-1.12)/.075)**2)
        profiles.append((z,0,0,.276*math.cos(a)*cheek,.245*math.cos(a)))
    profiles=[(.931,0,0,.003,.003)]+profiles+[(1.479,0,0,.003,.003)]
    head=loft('Head',profiles,'Skin','Head','head',48)
    head.shape_key_add(name='Basis')
    soft=head.shape_key_add(name='Soft')
    for v in soft.data:
        if v.co.z<1.21: v.co.x*=.96
    ellipsoid('Neck',(0,0,.967),(.071,.064,.085),'Skin','Body','neck')
    material('IrisWarm','#9e704e',.65)
    art_surfaces.face(sys.modules[__name__],female)
    art_surfaces.hair(sys.modules[__name__],female)
    # Oversized shirt, rolled hems, small pocket and embroidered moon emblem.
    loft('Tee',[(.565,0,0,.168,.113),(.58,0,0,.188,.127),(.63,0,0,.195,.132),(.76,0,0,.185,.124),(.855,0,0,.199,.115),(.906,0,0,.154,.096),(.94,0,0,.077,.065)],'Top','Top','torso')
    loft('TeeHem',[(.567,0,0,.171,.116),(.576,0,0,.190,.129),(.592,0,0,.192,.129)],'Top','Top','spine')
    loft('Collar',[(.934,0,0,.080,.069),(.944,0,0,.08,.069),(.951,0,0,.070,.06)],'Trim','Top','chest')
    ellipsoid('Pocket',(.093,-.119,.782),(.045,.012,.049),'Top','Top','chest',segments=20,rings=12)
    stroke('PocketSeam',[(.053,-.133,.805),(.093,-.14,.80),(.13,-.126,.801)],.003,'Trim','Top','chest')
    ellipsoid('MoonPatch',(-.075,-.124,.81),(.024,.006,.025),'Gold','Top','chest',segments=20,rings=12)
    ellipsoid('MoonInset',(-.065,-.130,.819),(.020,.005,.022),'Top','Top','chest',segments=20,rings=12)
    for s,suffix in [(1,'L'),(-1,'R')]:
        sweep('Sleeve',[(s*.102,0,.861),(s*.208,0,.85),(s*.263,0,.788)], [.071,.085,.076],[.080,.102,.083],'Top','Top','upper_arm.'+suffix,n=24)
        sweep('SleeveCuff',[(s*.253,0,.80),(s*.264,0,.783)], [.078,.076],[.085,.083],'Trim','Top','upper_arm.'+suffix,n=24)
        sweep('Arm',[(s*.25,0,.80),(s*.29,0,.74),(s*.33,-.005,.66)], [.058,.057,.045],[.061,.055,.043],'Skin','Body','arm.'+suffix,n=20)
        ellipsoid('Hand',(s*.35,-.008,.609),(.058,.05,.064),'Skin','Body','hand.'+suffix)
        ellipsoid('Thumb',(s*.316,-.036,.624),(.025,.024,.034),'Skin','Body','hand.'+suffix,segments=16,rings=12)
        loft('Shorts',[(.395,s*.106,0,.083,.093),(.41,s*.106,0,.095,.099),(.50,s*.10,0,.101,.103),(.59,s*.095,0,.101,.11)],'Bottom','Bottom','upper_leg.'+suffix,n=28)
        loft('ShortHem',[(.394,s*.106,0,.085,.095),(.411,s*.106,0,.095,.10)],'Bottom','Bottom','upper_leg.'+suffix,n=28)
        loft('Leg',[(.126,s*.106,0,.05,.052),(.24,s*.106,0,.053,.056),(.34,s*.106,0,.064,.063),(.42,s*.106,0,.065,.065)],'Skin','Body','leg.'+suffix,n=24)
        loft('Sock',[(.13,s*.106,0,.053,.056),(.20,s*.106,0,.055,.058),(.216,s*.106,0,.055,.058)],'White','Shoes','lower_leg.'+suffix,n=24)
        loft('Sneaker',[(.030,s*.106,-.043,.078,.13),(.045,s*.106,-.044,.087,.137),(.080,s*.106,-.046,.086,.132),(.112,s*.106,-.036,.078,.116),(.142,s*.106,-.008,.063,.085),(.162,s*.106,.006,.052,.057)],'Shoes','Shoes','foot.'+suffix,n=32)
        loft('Sole',[(0,s*.106,-.04,.070,.116),(.012,s*.106,-.04,.088,.14),(.035,s*.106,-.04,.090,.142),(.045,s*.106,-.04,.087,.139)],'Sole','Shoes','foot.'+suffix,n=32)
        ellipsoid('Tongue',(s*.106,-.058,.143),(.041,.05,.012),'Shoes','Shoes','foot.'+suffix,segments=20,rings=12)
        for y,z in [(-.094,0.13),(-.07,.145),(-.046,.155)]:
            stroke('Laces',[(s*.106-.031,y,z),(s*.106,y-.002,z+.009),(s*.106+.031,y,z)],.0035,'Trim','Shoes','foot.'+suffix)
    # Fuse the actual shirt/sleeve shell, then weight its continuous shoulder.
    shells=[o for o in PARTS['Top'] if o.name=='Tee' or o.name.startswith('Sleeve') and not o.name.startswith('SleeveCuff')]
    bpy.ops.object.select_all(action='DESELECT')
    for obj in shells: obj.select_set(True)
    bpy.context.view_layer.objects.active=shells[0]
    PARTS['Top']=[o for o in PARTS['Top'] if o not in shells]
    bpy.ops.object.join()
    tee=bpy.context.object; tee.name='ContinuousTee'; tee['binding']='garment'
    remesh=tee.modifiers.new('Continuous shoulder topology','REMESH'); remesh.mode='VOXEL'; remesh.voxel_size=.012; remesh.use_smooth_shade=True
    bpy.ops.object.modifier_apply(modifier=remesh.name)
    smooth=tee.modifiers.new('Relax cloth surface','SMOOTH'); smooth.factor=.8; smooth.iterations=4
    bpy.ops.object.modifier_apply(modifier=smooth.name)
    dec=tee.modifiers.new('Web garment budget','DECIMATE'); dec.ratio=.25
    bpy.ops.object.modifier_apply(modifier=dec.name)
    PARTS['Top'].append(tee)
    rig=create_rig()
    character=bpy.data.objects.new('Character',None); bpy.context.collection.objects.link(character); rig.parent=character
    tris=sum(len(p.vertices)-2 for objects in PARTS.values() for o in objects for p in o.data.polygons)
    height=max(v.co.z for objects in PARTS.values() for o in objects for v in o.data.vertices)
    for part,objects in PARTS.items():
        for obj in objects:
            obj.parent=rig; skin(obj,rig)
        if part!='Head':
            bpy.ops.object.select_all(action='DESELECT')
            for obj in objects: obj.select_set(True)
            bpy.context.view_layer.objects.active=objects[0]
            bpy.ops.object.join()
            objects[0].name=part
    animations(rig)
    bpy.context.scene.frame_start=1; bpy.context.scene.frame_end=91
    bpy.ops.object.select_all(action='DESELECT')
    for screen in bpy.data.screens:
        for area in screen.areas:
            if area.type=='VIEW_3D':
                space=area.spaces.active
                space.shading.type='MATERIAL'
                space.overlay.show_overlays=False
                space.region_3d.view_location=(0,0,.77)
                space.region_3d.view_rotation=Euler((math.pi/2,0,0)).to_quaternion()
                space.region_3d.view_distance=2.8
                space.region_3d.view_perspective='ORTHO'
    out=ROOT/'assets'/'blender'; out.mkdir(parents=True,exist_ok=True)
    bpy.ops.wm.save_as_mainfile(filepath=str(out/f'avatar_{gender}.blend'))
    export_character(ROOT/'public'/'models'/'characters'/f'avatar_{gender}.glb')
    stats={'gender':gender,'triangles':tris,'bones':len(rig.data.bones),'height':height,'animations':[t.name for t in rig.animation_data.nla_tracks]}
    (out/f'avatar_{gender}.json').write_text(json.dumps(stats,indent=2))
    print('AVATAR_REPORT',json.dumps(stats))


