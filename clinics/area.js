/* 語聲山語 — 縣市落地頁清單渲染（讀 window.AREA_CITY，從 clinics-data.js 自動產生） */
(function(){
  var CITY=window.AREA_CITY;
  var ORDER=window.AREA_DISTRICT_ORDER||[];
  if(!CITY)return;
  function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
  var data=shuffle((window.CLINIC_DATA||[]).filter(function(c){return c.city===CITY;}));
  function esc(s){return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function mapUrl(c){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(c.name+" "+c.address);}
  function telHref(p){return "tel:"+p.replace(/[^0-9+#]/g,"");}

  var groups={};
  data.forEach(function(c){(groups[c.district]=groups[c.district]||[]).push(c);});
  var dists=Object.keys(groups).sort(function(a,b){
    var ia=ORDER.indexOf(a),ib=ORDER.indexOf(b);
    if(ia!==-1&&ib!==-1)return ia-ib; if(ia!==-1)return -1; if(ib!==-1)return 1;
    return a.localeCompare(b,"zh-Hant");
  });

  var jump=document.getElementById("jump");
  if(jump)jump.innerHTML=dists.map(function(d){return '<a href="#d-'+encodeURIComponent(d)+'">'+esc(d)+'<span style="opacity:.6;margin-left:4px;">'+groups[d].length+'</span></a>';}).join("");

  var html=dists.map(function(d){
    var cards=groups[d].map(function(c){
      var tagText=c.dedicated?"語言治療所":"設語言治療服務";
      var phone=c.phone?'<div><a href="'+telHref(c.phone)+'">'+esc(c.phone)+'</a></div>':'<div class="muted">電話請見官網或來電查詢</div>';
      var web=c.url?'<div><a href="'+esc(c.url)+'" target="_blank" rel="noopener">官方網站</a></div>':'';
      return '<div class="clinic-card">'+
        '<div class="top"><h3><a href="'+esc(c.id)+'.html">'+esc(c.name)+'</a></h3><span class="tag">'+tagText+'</span></div>'+
        '<div class="svc">'+esc(c.services)+'</div>'+
        '<div class="meta"><div><a href="'+mapUrl(c)+'" target="_blank" rel="noopener">'+esc(c.address)+'</a></div>'+phone+web+'</div>'+
        '<a class="detail" href="'+esc(c.id)+'.html">查看院所詳情 →</a>'+
      '</div>';
    }).join("");
    return '<section class="dist-block" id="d-'+encodeURIComponent(d)+'"><h2>'+esc(d)+'（'+groups[d].length+' 間）</h2><div class="clinic-list">'+cards+'</div></section>';
  }).join("");
  var areas=document.getElementById("areas");
  if(areas)areas.innerHTML=html;
})();
