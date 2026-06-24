/* 語聲山語 — 院所獨立靜態頁產生器（Node 版，靜態內容）
 * 用途：讀 clinics-data.js，為每間院所產生內容已寫入 HTML 的 <id>.html，對 SEO 友善。
 * 執行（在 clinics/ 資料夾下）：
 *   node generate_pages.js            產生／更新所有院所頁
 *   node generate_pages.js --sitemap  另外更新 ../sitemap.xml 的院所網址
 */
const fs = require('fs');
const path = require('path');

const HERE = __dirname;
const SITE = 'https://talkingslp.com';
const GTM = 'GTM-5BRTBQSC';
const REGION_LABEL = { north: '北區', central: '中區', south: '南區', east: '東區' };

const LOGO_SVG = '<svg viewBox="0 0 32 32" fill="none"><path d="M16 4C16 4 8 12 8 19a8 8 0 0 0 16 0c0-7-8-15-8-15z" fill="#7d8f6f" opacity=".5"/><path d="M16 9c0 0-5 5.5-5 10a5 5 0 0 0 10 0c0-4.5-5-10-5-10z" fill="#55674a"/></svg>';
const IC_PIN = '<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
const IC_TEL = '<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
const IC_WEB = '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>';
const IC_SVC = '<svg viewBox="0 0 24 24"><path d="M7 8h10M7 12h6"/><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M9 21l3-4 3 4"/></svg>';

function loadData() {
  const txt = fs.readFileSync(path.join(HERE, 'clinics-data.js'), 'utf8');
  const sandbox = { window: {} };
  // clinics-data.js 內容為 window.CLINIC_DATA = [...]
  new Function('window', txt)(sandbox.window);
  return sandbox.window.CLINIC_DATA || [];
}

