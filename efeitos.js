(function(){
  var mq = window.matchMedia;
  if (mq && (mq('(prefers-reduced-motion: reduce)').matches || !mq('(pointer:fine)').matches)) return;
  var canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden','true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999;';
  document.body.appendChild(canvas);
  var ctx = canvas.getContext('2d');
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  function resize(){ canvas.width = innerWidth*DPR; canvas.height = innerHeight*DPR; ctx.setTransform(DPR,0,0,DPR,0,0); }
  resize(); addEventListener('resize', resize, {passive:true});
  var parts = [], lastX = 0, lastY = 0, lastT = 0;
  function spawn(x,y){
    parts.push({ x:x+(Math.random()*10-5), y:y+(Math.random()*10-5), r:6+Math.random()*6,
      vx:(Math.random()*0.6-0.3), vy:-(0.4+Math.random()*0.7), life:0,
      max:45+Math.random()*30, o:0.26+Math.random()*0.16 });
    if (parts.length > 140) parts.shift();
  }
  addEventListener('mousemove', function(e){
    var now = performance.now(), dx = e.clientX-lastX, dy = e.clientY-lastY;
    if (dx*dx+dy*dy > 16 || now-lastT > 45){ spawn(e.clientX, e.clientY); lastX=e.clientX; lastY=e.clientY; lastT=now; }
  }, {passive:true});
  function frame(){
    ctx.clearRect(0,0,innerWidth,innerHeight);
    for (var i=parts.length-1; i>=0; i--){
      var p = parts[i]; p.life++;
      if (p.life >= p.max){ parts.splice(i,1); continue; }
      var k = p.life/p.max;
      p.x += p.vx; p.y += p.vy; p.vy -= 0.004; p.vx *= 0.99;
      var rad = p.r*(1+k*2.4), alpha = p.o*(1-k);
      var g = ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rad);
      g.addColorStop(0,'rgba(228,231,235,'+alpha+')');
      g.addColorStop(1,'rgba(228,231,235,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(p.x,p.y,rad,0,6.283); ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
