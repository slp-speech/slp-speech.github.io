/* 語聲山語 — 分區落地頁清單渲染（讀 window.AREA_REGION，依縣市與行政區分組） */
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
  function mapUrl(c){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(c.name+" "+c.address);}
  function telHref(p){return "tel:"+p.replace(/[^0-9+#]/g,"");}

  var byCity={};
  data.forEach(function(c){(byCity[c.city]=byCity[c.city]||[]).push(c);});
  var cities=Object.keys(byCity).sort(function(a,b){
    var ia=CITY_ORDER.indexOf(a),ib=CITY_ORDER.indexOf(b);
    if(ia!==-1&&ib!==-1)return ia-ib; if(ia!==-1)return -1; if(ib!==-1)return 1;
    return a.localeCompare(b,"zh-Hant");
  });

  // 縣市快速跳轉
  var jump=document.getElementById("jump");
  if(jump)jump.innerHTML=cities.map(function(ci){return '<a href="#c-'+encodeURIComponent(ci)+'">'+esc(ci)+'<span style="opacity:.6;margin-left:4px;">'+byCity[ci].length+'</span></a>';}).join("");

  function cardHtml(c){
    var tagText=c.dedicated?"語言治療所":"設語言治療服務";
    var phone=c.phone?'<div><a href="'+telHref(c.phone)+'">'+esc(c.phone)+'</a></div>':'<div class="muted">電話請見官網或來電查詢</div>';
    var web=c.url?'<div><a href="'+esc(c.url)+'" target="_blank" rel="noopener">官方網站</a></div>':'';
    return '<div class="clinic-card">'+
      '<div class="top"><h3><a href="'+esc(c.id)+'.html">'+esc(c.name)+'</a></h3><span class="tag">'+tagText+'</span></div>'+
      '<div class="svc">'+esc(c.services)+'</div>'+
      '<div class="meta"><div><a href="'+mapUrl(c)+'" target="_blank" rel="noopener">'+esc(c.address)+'</a></div>'+phone+web+'</div>'+
      '<a class="detail" href="'+esc(c.id)+'.html">查看院所詳情 →</a>'+
    '</div>';
  }

  var html=cities.map(function(ci){
    var list=byCity[ci];
    // 依行政區分組
    var byDist={};
    list.forEach(function(c){(byDist[c.district]=byDist[c.district]||[]).push(c);});
    var dists=Object.keys(byDist).sort(function(a,b){return a.localeCompare(b,"zh-Hant");});
    var inner=dists.map(function(d){
      return '<h3 style="font-size:1rem;color:var(--tea-deep);letter-spacing:.05em;margin:18px 0 10px;">'+esc(d)+'（'+byDist[d].length+'）</h3>'+
        '<div class="clinic-list">'+byDist[d].map(cardHtml).join("")+'</div>';
    }).join("");
    var slug=SLUG[ci];
    var head=slug
      ? '<h2><a href="'+slug+'.html" style="border-bottom:1px solid var(--tea-light);">'+esc(ci)+'</a>（'+list.length+' 間）</h2>'
      : '<h2>'+esc(ci)+'（'+list.length+' 間）</h2>';
    return '<section class="dist-block" id="c-'+encodeURIComponent(ci)+'">'+head+inner+'</section>';
  }).join("");
  var areas=document.getElementById("areas");
  if(areas)areas.innerHTML=html;
})();
