
function tabs(){
 var bs=[].slice.call(document.querySelectorAll('.tabs button'));
 bs.forEach(function(b){b.addEventListener('click',function(){
   bs.forEach(function(x){x.setAttribute('aria-selected',x===b);
     var s=document.getElementById(x.dataset.t); if(s) s.hidden=(x!==b)});
   window.scrollTo({top:0,behavior:'smooth'})})});
}
function esc(s){var d=document.createElement('div');d.textContent=s==null?'':s;return d.innerHTML}
function quiz(d){
 var host=document.getElementById('quiz'),done={},right=0;
 d.quiz.forEach(function(q){
  var c=document.createElement('div');c.className='card';
  var h='';
  if(q.scene) h+='<div class="scene">'+esc(q.scene)+'</div>';
  h+='<p class="q">ข้อ '+q.no+'. '+esc(q.stem)+(q.level?'<span class="badge">'+esc(q.level)+'</span>':'')+'</p>';
  'กขคง'.split('').forEach(function(k){
    if(!q.opts[k])return;
    h+='<button class="opt" data-k="'+k+'"><span class="k">'+k+'.</span>'+esc(q.opts[k])+'</button>'});
  h+='<div class="why" id="w'+q.no+'"></div>';
  c.innerHTML=h;host.appendChild(c);
  c.querySelectorAll('.opt').forEach(function(b){
   b.addEventListener('click',function(){
    if(done[q.no])return; done[q.no]=b.dataset.k;
    if(b.dataset.k===q.ans)right++;
    c.querySelectorAll('.opt').forEach(function(x){
      x.dataset.s=(x.dataset.k===q.ans)?'ok':(x===b?'no':'')});
    var w=document.getElementById('w'+q.no),t='';
    'กขคง'.split('').forEach(function(k){ if(q.why&&q.why[k])
      t+='<div><b>'+k+'.</b> '+esc(q.why[k])+'</div>'});
    w.innerHTML=t||'<div>ไม่มีคำอธิบายในเล่มสำหรับข้อนี้</div>';w.classList.add('show');
    var n=Object.keys(done).length;
    document.getElementById('sc').textContent='ตอบแล้ว '+n+' จาก '+d.quiz.length+
      ' ข้อ · ถูก '+right+' ข้อ ('+Math.round(right*100/n)+'%)';
   })});
 });
}
function selfcheck(d){
 var k='mat-lo-'+d.chapter,host=document.getElementById('lo'),st={};
 try{st=JSON.parse(localStorage.getItem(k)||'{}')}catch(e){st={}}
 function pct(){var n=d.lo.filter(function(x){return st[x.no]}).length;
   document.getElementById('lopct').textContent='ทำได้แล้ว '+n+' จาก '+d.lo.length+
     ' ข้อ ('+Math.round(n*100/(d.lo.length||1))+'%)'}
 d.lo.forEach(function(x){
  var l=document.createElement('label');l.className='chk';
  l.innerHTML='<input type="checkbox"'+(st[x.no]?' checked':'')+'><span><b>'+
    esc(x.level)+'</b> '+esc(x.text)+'</span>';
  l.querySelector('input').addEventListener('change',function(e){
    st[x.no]=e.target.checked;try{localStorage.setItem(k,JSON.stringify(st))}catch(_){}
    pct()});
  host.appendChild(l)});
 pct();
}
function gloss(d){
 var host=document.getElementById('gbody');
 function draw(f){
  f=(f||'').trim().toLowerCase();host.innerHTML='';
  d.glossary.filter(function(g){return !f||
    (g.th+' '+g.en+' '+g.def).toLowerCase().indexOf(f)>=0}).forEach(function(g){
   var tr=document.createElement('tr');
   tr.innerHTML='<td><b>'+esc(g.th)+'</b>'+(g.en?'<br><span class="mute">'+esc(g.en)+'</span>':'')+
     '</td><td>'+esc(g.def)+'</td>';host.appendChild(tr)});
 }
 document.getElementById('gq').addEventListener('input',function(e){draw(e.target.value)});
 draw('');
}
