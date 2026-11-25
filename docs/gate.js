
/* ประตูเข้าแอป · ถอดรหัสเนื้อหาจริง ไม่ใช่แค่ซ่อนกล่อง

   🔴 รุ่นเดิมเพียงลบกล่องรหัสทิ้ง (g.remove()) และวางไฟล์เฉลยเป็นข้อความธรรมดา
      ใครพิมพ์ที่อยู่ data/chNN.json ในเบราว์เซอร์ก็อ่านเฉลยทั้งเล่มได้ทันที
      รุ่นนี้เนื้อหาที่ขายถูกเข้ารหัส AES-256-GCM กุญแจมาจากรหัสเข้าแอปของเล่มนั้น
      รหัสผิด = ถอดไม่ออก ไม่ใช่แค่กล่องไม่หาย */
(function(){
 var K='mat-key-v2';
 function norm(s){return (s||'').replace(/[\s\-]/g,'').toUpperCase()}
 function b64(s){var r=atob(s),a=new Uint8Array(r.length);
   for(var i=0;i<r.length;i++)a[i]=r.charCodeAt(i);return a}
 function get(k){try{return localStorage.getItem(k)||sessionStorage.getItem(k)}catch(e){return null}}
 function put(k,v,rem){try{(rem?localStorage:sessionStorage).setItem(k,v)}catch(e){}}
 async function unlock(lock,code){
   var mat=await crypto.subtle.importKey('raw',new TextEncoder().encode(norm(code)),
     'PBKDF2',false,['deriveKey']);
   var key=await crypto.subtle.deriveKey(
     {name:'PBKDF2',salt:b64(lock.salt),iterations:lock.iter,hash:'SHA-256'},
     mat,{name:'AES-GCM',length:256},false,['decrypt']);
   var pt=await crypto.subtle.decrypt({name:'AES-GCM',iv:b64(lock.iv)},key,b64(lock.ct));
   return JSON.parse(new TextDecoder().decode(pt));
 }
 /* หน้าบทเรียกตัวนี้แทน fetch ตรง ๆ */
 window.openChapter=function(n){
  var file='data/ch'+(n<10?'0':'')+n+'.json';
  return fetch(file).then(function(r){return r.json()}).then(function(d){
   if(!d['ล็อก']){var g=document.getElementById('gate');if(g)g.remove();return d}
   function merge(x){Object.keys(x).forEach(function(k){d[k]=x[k]});
     delete d['ล็อก'];var g=document.getElementById('gate');if(g)g.remove();return d}
   var saved=get(K+'-'+d['เล่ม']);
   if(saved){return unlock(d['ล็อก'],saved).then(merge).catch(function(){return ask(d,merge)})}
   return ask(d,merge);
  });
 };
 function ask(d,merge){
  return new Promise(function(res){
   var f=document.getElementById('gform'),i=document.getElementById('gcode'),
       e=document.getElementById('gerr'),r=document.getElementById('grem'),
       s=document.getElementById('gshow');
   if(s)s.addEventListener('change',function(){i.type=s.checked?'text':'password'});
   f.addEventListener('submit',function(ev){ev.preventDefault();
     e.textContent='กำลังตรวจรหัส…';
     unlock(d['ล็อก'],i.value).then(function(x){
       put(K+'-'+d['เล่ม'],norm(i.value),r&&r.checked);res(merge(x))})
      .catch(function(){
       e.textContent='รหัสไม่ถูกต้อง โปรดดูรหัสที่พิมพ์ไว้ในตำราเล่มนี้';i.select()});
   });
  });
 }
})();
