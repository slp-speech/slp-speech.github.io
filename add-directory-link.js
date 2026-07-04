// add-directory-link.js
// 在每篇「還沒連到院所目錄」的文章「延伸閱讀」區最前面，加入一條連到 clinics.html 的連結。
// 目的：把內部連結權重導向會排名的院所目錄，強化主題群。
// 用法：在網站根目錄執行  node add-directory-link.js  （已含連結者自動略過，可重複執行）

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'articles');
const NEEDLE = '<h2>延伸閱讀</h2>';
const LINK = '\n      <a href="../clinics.html">找語言治療？查詢各縣市語言治療所與醫院（依縣市／行政區）</a>';

let changed = 0, skipped = 0;
for (const name of fs.readdirSync(DIR)) {
  if (!name.toLowerCase().endsWith('.html')) continue;
  const p = path.join(DIR, name);
  let txt = fs.readFileSync(p, 'utf8');
  if (txt.includes('clinics.html')) { skipped++; continue; }   // 已連到目錄
  if (txt.includes(NEEDLE)) {
    txt = txt.replace(NEEDLE, NEEDLE + LINK);
    fs.writeFileSync(p, txt, 'utf8');
    changed++;
  } else {
    skipped++;
  }
}
console.log(`✔ 已在 ${changed} 篇文章加入院所目錄連結，略過 ${skipped} 篇（已含連結或無延伸閱讀）。`);
