
(function(){
 var H='46cb017319029a0fe19d988ee9914aa91cf2d479ebd0838e30ed306930774d1e',K='mat-gate';
 function norm(s){return (s||'').replace(/[\s\-]/g,'').toUpperCase()}
 async function sha(s){
   var b=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s));
   return Array.from(new Uint8Array(b)).map(function(x){return x.toString(16).padStart(2,'0')}).join('')}
 function get(k){try{return localStorage.getItem(k)||sessionStorage.getItem(k)}catch(e){return null}}
 function put(k,v,rem){try{(rem?localStorage:sessionStorage).setItem(k,v)}catch(e){}}
 function open_(){var g=document.getElementById('gate'); if(g) g.remove();}
 document.addEventListener('DOMContentLoaded',function(){
   if(get(K)===H){open_();return}
   var f=document.getElementById('gform'),i=document.getElementById('gcode'),
       e=document.getElementById('gerr'),r=document.getElementById('grem'),
       s=document.getElementById('gshow');
   s.addEventListener('change',function(){i.type=s.checked?'text':'password'});
   f.addEventListener('submit',async function(ev){ev.preventDefault();
     var h=await sha(norm(i.value));
     if(h===H){put(K,h,r.checked);open_()}
     else{e.textContent='รหัสไม่ถูกต้อง โปรดดูรหัสที่พิมพ์ไว้ในตำรา';i.select()}});
 });
})();
