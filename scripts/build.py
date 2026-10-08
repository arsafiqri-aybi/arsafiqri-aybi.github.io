#!/usr/bin/env python3
"""Generate static pages from the reviewed content model. Python standard library only."""
import json
from html import escape as e
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PROJECTS = json.loads((ROOT / 'content/projects.json').read_text())
ORIGIN = 'https://arsafiqri-aybi.github.io'

def head(title, description, path='', prefix='./'):
    return f'''<!doctype html>
<html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#141412"><title>{e(title)}</title><meta name="description" content="{e(description)}">
<meta property="og:title" content="{e(title)}"><meta property="og:description" content="{e(description)}"><meta property="og:type" content="website"><meta property="og:url" content="{ORIGIN}/{path}"><meta property="og:image" content="{ORIGIN}/social.svg">
<link rel="canonical" href="{ORIGIN}/{path}"><link rel="icon" href="{prefix}favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="{prefix}fonts.css"><link rel="stylesheet" href="{prefix}styles.css"><script defer src="{prefix}app.js"></script></head>'''

def header(prefix='./', home=False):
    return f'''<a class="skip" href="#main">Lewati ke konten</a><header class="site-header"><a class="wordmark" href="{prefix}" aria-label="Ars, beranda">ars<span class="brand-dot" aria-hidden="true">®</span></a><span class="header-note">INDEPENDENT BUILDER<br>AI SYSTEMS · DESIGN · MOTION</span><nav aria-label="Navigasi utama"><a href="{'' if home else prefix}#karya">Karya<span aria-hidden="true"> ↗</span></a><a href="{'' if home else prefix}#tentang">Tentang</a><a class="nav-contact" href="{'' if home else prefix}#kontak">Mari bicara<span aria-hidden="true"> ↗</span></a></nav></header>'''

def footer(prefix='./'):
    return f'''<footer class="site-footer"><a class="wordmark" href="{prefix}" aria-label="Ars, beranda">ars<span aria-hidden="true">.</span></a><span>© 2026 Arsafiqri Ummati Aybi</span><a href="https://github.com/arsafiqri-aybi">GitHub ↗</a><a href="https://www.instagram.com/arsafiqri_ua/">Instagram ↗</a><a href="#main">Kembali ke atas ↑</a></footer>'''

def contact():
    return '''<section class="contact-section" id="kontak"><div class="section-top"><span class="eyebrow">04 / NEXT CHAPTER</span><span>Mulai dari satu percakapan.</span></div><h2>Punya ide?<br><em>Mari bangun.</em></h2><div class="contact-bottom"><p>Sistem AI, pengalaman web, atau sesuatu yang belum punya nama. Aku ingin mendengarnya.</p><a class="contact-link" href="https://www.instagram.com/arsafiqri_ua/">Ngobrol di Instagram <span aria-hidden="true">↗</span></a></div></section>'''

