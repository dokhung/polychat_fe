"""Fitted facial surfaces and crown-to-tip hair panels for the revised avatars."""
import math
from mathutils import Vector

def face_y(x,z):
    return -.245*math.sqrt(max(.015,1-(x/.276)**2-((z-1.205)/.274)**2))

def patch(api,name,x,z,rx,rz,mat,part='Eyes',offset=.003,bulge=.003,n=32,rings=6):
    verts=[(x,face_y(x,z)-offset-bulge,z)]
    for i in range(1,rings+1):
        r=i/rings
        for j in range(n):
            a=j*math.tau/n
            px=x+rx*r*math.cos(a); pz=z+rz*r*math.sin(a)
            verts.append((px,face_y(px,pz)-offset-bulge*(1-r*r),pz))
    faces=[(0,1+j,1+(j+1)%n) for j in range(n)]
    for i in range(rings-1):
        a=1+i*n; b=a+n
        faces += [(a+j,b+j,b+(j+1)%n,a+(j+1)%n) for j in range(n)]
    return api.mesh(name,verts,faces,mat,part,'head')

def face(api,female):
    for s in [-1,1]:
        x=s*.111; z=1.196
        api.ellipsoid('Ear',(s*(.255 if female else .272),.007,1.17),(.033 if female else .043,.033,.057),'Skin','Head')
        patch(api,'Sclera',x,z,.069,.067,'White',offset=.002,bulge=.003)
        patch(api,'Iris',x-s*.004,z,.045,.061,'Eyes',offset=.008,bulge=.001)
        patch(api,'IrisGlow',x-s*.004,z-.028,.031,.027,'IrisWarm',offset=.010,bulge=.001,rings=4)
        patch(api,'Pupil',x-s*.004,z+.011,.027,.045,'Pupil',offset=.012,bulge=.001)
        patch(api,'EyeSpark',x-.018,z+.031,.011,.014,'Highlight',offset=.015,bulge=.001,rings=3,n=20)
        patch(api,'EyeSparkSmall',x+.018,z-.025,.004,.005,'Highlight',offset=.015,bulge=.001,rings=2,n=12)
        pts=[]
        for i in range(7):
            a=.08+ (math.pi-.16)*i/6
            px=x+.069*math.cos(a); pz=z+.067*math.sin(a)
            pts.append((px,face_y(px,pz)-.005,pz))
        api.sweep('UpperLid',pts,[.001,.0035,.004,.0045,.004,.0035,.001],[.002]*7,'Hair','Eyes',n=8)
        if female:
            px=x+s*.065; pz=z+.018
            api.stroke('Lash',[(px,face_y(px,pz)-.006,pz),(px+s*.013,face_y(px+s*.013,pz+.013)-.006,pz+.013)],.0025,'Hair','Eyes')
        pts=[(x-.04,1.285),(x-.003,1.297),(x+.037,1.291)]
        api.sweep('Brow',[(px,face_y(px,pz)-.004,pz) for px,pz in pts],[.002,.006,.002],[.002,.003,.002],'Hair','Eyebrows',n=8)
        patch(api,'CheekTint',s*.175,1.115,.034,.014,'Blush','Head',offset=.001,bulge=0,rings=4)
    api.ellipsoid('Nose',(0,face_y(0,1.139)-.005,1.139),(.017,.012,.018),'Skin','Head',segments=20,rings=12)
    pts=[(-.028,1.079),(-.012,1.072),(.007,1.072),(.027,1.081)]
    api.stroke('Smile',[(x,face_y(x,z)-.003,z) for x,z in pts],.0028,'Mouth','Mouth')

def hair_point(a,p,female=False,raised=0):
    radial=math.sin(p)
    if female and p>math.pi/2:
        radial=1-.075*((p-math.pi/2)/.85)**2
    rib=.0025*math.sin(11*a+1.8*p)*math.sin(p)**2
    return Vector(((.302+raised+rib)*radial*math.cos(a),(.266+raised+rib)*radial*math.sin(a)+.012,1.212+(.306+raised)*math.cos(p)))

def panel(api,name,a0,a1,p0,p1,width,part,female=False):
    verts=[]; rows=19; cols=7
    for i in range(rows):
        t=i/(rows-1)
        p=p0+(p1-p0)*t
        a=a0+(a1-a0)*(t*t*(3-2*t))
        taper=(math.sin(math.pi*t)**.42)*(.96-.25*t)+.008
        for j in range(cols):
            u=2*j/(cols-1)-1
            ridge=.012*math.sin(math.pi*t)**.55 * max(0,1-u*u)**.8
            # Roots sink into the cap; the raised ridge emerges gradually.
            v=hair_point(a+u*width*taper,p,female,ridge-.002*(1-t))
            verts.append(v)
    faces=[(i*cols+j,i*cols+j+1,(i+1)*cols+j+1,(i+1)*cols+j) for i in range(rows-1) for j in range(cols-1)]
    obj=api.mesh(name,verts,faces,'Hair',part,'head')
    solid=obj.modifiers.new('Fine hair edge','SOLIDIFY'); solid.thickness=.004
    api.bpy.context.view_layer.objects.active=obj
    api.bpy.ops.object.modifier_apply(modifier=solid.name)

def hair(api,female):
    verts=[]; rows=21; n=64
    for i in range(rows):
        t=i/(rows-1)
        for j in range(n):
            a=j*math.tau/n
            f=max(0,min(1,(-math.sin(a)-.35)/.65)); f=f*f*(3-2*f)
            end=(2.39 if female else 1.96)-(1.32 if female else .86)*f
            end+=.025*math.sin(7*a+.4)*(1-f)
            p=.006+(end-.006)*t
            verts.append(hair_point(a,p,female))
    faces=[(i*n+j,(i+1)*n+j,(i+1)*n+(j+1)%n,i*n+(j+1)%n) for i in range(rows-1) for j in range(n)]
    cap=api.mesh('HairCrown',verts,faces,'Hair','HairBack','head')
    solid=cap.modifiers.new('Hairline thickness','SOLIDIFY'); solid.thickness=.007
    api.bpy.context.view_layer.objects.active=cap
    api.bpy.ops.object.modifier_apply(modifier=solid.name)
    # Asymmetric, sweeping fringe. Each panel follows the full scalp curvature.
    ends=[(-2.60,1.57),(-2.26,1.43),(-1.95,1.34),(-1.61,1.27),(-1.25,1.23),(-.87,1.36)]
    for i,(a,p) in enumerate(ends):
        panel(api,'SweptFringe_%02d'%i,-.78-i*.13,a,.12+i*.055,p,.29,'HairFront',female)
    for s in [-1,1]:
        for i in range(2):
            a=(-.38+i*.43) if s==1 else (-math.pi+.38-i*.43)
            panel(api,'TemplePanel',a+.16*s,a,.60,2.35 if female else 1.94,.30,'HairSide',female)
    if female:
        for z in [1.313,1.34]:
            api.stroke('HairPin',[(.242,-0.15,z),(.274,-.113,z-.016)],.005,'Gold','HairSide')

