// patch-note-insurance.js
// 將院所頁底部提醒中「語言治療多採自費並需事先預約。」
// 更新為同時說明部分院所可健保、語言治療所多為自費。
// 用法：在網站根目錄執行  node patch-note-insurance.js  （可重複執行）

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const OLD = '就診前請務必先電話或上官網確認；語言治療多採自費並需事先預約。';
const NEW = '就診前請務必先電話或上官網確認。語言治療費用依院所性質而定：醫院或診所復健科符合條件並經醫師開立者可由健保給付，獨立語言治療所則多為自費，且多需事先預約。';

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
  if (txt.includes(OLD)) {
    txt = txt.split(OLD).join(NEW);
    fs.writeFileSync(f, txt, 'utf8');
    changed++;
  } else {
    skipped++;
  }
}
console.log(`✔ 已更新 ${changed} 個院所頁提醒文字，略過 ${skipped} 個。`);
