// add-footer-email.js
// 一次性將聯絡信箱 talkingslptw@gmail.com 加入全站所有頁面的頁尾。
// 用法：在網站根目錄執行  node add-footer-email.js
// 可重複執行（已加過的頁面會自動略過）。

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const EMAIL = 'talkingslptw@gmail.com';
const NEEDLE = '語言治療衛教平台 · <a href=';
const REPL = `語言治療衛教平台 · <a href="mailto:${EMAIL}">${EMAIL}</a> · <a href=`;

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

let changed = 0, skipped = 0;
for (const f of walk(ROOT)) {
  let txt = fs.readFileSync(f, 'utf8');
  if (txt.includes(`mailto:${EMAIL}`)) { skipped++; continue; }      // 已含信箱
  if (txt.includes(NEEDLE)) {
    txt = txt.replace(NEEDLE, REPL);                                  // 只替換頁尾那一處
    fs.writeFileSync(f, txt, 'utf8');
    changed++;
  } else {
    skipped++;                                                        // 非標準頁尾（如 index.html、404.html）
  }
}
console.log(`✔ 已更新 ${changed} 個頁面頁尾，略過 ${skipped} 個（已含信箱或無標準頁尾）。`);
