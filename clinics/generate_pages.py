#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
語聲山語 — 院所獨立靜態頁產生器
============================================
用途：讀取 clinics-data.js 的院所資料，為「每一間院所」產生一個獨立的
      <id>.html 靜態頁（內容由 clinic.js 依資料渲染，含 SEO 標題/描述/標準網址）。
      同時可選擇更新 ../sitemap.xml 中的院所網址。

使用方式（在本資料夾 clinics/ 下執行）：
    python3 generate_pages.py            # 產生／更新所有院所頁
    python3 generate_pages.py --sitemap  # 另外更新 ../sitemap.xml

新增院所流程：
    1. 在 clinics-data.js 的陣列中新增一筆物件（id 需唯一、英數與連字號）。
    2. 執行本程式，即自動產生該院所的獨立頁面。
"""
import json, re, sys, pathlib

HERE = pathlib.Path(__file__).resolve().parent
DATA = HERE / "clinics-data.js"
SITE = "https://talkingslp.com"
REGION_LABEL = {"north": "北區", "central": "中區", "south": "南區", "east": "東區"}

PAGE_TEMPLATE = """<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<meta name="description" content="{desc}">
<link rel="canonical" href="{site}/clinics/{cid}.html">
<meta property="og:type" content="website">
<meta property="og:title" content="{ogtitle}">
<meta property="og:description" content="{desc}">
<meta property="og:image" content="{site}/og-image.png">
<meta property="og:locale" content="zh_TW">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="clinic.css">
<script>window.CLINIC_ID="{cid}";</script>
</head>
<body>
<script src="clinics-data.js"></script>
<script src="clinic.js"></script>
</body>
</html>
"""


def load_data():
    """寬鬆解析 clinics-data.js：去除註解與結尾分號，將鍵補上引號後以 JSON 讀入。"""
    text = DATA.read_text(encoding="utf-8")
    m = re.search(r"window\.CLINIC_DATA\s*=\s*(\[.*\])\s*;", text, re.S)
    if not m:
        sys.exit("找不到 window.CLINIC_DATA 陣列。")
    body = m.group(1)
    body = re.sub(r"/\*.*?\*/", "", body, flags=re.S)   # 區塊註解
    body = re.sub(r"//[^\n]*", "", body)                 # 行註解
    body = re.sub(r"([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)\s*:", r'\1"\2":', body)  # 鍵補引號
    body = re.sub(r",\s*([}\]])", r"\1", body)           # 去除多餘逗號
    return json.loads(body)


def esc(s):
    return (s or "").replace("&", "&amp;").replace('"', "&quot;")


def build_desc(c):
    region = REGION_LABEL.get(c["region"], "")
    phone = f"電話 {c['phone']}，" if c.get("phone") else "電話請來電或上官網查詢，"
    web = "附官方網站連結。" if c.get("url") else ""
    return (f"{c['name']}位於{c['address']}，提供{c['services']}。{phone}"
            f"地址可開啟 Google 地圖導航。{web}（{region}{c['city']}{c['district']}）")


def main():
    data = load_data()
    ids = set()
    for c in data:
        if c["id"] in ids:
            print(f"⚠ 重複 id：{c['id']}")
        ids.add(c["id"])
        region = REGION_LABEL.get(c["region"], "")
        kind = "語言治療所" if c.get("dedicated") else "語言治療"
        title = f"{c['name']}｜{c['city']}{c['district']}{kind}｜語聲山語"
        ogtitle = f"{c['name']}｜{c['city']}{c['district']}"
        html = PAGE_TEMPLATE.format(
            title=esc(title), ogtitle=esc(ogtitle), desc=esc(build_desc(c)),
            cid=c["id"], site=SITE)
        (HERE / f"{c['id']}.html").write_text(html, encoding="utf-8")
    print(f"✔ 已產生 {len(data)} 個院所頁。")

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