def art(kind, prefix='./'):
    if kind == 'hey':
        return '''<div class="hey-art" aria-hidden="true"><div class="orbit-line"></div><span class="art-corner">PERSONAL BROWSER<br>BY ARS</span><div class="phone-object"><span class="phone-speaker"></span><div class="phone-copy">hey<span>.</span></div><span class="phone-caption">Satu ruang.<br>Kendali kamu.</span><span class="phone-symbol" aria-hidden="true">↗</span></div><span class="art-bottom">HUMAN + AGENT</span></div>'''
    if kind == 'system':
        return f'''<div class="system-art" aria-hidden="true"><span class="art-corner">STRUCTURE MEETS<br>ADAPTATION</span><img src="{prefix}assets/core.svg" alt="" width="760" height="720" loading="lazy"><span class="art-bottom">SCALE / GOVERNOR</span></div>'''
    if kind == 'motion':
        return '''<div class="motion-art" aria-hidden="true"><span class="art-corner">FORM × TIME<br>CODE-DRIVEN MOTION</span><div class="motion-ribbon ribbon-a"></div><div class="motion-ribbon ribbon-b"></div><div class="motion-ribbon ribbon-c"></div><span class="motion-label">motion<span>.</span></span><span class="art-bottom">A STUDY IN CONTINUITY</span></div>'''
    if kind == 'skill':
        return '''<div class="skill-art" aria-hidden="true"><span class="art-corner">NEED → CAPABILITY<br>REUSABLE BY DESIGN</span><div class="skill-layer layer-one"><span>TRIGGER</span></div><div class="skill-layer layer-two"><span>CONTEXT</span></div><div class="skill-layer layer-three"><span>SKILL</span><i aria-hidden="true">↗</i></div><span class="art-bottom">BUILD. VERIFY. EVOLVE.</span></div>'''
    if kind == 'copy':
        return '''<div class="copy-art" aria-hidden="true"><span class="art-corner">CONTEXT BEFORE COPY<br>EVIDENCE BEFORE CLAIM</span><div class="copy-sheet"><span class="copy-overline">THE MESSAGE IS</span><strong>clear<span>.</span></strong><div class="copy-rules"><i></i><i></i><i></i></div><span class="copy-seal">WORDS<br>WITH<br>REASON</span></div><span class="art-bottom">COPYWRITING INTELLIGENCE</span></div>'''
    return '''<div class="web-art" aria-hidden="true"><span class="art-corner">DESIGN + ENGINEERING<br>ONE EXPERIENCE</span><div class="browser-object"><div class="browser-bar"><i></i><i></i><i></i><span>THE EXPERIENCE</span></div><div class="browser-content"><span>MAKE IT</span><strong>matter<span>.</span></strong><div class="browser-circle"></div><span class="browser-line"></span></div></div><span class="art-bottom">PURPOSE, MADE VISIBLE.</span></div>'''

