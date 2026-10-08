#!/usr/bin/env python3
"""Original, code-native copper sculpture; projected torus geometry, painter depth order."""
import math
from pathlib import Path

def rotate(v):
    x,y,z=v
    a,b,c=map(math.radians,(58,-22,-22))
    y,z=y*math.cos(a)-z*math.sin(a),y*math.sin(a)+z*math.cos(a)
    x,z=x*math.cos(b)+z*math.sin(b),-x*math.sin(b)+z*math.cos(b)
    return (x*math.cos(c)-y*math.sin(c),x*math.sin(c)+y*math.cos(c),z)

def shape(u,v,level):
    # Superellipse centerline with an elliptical copper tube.
    power=.58
    cu,su=math.cos(u),math.sin(u)
    x=170*math.copysign(abs(cu)**power,cu)
    y=170*math.copysign(abs(su)**power,su)
    du=.0001
    def xy(t):return (170*math.copysign(abs(math.cos(t))**power,math.cos(t)),170*math.copysign(abs(math.sin(t))**power,math.sin(t)))
    xa,ya=xy(u-du);xb,yb=xy(u+du);dx,dy=xb-xa,yb-ya
    length=math.hypot(dx,dy);nx,ny=dy/length,-dx/length
    return rotate((x+18*math.cos(v)*nx,y+18*math.cos(v)*ny,level+14*math.sin(v)))

def project(p):
    x,y,z=p;scale=1.16*850/(850-z)
    return (380+x*scale,343+y*scale)

def build():
    polys=[]
    light=(-.35,-.65,.68)
    for layer,level in enumerate((-82,0,82)):
        N,M=88,12
        for i in range(N):
            for j in range(M):
                points=[shape(2*math.pi*(i+di)/N,2*math.pi*(j+dj)/M,level) for di,dj in ((0,0),(1,0),(1,1),(0,1))]
                a,b,c=points[:3];va=[b[k]-a[k] for k in range(3)];vb=[c[k]-a[k] for k in range(3)]
                n=(va[1]*vb[2]-va[2]*vb[1],va[2]*vb[0]-va[0]*vb[2],va[0]*vb[1]-va[1]*vb[0]);ln=math.sqrt(sum(k*k for k in n));n=tuple(k/ln for k in n)
                diffuse=max(0,sum(n[k]*light[k] for k in range(3)))
                spec=max(0,n[0]*-.18+n[1]*-.33+n[2]*.927)**26
                rim=max(0,1-abs(n[2]))**3*.15
                brightness=.23+.74*diffuse+rim
                rgb=[min(255,round(base*brightness+spec*105)) for base in (224,147,97)]
                color='#'+''.join(f'{k:02x}' for k in rgb)
                coords=' '.join(f'{x:.1f},{y:.1f}' for x,y in map(project,points))
                polys.append((sum(p[2] for p in points)/4,f'<polygon points="{coords}" fill="{color}" stroke="{color}" stroke-width=".45"/>'))
    polys.sort(key=lambda p:p[0])
    svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 760 720" width="760" height="720"><defs><radialGradient id="shadow"><stop stop-color="#000" stop-opacity=".65"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs><ellipse cx="388" cy="635" rx="220" ry="38" fill="url(#shadow)"/>'+''.join(p[1] for p in polys)+'</svg>'
    out=Path(__file__).resolve().parents[1]/'assets';out.mkdir(exist_ok=True);(out/'core-source.svg').write_text(svg)
    print(f'Original copper sculpture: {len(polys)} faces, {len(svg)} bytes.')

if __name__=='__main__':build()
