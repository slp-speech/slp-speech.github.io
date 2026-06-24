/* 為 sitemap.xml 內每個 <url> 補上 <lastmod>（若尚無）。冪等：已有 lastmod 的不動。
 * 執行：node add-lastmod.js            使用今天日期
 *       node add-lastmod.js 2026-06-20 指定日期
 */
const fs = require('fs');
const path = require('path');
const DATE = process.argv[2] || new Date().toISOString().slice(0, 10);
const sm = path.join(__dirname, '..', 'sitemap.xml');
let xml = fs.readFileSync(sm, 'utf8');
let added = 0;
xml = xml.replace(/<url>[\s\S]*?<\/url>/g, function (block) {
  if (/<lastmod>/.test(block)) return block;
  added++;
  return block.replace('</url>', `<lastmod>${DATE}</lastmod></url>`);
});
fs.writeFileSync(sm, xml, 'utf8');
console.log(`✔ 已為 ${added} 個網址補上 <lastmod>${DATE}</lastmod>`);