function esc(s) {
  return (s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function mapUrl(c) { return 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(c.name + ' ' + c.address); }
function telHref(p) { return 'tel:' + p.replace(/[^0-9+#]/g, ''); }

function buildDesc(c) {
  const region = REGION_LABEL[c.region] || '';
  const phone = c.phone ? `電話 ${c.phone}，` : '電話請來電或上官網查詢，';
  const web = c.url ? '附官方網站連結。' : '';
  return `${c.name}位於${c.address}，提供${c.services}。${phone}地址可開啟 Google 地圖導航。${web}（${region}${c.city}${c.district}）`;
}

function renderBody(c) {
  const region = REGION_LABEL[c.region] || '';
  const dirUrl = `../clinics.html?region=${encodeURIComponent(c.region)}&city=${encodeURIComponent(c.city)}&district=${encodeURIComponent(c.district)}`;
  const tagClass = c.dedicated ? 'slp' : 'med';
  const tagText = c.dedicated ? '語言治療所' : '設語言治療服務';
  const murl = mapUrl(c);
  const phoneRow = c.phone
    ? `<div class="row"><span class="ic">${IC_TEL}</span><div><div class="k">電話</div><div class="v"><a href="${telHref(c.phone)}">${esc(c.phone)}</a></div></div></div>`
    : `<div class="row"><span class="ic">${IC_TEL}</span><div><div class="k">電話</div><div class="v" style="color:#9aa291;">請見官方網站或來電查詢</div></div></div>`;
  const webRow = c.url
    ? `<div class="row"><span class="ic">${IC_WEB}</span><div><div class="k">官方網站</div><div class="v"><a href="${esc(c.url)}" target="_blank" rel="noopener">${esc(c.url)}</a></div></div></div>`
    : '';
  const category = c.dedicated ? '語言治療所（以語言治療為主要服務）' : '設有語言治療服務之醫療院所';
  const goWeb = c.url ? `<a class="btn-map" href="${esc(c.url)}" target="_blank" rel="noopener" style="margin-top:0;">前往官方網站</a>` : '';

  return `<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${GTM}" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<header><div class="nav"><a class="logo" href="../index.html">${LOGO_SVG}語聲山語</a><a class="back-link" href="../clinics.html">← 院所總覽</a></div></header>
<div class="page-hero"><div class="container">
<nav class="crumbs"><a href="../index.html">首頁</a> › <a href="../clinics.html">醫療院所</a> › <a href="${dirUrl}">${esc(c.city)}${esc(c.district)}</a> › <span>${esc(c.name)}</span></nav>
<span class="tag ${tagClass}">${tagText}</span>
<h1>${esc(c.name)}</h1>
<p class="loc">${esc(region)}　|　${esc(c.city)}${esc(c.district)}</p>
</div></div>
<main><div class="container">
<p class="svc-line"><strong>服務項目：</strong>${esc(c.services)}</p>
<div class="card">
<div class="row"><span class="ic">${IC_PIN}</span><div><div class="k">地址</div><div class="v"><a href="${murl}" target="_blank" rel="noopener">${esc(c.address)}</a></div><a class="btn-map" href="${murl}" target="_blank" rel="noopener">在 Google 地圖開啟導航</a></div></div>
${phoneRow}
${webRow}
<div class="row"><span class="ic">${IC_SVC}</span><div><div class="k">分類</div><div class="v">${category}</div></div></div>
</div>
<div class="actions"><a class="a-back" href="${dirUrl}">← 回${esc(c.city)}${esc(c.district)}院所</a>${goWeb}</div>
<div class="note">※ 本頁資訊整理自公開來源，僅供衛教參考，非醫療推薦或背書。院所之地址、電話與服務內容可能異動，就診前請務必先電話或上官網確認；語言治療多採自費並需事先預約。</div>
</div></main>
<footer><div class="container">© 2026 語聲山語 語言治療衛教平台 · <a href="mailto:talkingslptw@gmail.com">talkingslptw@gmail.com</a> · <a href="../clinics.html">醫療院所總覽</a> · <a href="../index.html">回首頁</a></div></footer>`;
}

function renderJsonld(c) {
  const ld = {
    '@context': 'https://schema.org', '@type': 'MedicalClinic', name: c.name,
    address: { '@type': 'PostalAddress', streetAddress: c.address, addressLocality: c.district, addressRegion: c.city, addressCountry: 'TW' },
    medicalSpecialty: 'Speech-Language Pathology', url: c.url || `${SITE}/clinics/${c.id}.html`
  };
  if (c.phone) ld.telephone = c.phone;
  const bc = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: '首頁', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name: '醫療院所', item: `${SITE}/clinics.html` },
      { '@type': 'ListItem', position: 3, name: c.name, item: `${SITE}/clinics/${c.id}.html` }
    ]
  };
  return `<script type="application/ld+json">${JSON.stringify(ld)}</script>\n<script type="application/ld+json">${JSON.stringify(bc)}</script>`;
}

function pageHtml(c) {
  const kind = c.dedicated ? '語言治療所' : '語言治療';
  const title = `${c.name}｜${c.city}${c.district}${kind}｜語聲山語`;
  const ogtitle = `${c.name}｜${c.city}${c.district}`;
  const desc = buildDesc(c);
  const gtmHead = `<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${GTM}');</script>`;
  return `<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
${gtmHead}
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${SITE}/clinics/${c.id}.html">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(ogtitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/og-image.png">
<meta property="og:locale" content="zh_TW">
${renderJsonld(c)}
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@400;500;600;700&family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="clinic.css">
<script>window.CLINIC_ID="${c.id}";</script>
</head>
<body>
${renderBody(c)}
<script src="clinics-data.js"></script>
<script src="clinic.js"></script>
</body>
</html>
`;
}

function main() {
  const data = loadData();
  const ids = new Set();
  let dup = 0;
  for (const c of data) {
    if (ids.has(c.id)) { console.log('⚠ 重複 id：' + c.id); dup++; }
    ids.add(c.id);
    fs.writeFileSync(path.join(HERE, c.id + '.html'), pageHtml(c), 'utf8');
  }
  console.log(`✔ 已產生 ${data.length} 個院所靜態頁（重複 id：${dup}）`);

  if (process.argv.includes('--sitemap')) {
    const sm = path.join(HERE, '..', 'sitemap.xml');
    const DATE = new Date().toISOString().slice(0, 10);
    let xml = fs.readFileSync(sm, 'utf8');
    xml = xml.replace(new RegExp('\\s*<url><loc>' + SITE.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/clinics/[^<]*?\\.html</loc><priority>0\\.6</priority>(?:<lastmod>[^<]*</lastmod>)?</url>', 'g'), '');
    const block = data.map(c => `\n  <url><loc>${SITE}/clinics/${c.id}.html</loc><priority>0.6</priority><lastmod>${DATE}</lastmod></url>`).join('');
    xml = xml.replace('</urlset>', block + '\n</urlset>');
    fs.writeFileSync(sm, xml, 'utf8');
    console.log('✔ 已更新 sitemap.xml（含 lastmod）');
  }
}

main();
