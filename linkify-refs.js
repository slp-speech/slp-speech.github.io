// linkify-refs.js
// 將文章參考資料中「取自 https://…」的純文字網址，轉成可點擊連結（另開分頁）。
// 用法：在網站根目錄執行  node linkify-refs.js  （可重複執行，不會重複包連結）

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const RE = /取自 (https?:\/\/[^\s<。]+)/g;

function walk(dir, files = []) {
  for (const name of fs.readdirSync(dir)) {
    const p = path.join(dir, name);
    const st = fs.statSync(p);
    if (st.isDirectory()) {
      if (name === 'node_modules' || name.startsWith('.')) continue;
      walk(p, files);
    } else if (name.toLowerCase().endsWith('.html')) {
      files.push(p);
    }
  }
  return files;
}

let changedFiles = 0, links = 0;
for (const f of walk(ROOT)) {
  const txt = fs.readFileSync(f, 'utf8');
  let n = 0;
  const out = txt.replace(RE, (m, url) => {
    n++;
    return `取自 <a href="${url}" target="_blank" rel="noopener" style="color:#55674a;border-bottom:1px solid #b7c4a8;word-break:break-all;">${url}</a>`;
  });
  if (n > 0) {
    fs.writeFileSync(f, out, 'utf8');
    changedFiles++;
    links += n;
  }
}
console.log(`✔ 已在 ${changedFiles} 個檔案中將 ${links} 筆「取自」網址轉為可點擊連結。`);
