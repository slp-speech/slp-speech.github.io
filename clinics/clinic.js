/* 語聲山語 — 院所單頁渲染器（由 clinics-data.js 自動產生內容） */
(function(){
  // Google Tag Manager（與全站一致）
  (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
    var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
    j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-5BRTBQSC');

  var REGION_LABEL={north:"北區",central:"中區",south:"南區",east:"東區"};
  var data=window.CLINIC_DATA||[];
  var id=window.CLINIC_ID;
  var c=data.filter(function(x){return x.id===id;})[0];

  function esc(s){return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");}
  function mapUrl(x){return "https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(x.name+" "+x.address);}
  function telHref(p){return "tel:"+p.replace(/[^0-9+#]/g,"");}

  var logoSvg='<svg viewBox="0 0 32 32" fill="none"><path d="M16 4C16 4 8 12 8 19a8 8 0 0 0 16 0c0-7-8-15-8-15z" fill="#7d8f6f" opacity=".5"/><path d="M16 9c0 0-5 5.5-5 10a5 5 0 0 0 10 0c0-4.5-5-10-5-10z" fill="#55674a"/></svg>';
  var header='<header><div class="nav"><a class="logo" href="../index.html">'+logoSvg+'語聲山語</a><a class="back-link" href="../clinics.html">← 院所總覽</a></div></header>';

  var noscriptGtm='<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-5BRTBQSC" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>';

  if(!c){
    document.body.innerHTML=noscriptGtm+header+'<div class="page-hero"><div class="container"><nav class="crumbs"><a href="../index.html">首頁</a> › <a href="../clinics.html">醫療院所</a> › <span>查無資料</span></nav><h1>找不到這間院所</h1><p class="loc">資料可能已更新，請回到院所總覽重新查詢。</p></div></div><main><div class="container"><div class="actions"><a class="a-back" href="../clinics.html">← 回院所總覽</a></div></div></main>';
    return;
  }

  var regionLabel=REGION_LABEL[c.region]||"";
  var dirUrl="../clinics.html?region="+encodeURIComponent(c.region)+"&city="+encodeURIComponent(c.city)+"&district="+encodeURIComponent(c.district);
  var tagClass=c.dedicated?"slp":"med";
  var tagText=c.dedicated?"語言治療所":"設語言治療服務";

  var icPin='<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>';
  var icTel='<svg viewBox="0 0 24 24"><path d="M5 4h4l2 5-3 2a12 12 0 0 0 5 5l2-3 5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
  var icWeb='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg>';
  var icSvc='<svg viewBox="0 0 24 24"><path d="M7 8h10M7 12h6"/><rect x="3" y="4" width="18" height="13" rx="2"/><path d="M9 21l3-4 3 4"/></svg>';

  var phoneRow=c.phone
    ? '<div class="row"><span class="ic">'+icTel+'</span><div><div class="k">電話</div><div class="v"><a href="'+telHref(c.phone)+'">'+esc(c.phone)+'</a></div></div></div>'
    : '<div class="row"><span class="ic">'+icTel+'</span><div><div class="k">電話</div><div class="v" style="color:#9aa291;">請見官方網站或來電查詢</div></div></div>';
  var webRow=c.url
    ? '<div class="row"><span class="ic">'+icWeb+'</span><div><div class="k">官方網站</div><div class="v"><a href="'+esc(c.url)+'" target="_blank" rel="noopener">'+esc(c.url)+'</a></div></div></div>'
    : '';

  var main='<div class="page-hero"><div class="container">'+
    '<nav class="crumbs"><a href="../index.html">首頁</a> › <a href="../clinics.html">醫療院所</a> › <a href="'+dirUrl+'">'+esc(c.city)+esc(c.district)+'</a> › <span>'+esc(c.name)+'</span></nav>'+
    '<span class="tag '+tagClass+'">'+tagText+'</span>'+
    '<h1>'+esc(c.name)+'</h1>'+
    '<p class="loc">'+esc(regionLabel)+'　|　'+esc(c.city)+esc(c.district)+'</p>'+
    '</div></div>'+
    '<main><div class="container">'+
      '<p class="svc-line"><strong>服務項目：</strong>'+esc(c.services)+'</p>'+
      '<div class="card">'+
        '<div class="row"><span class="ic">'+icPin+'</span><div><div class="k">地址</div><div class="v"><a href="'+mapUrl(c)+'" target="_blank" rel="noopener">'+esc(c.address)+'</a></div><a class="btn-map" href="'+mapUrl(c)+'" target="_blank" rel="noopener">在 Google 地圖開啟導航</a></div></div>'+
        phoneRow+
        webRow+
        '<div class="row"><span class="ic">'+icSvc+'</span><div><div class="k">分類</div><div class="v">'+(c.dedicated?"語言治療所（以語言治療為主要服務）":"設有語言治療服務之醫療院所")+'</div></div></div>'+
      '</div>'+
      '<div class="actions">'+
        '<a class="a-back" href="'+dirUrl+'">← 回'+esc(c.city)+esc(c.district)+'院所</a>'+
        (c.url?'<a class="btn-map" href="'+esc(c.url)+'" target="_blank" rel="noopener" style="margin-top:0;">前往官方網站</a>':'')+
      '</div>'+
      '<div class="note">※ 本頁資訊整理自公開來源，僅供衛教參考，非醫療推薦或背書。院所之地址、電話與服務內容可能異動，就診前請務必先電話或上官網確認；語言治療多採自費並需事先預約。</div>'+
    '</div></main>';

  var footer='<footer><div class="container">© 2026 語聲山語 語言治療衛教平台 · <a href="../clinics.html">醫療院所總覽</a> · <a href="../index.html">回首頁</a></div></footer>';

  document.body.innerHTML=noscriptGtm+header+main+footer;

  // 結構化資料
  var ld={"@context":"https://schema.org","@type":"MedicalClinic","name":c.name,
    "address":{"@type":"PostalAddress","streetAddress":c.address,"addressLocality":c.district,"addressRegion":c.city,"addressCountry":"TW"},
    "medicalSpecialty":"Speech-Language Pathology","url":(c.url||("https://talkingslp.com/clinics/"+c.id+".html"))};
  if(c.phone)ld.telephone=c.phone;
  var bc={"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[
    {"@type":"ListItem","position":1,"name":"首頁","item":"https://talkingslp.com/"},
    {"@type":"ListItem","position":2,"name":"醫療院所","item":"https://talkingslp.com/clinics.html"},
    {"@type":"ListItem","position":3,"name":c.name,"item":"https://talkingslp.com/clinics/"+c.id+".html"}
  ]};
  [ld,bc].forEach(function(o){var s=document.createElement("script");s.type="application/ld+json";s.textContent=JSON.stringify(o);document.head.appendChild(s);});
})();
