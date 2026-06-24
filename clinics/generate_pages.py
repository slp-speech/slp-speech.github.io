#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
語聲山語 — 院所獨立靜態頁產生器（靜態內容版）
============================================
用途：讀取 clinics-data.js，為「每一間院所」產生一個獨立的 <id>.html。
      與舊版不同，本版會把院所內容（麵包屑、地址、電話、官網、服務、結構化資料）
      直接寫進 HTML 原始碼，而非交給 clinic.js 在瀏覽器端渲染——對 SEO（尤其
      醫療＋在地搜尋）更友善。版型沿用 clinic.css，呈現與原本一致。
      頁面仍載入 clinic.js 作漸進增強（若資料更新可即時覆蓋顯示），但即使
      不執行 JS，原始 HTML 也已含完整內容。

使用方式（在 clinics/ 資料夾下執行）：
    python3 generate_pages.py            # 產生／更新所有院所頁
    python3 generate_pages.py --sitemap  # 另外更新 ../sitemap.xml 的院所網址
"""
import json, re, sys, pathlib
from urllib.parse import quote

HERE = pathlib.Path(__file__).resolve().parent
DATA = HERE / "clinics-data.js"
SITE = "https://talkingslp.com"
GTM = "GTM-5BRTBQSC"
REGION_LABEL = {"north": "北區", "central": "中區", "south": "南區", "east": "東區"}

LOGO_SVG = ('<svg viewBox="0 0 32 32" fill="none"><path d="M16 4C16 4 8 12 8 19a8 8 0 0 0 16 0c0-7-8-15-8-15z" '
            'fill="#7d8f6f" opacity=".5"/><path d="M16 9c0 0-5 5.5-5 10a5 5 0 0 0 10 0c0-4.5-5-10-5-10z" fill="#55674a"/></svg>')
IC_PIN = '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>'
IC_TEL = '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>'
IC_WEB = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>'
IC_SVC = '<svg viewBox="0 0 24 24"><path d="M7 8h10M7 12h6"/><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M9 21l3-4 3 4"/></svg>'


def load_data():
    text = DATA.read_text(encoding="utf-8")
    m = re.search(r"window\.CLINIC_DATA\s*=\s*(\[.*\])\s*;", text, re.S)
    if not m:
        sys.exit("找不到 window.CLINIC_DATA 陣列。")
    body = m.group(1)
    body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)
    body = re.sub(r"//[^\n]*", "", body)
    body = re.sub(r"([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', body)
    body = re.sub(r",\s*([}\]])", r"\1", body)
    return json.loads(body)


def esc(s):
    return (s or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def map_url(c):
    return "https://www.google.com/maps/search/?api=1&query=" + quote(c["name"] + " " + c["address"])


def tel_href(p):
    return "tel:" + re.sub(r"[^0-9+#]", "", p)


def build_desc(c):
    region = REGION_LABEL.get(c["region"], "")
    phone = f"電話 {c['phone']}，" if c.get("phone") else "電話請來電或上官網查詢，"
    web = "附官方網站連結。" if c.get("url") else ""
    return (f"{c['name']}位於{c['address']}，提供{c['services']}。{phone}"
            f"地址可開啟 Google 地圖導航。{web}（{region}{c['city']}{c['district']}）")


def render_body(c):
    region = REGION_LABEL.get(c["region"], "")
    dir_url = (f"../clinics.html?region={quote(c['region'])}&city={quote(c['city'])}"
               f"&district={quote(c['district'])}")
    tag_class = "slp" if c.get("dedicated") else "med"
    tag_text = "語言治療所" if c.get("dedicated") else "設語言治療服務"
    murl = map_url(c)

    if c.get("phone"):
        phone_row = (f'<div class="row"><span class="ic">{IC_TEL}</span><div><div class="k">電話</div>'
                     f'<div class="v"><a href="{tel_href(c["phone"])}">{esc(c["phone"])}</a></div></div></div>')
    else:
        phone_row = (f'<div class="row"><span class="ic">{IC_TEL}</span><div><div class="k">電話</div>'
                     f'<div class="v" style="color:#9aa291;">請見官方網站或來電查詢</div></div></div>')
    web_row = ""
    if c.get("url"):
        web_row = (f'<div class="row"><span class="ic">{IC_WEB}</span><div><div class="k">官方網站</div>'
                   f'<div class="v"><a href="{esc(c["url"])}" target="_blank" rel="noopener">{esc(c["url"])}</a></div></div></div>')
    category = ("語言治療所（以語言治療為主要服務）" if c.get("dedicated")
               else "設有語言治療服務之醫療院所")
    go_web = (f'<a class="btn-map" href="{esc(c["url"])}" target="_blank" rel="noopener" style="margin-top:0;">前往官方網站</a>'
              if c.get("url") else "")

    return f"""<noscript><iframe src="https://www.googletagmanager.com/ns.html?id={GTM}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<header><div class="nav"><a class="logo" href="../index.html">{LOGO_SVG}語聲山語</a><a class="back-link" href="../clinics.html">← 院所總覽</a></div></header>