def home():
    panels = []
    choices = []
    fallback = []
    for n, p in enumerate(PROJECTS, 1):
        choices.append(f'''<button class="work-choice" type="button" data-project="{p['id']}" aria-pressed="{'true' if n == 1 else 'false'}" aria-controls="preview-{p['id']}"><span class="choice-index">0{n}</span><span class="choice-name">{e(p['short'])}<small>{e(p['category'])}</small></span><span class="choice-arrow" aria-hidden="true">↗</span></button>''')
        panels.append(f'''<article class="work-panel" id="preview-{p['id']}" data-id="{p['id']}" {'data-active' if n == 1 else ''}><div class="project-art tone-{p['tone']}">{art(p['visual'])}<a class="art-open" href="./work/{p['id']}/" aria-label="Buka proyek {e(p['name'])}"><span aria-hidden="true">↗</span></a></div><div class="preview-meta"><div><span class="eyebrow">{e(p['status'])}</span><h3 class="project-title"><a href="./work/{p['id']}/">{e(p['name'])}</a></h3><p>{e(p['summary'])}</p></div><a class="round-link" href="./work/{p['id']}/" aria-label="Buka proyek {e(p['name'])}"><span aria-hidden="true">↗</span></a></div><span class="visual-caption">Interpretasi visual proyek · ilustrasi original</span></article>''')
        fallback.append(f'<li><a href="./work/{p["id"]}/">{e(p["name"])} <span aria-hidden="true">↗</span></a></li>')
    return head('Ars — AI systems, design & motion', 'Arsafiqri Ummati Aybi. Aku merancang sistem AI dan pengalaman digital, dari ide sampai hal yang bisa digunakan.') + f'''<body>{header(home=True)}
<main id="main"><section class="hero" aria-labelledby="hero-title"><div class="hero-top"><span class="eyebrow"><span class="tiny-star" aria-hidden="true">✳</span> ARSAFIQRI UMMATI AYBI</span><span class="hero-coordinate">LOGIC × FEELING</span></div><div class="hero-layout"><div class="hero-copy"><h1 id="hero-title">Dari ide.<br><em>Jadi nyata.</em></h1><p>Aku Ars. Aku merancang sistem AI<br class="desktop-break"> dan pengalaman digital—<br class="desktop-break">dengan logika, desain, dan motion.</p><a class="text-link" href="#karya">Jelajahi karya <span aria-hidden="true">↘</span></a></div><div class="hero-object" aria-hidden="true"><div class="object-halo"></div><img class="core-object" src="./assets/core.svg" alt="" width="760" height="720" fetchpriority="high"><span class="object-label label-a">01 — STRUCTURE</span><span class="object-label label-b">02 — INTERACTION</span><span class="object-label label-c">03 — EXPRESSION</span><span class="object-cross cross-a">+</span><span class="object-cross cross-b">+</span></div></div><div class="hero-bottom"><span>AI SYSTEMS & DIGITAL CRAFT</span><span>IDE → SISTEM → PENGALAMAN</span><a href="#karya" aria-label="Gulir ke karya"><span aria-hidden="true">↓</span></a></div></section>
<section class="work-section" id="karya" aria-labelledby="work-title"><div class="section-top"><span class="eyebrow">01 / SELECTED WORK</span><span>Enam karya. Satu benang merah.</span></div><div class="work-heading"><h2 id="work-title">Pemikiran.<br><em>Dalam bentuk.</em></h2><p>Dari cara AI bekerja sampai cara manusia berinteraksi. Pilih satu, lalu masuk lebih dalam.</p></div><div class="showroom"><div class="preview-stage">{''.join(panels)}</div><aside class="work-navigation" aria-label="Pilih preview karya"><div class="selector-heading"><span class="eyebrow">EXPLORE</span><span class="selector-count" aria-hidden="true">01 / 06</span></div><div class="selector-scroll">{''.join(choices)}</div><div class="selector-bottom"><span>Gulir untuk karya lainnya</span><div><button type="button" class="selector-step" data-step="-1" aria-label="Preview karya sebelumnya">↑</button><button type="button" class="selector-step" data-step="1" aria-label="Preview karya berikutnya">↓</button></div></div></aside></div><noscript><ul class="static-work-index">{''.join(fallback)}</ul></noscript></section>
<section class="capability-section" id="pendekatan" aria-labelledby="capability-title"><div class="section-top"><span class="eyebrow">02 / THE APPROACH</span><span>Satu gagasan, sampai utuh.</span></div><h2 id="capability-title">Logika memberi arah.<br><em>Desain memberi rasa.</em></h2><div class="capability-body"><div class="capability-statement"><span class="large-star" aria-hidden="true">✳</span><p>Aku tertarik pada pertemuan antara sistem yang bisa diperiksa dan pengalaman yang mudah dipahami.</p></div><div class="capability-rows"><div class="capability-row" data-reveal><span>01</span><div><h3>Merancang sistem</h3><p>Mengurai kebutuhan, menghubungkan langkah, dan menetapkan hasil yang perlu dibuktikan.</p></div><span aria-hidden="true">↗</span></div><div class="capability-row" data-reveal><span>02</span><div><h3>Membangun interaksi</h3><p>Menyatukan kemampuan AI, browser, dan antarmuka dengan kendali yang jelas.</p></div><span aria-hidden="true">↗</span></div><div class="capability-row" data-reveal><span>03</span><div><h3>Membentuk pengalaman</h3><p>Menggunakan komposisi, bahasa, dan gerak untuk membuat informasi lebih mudah dijelajahi.</p></div><span aria-hidden="true">↗</span></div></div></div></section>
<section class="about-section" id="tentang" aria-labelledby="about-title"><div class="section-top"><span class="eyebrow">03 / THE PERSON</span><span>Di balik sistem.</span></div><div class="about-layout"><div class="about-mark" aria-hidden="true">a<span>r</span>s<span class="about-star">✳</span></div><div class="about-copy"><h2 id="about-title">Aku Ars.<br><em>Selalu penasaran.</em></h2><p>Aku membangun proyek pribadi dengan bantuan AI, dari arsitektur skill dan operator browser sampai pengetahuan desain serta motion.</p><p>Yang menarik buatku adalah membuat bagian-bagian itu saling terhubung: ide punya arah, sistem punya batas, dan hasilnya bisa digunakan orang.</p><div class="about-principle"><span class="eyebrow">CARA KERJAKU</span><p>Mulai dari kebutuhan. Bangun secukupnya. Periksa hasilnya. Perbaiki yang belum bekerja.</p></div><a class="text-link" href="https://github.com/arsafiqri-aybi">Lihat jejak proses di GitHub <span aria-hidden="true">↗</span></a></div></div></section>
{contact()}</main>{footer()}</body></html>'''

