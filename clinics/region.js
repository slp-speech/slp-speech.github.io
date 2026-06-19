/* 語聲山語 — 分區落地頁渲染：列出該區各縣市卡片，點擊進入該縣市專頁 */
(function(){
  var REGION=window.AREA_REGION;
  var CITY_ORDER=window.AREA_CITY_ORDER||[];
  if(!REGION)return;
  var SLUG={ "臺北市":"taipei","新北市":"newtaipei","桃園市":"taoyuan","新竹市":"hsinchu-city",
    "新竹縣":"hsinchu-county","基隆市":"keelung","臺中市":"taichung","苗栗縣":"miaoli",
    "彰化縣":"changhua","南投縣":"nantou","雲林縣":"yunlin","臺南市":"tainan","高雄市":"kaohsiung",
    "嘉義市":"chiayi-city","嘉義縣":"chiayi-county","屏東縣":"pingtung","澎湖縣":"penghu",
    "金門縣":"kinmen","宜蘭縣":"yilan","花蓮縣":"hualien","臺東縣":"taitung" };
  var data=(window.CLINIC_DATA||[]).filter(function(c){return c.region===REGION;});
  function esc(s){return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}

  var byCity={};
  data.forEach(function(c){(byCity[c.city]=byCity[c.city]||[]).push(c);});
  var cities=Object.keys(byCity).sort(function(a,b){
    var ia=CITY_ORDER.indexOf(a),ib=CITY_ORDER.indexOf(b);
    if(ia!==-1&&ib!==-1)return ia-ib; if(ia!==-1)return -1; if(ib!==-1)return 1;
    return a.localeCompare(b,"zh-Hant");
  });

  var cards=cities.map(function(ci){
    var list=byCity[ci];
    // 行政區清單（去重，保留資料順序）
    var seen={},dists=[];
    list.forEach(function(c){if(!seen[c.district]){seen[c.district]=1;dists.push(c.district);}});
    var slug=SLUG[ci];
    var distText=dists.join("、");
    var inner=
      '<div class="cc-name">'+esc(ci)+'<span class="cc-count">'+list.length+' 間</span></div>'+
      '<div class="cc-dist">'+esc(distText)+'</div>'+
      '<div class="cc-go">查看 '+esc(ci)+' 語言治療所與醫院 →</div>';
    return slug
      ? '<a class="city-link-card" href="'+slug+'.html">'+inner+'</a>'
      : '<div class="city-link-card">'+inner+'</div>';
  }).join("");

  var areas=document.getElementById("areas");
  if(areas)areas.innerHTML='<div class="city-grid">'+cards+'</div>';
})();