<div class="page-hero"><div class="container">
<nav class="crumbs"><a href="../index.html">首頁</a> › <a href="../clinics.html">醫療院所</a> › <a href="{dir_url}">{esc(c['city'])}{esc(c['district'])}</a> › <span>{esc(c['name'])}</span></nav>
<span class="tag {tag_class}">{tag_text}</span>
<h1>{esc(c['name'])}</h1>
<p class="loc">{esc(region)}　|　{esc(c['city'])}{esc(c['district'])}</p>
</div></div>
<main><div class="container">
<p class="svc-line"><strong>服務項目：</strong>{esc(c['services'])}</p>
<div class="card">
<div class="row"><span class="ic">{IC_PIN}</span><div><div class="k">地址</div><div class="v"><a href="{murl}" target="_blank" rel="noopener">{esc(c['address'])}</a></div><a class="btn-map" href="{murl}" target="_blank" rel="noopener">在 Google 地圖開啟導航</a></div></div>
{phone_row}
{web_row}
<div class="row"><span class="ic">{IC_SVC}</span><div><div class="k">分類</div><div class="v">{category}</div></div></div>
</div>
<div class="actions"><a class="a-back" href="{dir_url}">← 回{esc(c['city'])}{esc(c['district'])}院所</a>{go_web}</div>
<div class="note">※ 本頁資訊整理自公開來源，僅供衛教參考，非醫療推薦或背書。院所之地址、電話與服務內容可能異動，就診前請務必先電話或上官網確認；語言治療多採自費並需事先預約。</div>
</div></main>
<footer><div class="container">© 2026 語聲山語 語言治療衛教平台 · <a href="../clinics.html">醫療院所總覽</a> · <a href="../index.html">回首頁</a></div></footer>"""


def render_jsonld(c):
    ld = {"@context": "https://schema.org", "@type": "MedicalClinic", "name": c["name"],
          "address": {"@type": "PostalAddress", "streetAddress": c["address"],
                      "addressLocality": c["district"], "addressRegion": c["city"], "addressCountry": "TW"},
          "medicalSpecialty": "Speech-Language Pathology",
          "url": c.get("url") or f"{SITE}/clinics/{c['id']}.html"}
    if c.get("phone"):
        ld["telephone"] = c["phone"]
    bc = {"@context": "https://schema.org", "@type": "BreadcrumbList", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "首頁", "item": f"{SITE}/"},
        {"@type": "ListItem", "position": 2, "name": "醫療院所", "item": f"{SITE}/clinics.html"},
        {"@type": "ListItem", "position": 3, "name": c["name"], "item": f"{SITE}/clinics/{c['id']}.html"},
    ]}
    return (f'<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False)}</script>\n'
            f'<script type="application/ld+json">{json.dumps(bc, ensure_ascii=False)}</script>')


def page_html(c):
    region = REGION_LABEL.get(c["region"], "")
    kind = "語言治療所" if c.get("dedicated") else "語言治療"
    title = f"{c['name']}｜{c['city']}{c['district']}{kind}｜語聲山語"
    ogtitle = f"{c['name']}｜{c['city']}{c['district']}"
    desc = build_desc(c)
    gtm_head = ("<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});"
                "var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;"
                "j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})"
                "(window,document,'script','dataLayer','%s');</script>" % GTM)
    return f"""<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
{gtm_head}
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{SITE}/clinics/{c['id']}.html">
<meta property="og:type" content="website">
<meta property="og:title" content="{esc(ogtitle)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{SITE}/og-image.png">
<meta property="og:locale" content="zh_TW">
{render_jsonld(c)}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="clinic.css">
<script>window.CLINIC_ID="{c['id']}";</script>
</head>
<body>
{render_body(c)}
<script src="clinics-data.js"></script>
<script src="clinic.js"></script>
</body>
</html>
"""


def main():
    data = load_data()
    ids = set()
    for c in data:
        if c["id"] in ids:
            print(f"⚠ 重複 id：{c['id']}")
        ids.add(c["id"])
        (HERE / f"{c['id']}.html").write_text(page_html(c), encoding="utf-8")
    print(f"✔ 已產生 {len(data)} 個院所靜態頁。")

    if "--sitemap" in sys.argv:
        sm = HERE.parent / "sitemap.xml"
        xml = sm.read_text(encoding="utf-8")
        xml = re.sub(r"\s*<url><loc>%s/clinics/.*?</url>" % re.escape(SITE), "", xml, flags=re.S)
        block = "".join(
            f"\n  <url><loc>{SITE}/clinics/{c['id']}.html</loc><priority>0.6</priority></url>"
            for c in data)
        xml = xml.replace("</urlset>", block + "\n</urlset>")
        sm.write_text(xml, encoding="utf-8")
        print("✔ 已更新 sitemap.xml。")


if __name__ == "__main__":
    main()