def case(p, n):
    prefix = '../../'
    nxt = PROJECTS[(n+1) % len(PROJECTS)]
    sources = ''.join(f'<a href="{e(l["url"])}">{e(l["label"])} <span aria-hidden="true">↗</span></a>' for l in p['links'])
    contribution = ''.join(f'<li>{e(c)}</li>' for c in p['contribution'])
    return head(f'{p["name"]} — Ars', p['summary'], f'work/{p["id"]}/', prefix) + f'''<body class="case-page" data-case="{p['id']}">{header(prefix)}<main id="main"><section class="case-hero"><a class="back-link" href="../../#karya">← Semua karya</a><div class="case-heading"><div><span class="eyebrow">0{n+1} / {e(p['category'])}</span><h1 class="project-title">{e(p['name'])}</h1></div><span class="case-status">{e(p['status'])}<br>{p['year']}</span></div><p class="case-tagline">{e(p['headline'])}</p><div class="case-art project-art tone-{p['tone']}">{art(p['visual'], prefix)}</div><p class="visual-caption">Interpretasi visual proyek · ilustrasi original, bukan screenshot aplikasi.</p></section>
<section class="case-overview"><span class="eyebrow">OVERVIEW</span><div><h2>{e(p['headline'])}</h2><p>{e(p['intro'])}</p><div class="project-facts"><div><span class="eyebrow">PERANKU</span><p>{e(p['role'])}</p></div><div><span class="eyebrow">TAHUN / STATUS</span><p>{p['year']}<br>{e(p['status'])}</p></div></div></div></section>
<section class="case-narrative"><div class="narrative-row" data-reveal><span class="eyebrow">01 / KEBUTUHAN</span><div><h2>Masalah yang ingin dijawab.</h2><p>{e(p['problem'])}</p></div></div><div class="narrative-row" data-reveal><span class="eyebrow">02 / KEPUTUSAN</span><div><h2>Arah yang dipilih.</h2><p>{e(p['decision'])}</p></div></div><div class="narrative-row" data-reveal><span class="eyebrow">03 / KONTRIBUSI</span><div><h2>Bagian yang kubangun.</h2><ul class="contribution-list">{contribution}</ul></div></div><div class="narrative-row" data-reveal><span class="eyebrow">04 / HASIL</span><div><h2>Yang bisa diperiksa.</h2><p>{e(p['result'])}</p><div class="source-links">{sources}</div><div class="project-limits"><h3>Status & langkah berikutnya</h3><p>{e(p['limitation'])}</p></div></div></div></section>
<section class="next-project"><span class="eyebrow">NEXT PROJECT / 0{(n+1)%6+1}</span><a href="../{nxt['id']}/">{e(nxt['name'])}<span aria-hidden="true">↗</span></a></section>{contact()}</main>{footer(prefix)}</body></html>'''

def build():
    (ROOT/'index.html').write_text(home())
    for n,p in enumerate(PROJECTS):
        folder = ROOT/'work'/p['id']; folder.mkdir(parents=True,exist_ok=True)
        (folder/'index.html').write_text(case(p,n))
    (ROOT/'404.html').write_text(head('Halaman tidak ditemukan — Ars','Kembali jelajahi karya Ars.','404.html','/') + '<body>'+header('/')+'<main id="main" class="not-found"><span class="eyebrow">404 / LOST IN SPACE</span><h1>Belum ada<br><em>di sini.</em></h1><p>Halaman ini tidak ditemukan. Karya-karyaku ada di beranda.</p><a class="text-link" href="/">Kembali ke beranda ↗</a></main>'+footer('/')+'</body></html>')
    urls = ['']+[f'work/{p["id"]}/' for p in PROJECTS]
    (ROOT/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+''.join(f'<url><loc>{ORIGIN}/{u}</loc></url>' for u in urls)+'</urlset>')
    (ROOT/'robots.txt').write_text(f'User-agent: *\nAllow: /\nDisallow: /docs/\nDisallow: /content/\nDisallow: /scripts/\nSitemap: {ORIGIN}/sitemap.xml\n')
    print('Built homepage, six case studies, 404, sitemap and robots.')

if __name__ == '__main__':
    build()
