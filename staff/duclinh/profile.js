/* ========== Video nền: tối ưu mobile & autoplay an toàn ========== */
(() => {
  const vid = document.getElementById('bgvid');
  if (!vid) return;

  vid.muted = true;
  vid.playsInline = true;

  const tryPlay = () => {
    const p = vid.play?.();
    if (p && p.catch) p.catch(() => {
      /* Nếu autoplay fail: vẫn hiển thị poster, không ẩn video */
    });
  };

  if (document.readyState === 'complete') tryPlay();
  else window.addEventListener('load', tryPlay);
  document.addEventListener('vdch:entered', tryPlay);
})();

/* ========== Hiệu ứng nền (Snow/Rain/Leaves/Stars/Bubbles/Fireworks/Combo) ========== */
(() => {
  const cvs = document.getElementById('snow');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');

  let DPR=1, W=0, H=0, lastT=performance.now();
  let effect='snow';
  let particles=[];
  let wind=0, targetWind=0;
  let lastX=null, lastY=null;

  const clamp = (v,a,b)=> Math.max(a, Math.min(b, v));
  const rnd = (a,b)=> a + Math.random()*(b-a);

  const resize = () => {
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio||1));
    W = cvs.clientWidth; H = cvs.clientHeight;
    cvs.width = W * DPR; cvs.height = H * DPR;
    ctx.setTransform(DPR,0,0,DPR,0,0);
    init();
  };

  function addSnow(){
    const area = W*H;
    const layers = [
      { countFactor: 0.00010, size:[1.2,2.2], speed:[20,32], alpha:0.55 },
      { countFactor: 0.00014, size:[1.8,3.0], speed:[28,42], alpha:0.75 },
      { countFactor: 0.00018, size:[2.6,4.2], speed:[36,54], alpha:0.95 },
    ];
    layers.forEach((L, li) => {
      const n = Math.floor(area * L.countFactor);
      for (let i=0;i<n;i++){
        particles.push({
          type:'snow',
          x: Math.random()*W, y: Math.random()*H,
          r: rnd(L.size[0], L.size[1]),
          vy: rnd(L.speed[0], L.speed[1]) / 60,
          vx: rnd(-0.3, 0.3),
          a: L.alpha * rnd(0.6, 1),
          l: li, seed: Math.random()*1000
        });
      }
    });
  }

  function addRain(){
    const area = W*H;
    const n = Math.floor(area * 0.00035);
    for (let i=0;i<n;i++){
      particles.push({
        type:'rain',
        x: Math.random()*W, y: Math.random()*H,
        len: rnd(8,16),
        vy: rnd(360,520)/60,
        vx: rnd(-0.15,0.1),
      });
    }
  }

  function addLeaves(){
    const area = W*H;
    const n = Math.floor(area * 0.00010);
    for (let i=0;i<n;i++){
      particles.push({
        type:'leaf',
        x: Math.random()*W, y: Math.random()*H,
        s: rnd(8,16),
        vy: rnd(20,36)/60,
        vx: rnd(-0.12,0.12),
        rot: Math.random()*Math.PI*2,
        vr: rnd(-0.8,0.8),
        h: rnd(15,45), a: rnd(0.65,0.95)
      });
    }
  }

  function addStars(){
    for (let i=0;i<6;i++){
      particles.push({
        type:'star',
        x: rnd(-W*0.2, W*1.2), y: rnd(-H*0.2, H*0.2),
        vx: rnd(2.0, 3.5), vy: rnd(0.6, 1.2),
        life: rnd(1200, 2400), len: rnd(40, 80)
      });
    }
  }

  function addBubbles(){
    const n = Math.floor((W*H) * 0.00006);
    for (let i=0;i<n;i++){
      particles.push({
        type:'bubble',
        x: Math.random()*W, y: H + rnd(0, 200),
        r: rnd(4,10),
        vy: rnd(16,28)/60,
        vx: rnd(-0.1,0.1),
        a: rnd(0.35,0.7)
      });
    }
  }

  let lastFirework = 0;
  function maybeAddFireworks(t){
    if (t - lastFirework > 1200 + Math.random()*1500){
      lastFirework = t;
      const cx = rnd(W*0.15, W*0.85);
      const cy = rnd(H*0.15, H*0.55);
      const count = 60;
      for (let i=0;i<count;i++){
        const ang = Math.random()*Math.PI*2;
        const spd = rnd(0.8, 2.8);
        particles.push({
          type:'fw',
          x: cx, y: cy,
          vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd,
          life: 1, decay: rnd(0.008, 0.018),
          hue: Math.floor(rnd(0,360))
        });
      }
    }
  }

  function init(){
    particles.length = 0;
    if (effect === 'off') return;
    if (effect === 'snow') addSnow();
    if (effect === 'rain') addRain();
    if (effect === 'leaves') addLeaves();
    if (effect === 'stars') addStars();
    if (effect === 'bubbles') addBubbles();
    if (effect === 'fireworks') { /* spawn over time */ }
    if (effect === 'combo') { addSnow(); addStars(); }
  }

  function draw(t){
    const dt = Math.min(33, t - lastT); lastT = t;
    wind += (targetWind - wind) * 0.04;
    ctx.clearRect(0,0,W,H);

    for (let i=0;i<particles.length;i++){
      const p = particles[i];

      if (p.type === 'snow'){
        p.x += (p.vx + wind*(0.25 + p.l*0.25)) * dt;
        p.y += p.vy * dt * (1 + p.l*0.1);
        p.vx += Math.sin((t+p.seed)*0.002) * 0.003;
        ctx.globalAlpha = p.a;
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
        ctx.globalAlpha = 1;
        if (p.y > H + 10) { p.y = -10; p.x = Math.random()*W; }
        if (p.x < -10) p.x = W + 10;
        if (p.x > W + 10) p.x = -10;
      }

      if (p.type === 'rain'){
        p.x += (p.vx + wind*0.6) * dt;
        p.y += p.vy * dt;
        ctx.strokeStyle = 'rgba(255,255,255,0.75)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - 1, p.y - p.len);
        ctx.stroke();
        if (p.y > H + 20){ p.y = -20; p.x = Math.random()*W; }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
      }

      if (p.type === 'leaf'){
        p.x += (p.vx + wind*0.3) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt * 0.003;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = `hsla(${p.h},70%,60%,${p.a})`;
        const s = p.s;
        ctx.fillRect(-s/2, -s/4, s, s/2);
        ctx.restore();
        if (p.y > H + 20){ p.y = -20; p.x = Math.random()*W; }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
      }

      if (p.type === 'star'){
        p.x += (p.vx + wind*0.1) * dt;
        p.y += (p.vy + wind*0.02) * dt;
        p.life -= dt;
        const alpha = Math.max(0, Math.min(1, p.life/2400));
        ctx.strokeStyle = `rgba(255,255,255,${0.6*alpha})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(p.x - p.len, p.y - p.len*0.35);
        ctx.stroke();
        if (p.x > W+100 || p.y > H+100 || p.life <= 0){
          p.x = rnd(-W*0.2, W*0.2);
          p.y = rnd(-H*0.2, H*0.2);
          p.vx = rnd(2.0, 3.5); p.vy = rnd(0.6, 1.2);
          p.life = rnd(1200, 2400);
          p.len = rnd(40, 80);
        }
      }

      if (p.type === 'bubble'){
        p.x += (p.vx + wind*0.02) * dt;
        p.y -= p.vy * dt;
        ctx.globalAlpha = p.a;
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.stroke();
        ctx.globalAlpha = 1;
        if (p.y < -20){ p.y = H + 20; p.x = Math.random()*W; }
        if (p.x < -20) p.x = W + 20;
        if (p.x > W + 20) p.x = -20;
      }

      if (p.type === 'fw'){
        p.x += p.vx * dt; p.y += p.vy * dt;
        p.vx *= 0.992; p.vy *= 0.992;
        p.life -= p.decay * dt * 0.6;
        const a = Math.max(0, Math.min(1, p.life));
        ctx.save();
        ctx.globalCompositeOperation = 'lighter';
        ctx.fillStyle = `hsla(${p.hue},100%,60%,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + 2*(1-a), 0, Math.PI*2);
        ctx.fill();
        ctx.restore();
      }
    }

    for (let i = particles.length - 1; i >= 0; i--){
      const p = particles[i];
      if (p.type === 'fw' && p.life <= 0) particles.splice(i, 1);
    }

    if (effect === 'fireworks') maybeAddFireworks(t);
    requestAnimationFrame(draw);
  }

  const onMove = (e) => {
    if (lastX!==null){
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const sp = Math.hypot(dx,dy);
      targetWind = clamp(dx * 0.002, -0.4, 0.4) + sp * 0.004;
    }
    lastX = e.clientX; lastY = e.clientY;
  };

  if (!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches)){
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, {passive:true});
    resize(); requestAnimationFrame(draw);
  }

  const EFFECTS = ['snow','rain','leaves','fireworks','stars','bubbles','combo','off'];
  window.Effects = {
    setEffect(name){ effect = name; init(); },
    getEffect(){ return effect; },
    list: EFFECTS
  };
})();

/* ========== Hiệu ứng chuột: Comet + Particles ========== */
(() => {
  const cvs = document.getElementById('cursorfx');
  if (!cvs) return;
  const ctx = cvs.getContext('2d');
  if (!ctx) return;

  let DPR = 1, W = 0, H = 0;
  let mx = window.innerWidth/2, my = window.innerHeight/2;
  let pmx = mx, pmy = my, lastT = performance.now();
  let speed = 0;

  const particles = [];
  const MAX_PARTICLES = 220;

  const opts = {
    cometSizeBase: 8,
    cometColor: 'rgba(255,255,255,0.95)',
    tailColor: 'rgba(255,255,255,0.35)',
    spawnBase: 3,
    spawnGain: 14,
    speedMul: 0.30,
    decay: 0.02,
    wobble: 0.35
  };

  const resize = () => {
    DPR = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    W = cvs.clientWidth; H = cvs.clientHeight;
    cvs.width = W * DPR; cvs.height = H * DPR;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };

  const onMove = (e) => { mx = e.clientX; my = e.clientY; };
  const burst = (amount=60) => {
    for (let i=0;i<amount;i++){
      const ang = Math.random() * Math.PI * 2;
      const spd = (Math.random()*1.5 + 0.5) * (opts.speedMul * 4);
      particles.push({ x: mx, y: my, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, life:1, rot: Math.random()*Math.PI });
    }
  };

  const spawn = (count) => {
    for (let i = 0; i < count; i++){
      const ang = Math.random() * Math.PI * 2;
      const spd = (Math.random()*1.0 + 0.4) * opts.speedMul;
      particles.push({ x: mx, y: my, vx: Math.cos(ang)*spd, vy: Math.sin(ang)*spd, life:1, rot: Math.random()*Math.PI });
    }
    while (particles.length > MAX_PARTICLES) particles.shift();
  };

  const drawComet = () => {
    const s = opts.cometSizeBase + Math.min(16, speed * 22);
    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate((Date.now() * 0.0015) % (Math.PI*2));
    ctx.fillStyle = opts.cometColor;
    ctx.beginPath();
    ctx.moveTo(0,-s); ctx.lineTo(s,0); ctx.lineTo(0,s); ctx.lineTo(-s,0); ctx.closePath();
    ctx.fill();
    ctx.restore();

    const grd = ctx.createRadialGradient(mx, my, 0, mx, my, s * 5);
    grd.addColorStop(0, opts.tailColor);
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grd;
    ctx.beginPath(); ctx.arc(mx, my, s * 5, 0, Math.PI*2); ctx.fill();
  };

  const step = (t) => {
    const dt = Math.min(33, t - lastT); lastT = t;

    const dx = mx - pmx, dy = my - pmy;
    speed = Math.min(1, Math.hypot(dx, dy) / 18);
    pmx = mx; pmy = my;

    const spawnCount = Math.floor(opts.spawnBase + opts.spawnGain * speed);

    ctx.clearRect(0,0,W,H);

    for (let i = 0; i < particles.length; i++){
      const p = particles[i];
      p.x += p.vx * dt; p.y += p.vy * dt;
      p.vx += (Math.sin(p.rot) * 0.01 * 0.35);
      p.vy += (Math.cos(p.rot) * 0.01 * 0.35);
      p.life -= 0.02 * (1 + speed*0.6);

      if (p.life > 0){
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot += 0.02);
        const a = Math.max(0, Math.min(1, p.life));
        ctx.fillStyle = `rgba(255,255,255,${0.55 * a})`;
        const sz = 2 + 3 * a;
        ctx.fillRect(-sz/2, -sz/2, sz, sz);
        ctx.restore();
      }
    }
    for (let i = particles.length - 1; i >= 0; i--){
      if (particles[i].life <= 0) particles.splice(i, 1);
    }

    drawComet();
    spawn(spawnCount);

    requestAnimationFrame(step);
  };

  const prefersReduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReduce){
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', () => burst(80), { passive: true });
    resize();
    document.body.classList.add('cursorfx-on');
    requestAnimationFrame(step);
  } else {
    document.body.classList.remove('cursorfx-on');
  }
})();

/* ========== Trình phát nhạc + Playlist + Loading + Mute tổng (đã thêm marquee Now Playing) ========== */
(() => {
  const audio = document.getElementById('bgm');
  const player = document.getElementById('audio-player');
  const btnToggle = player?.querySelector('.audio-toggle');
  const btnPrev = player?.querySelector('.prev');
  const btnNext = player?.querySelector('.next');
  const btnMute = document.getElementById('btn-mute');
  const nowEl = document.getElementById('nowplaying');
  if (!audio || !player || !btnToggle) return;

  const tracks = [
    { src: 'media/bgm.mp3', title: 'T9 - THIÊN NGỰ NGUYÊN' },
    { src: 'media/bgm2.mp3', title: 'Prada - Theary Alex Remix' },
    { src: 'media/bgm3.mp3', title: 'NHỮNG BÀI CA BẤT HỦ CỦA BÁ TƯỚC SAIN TOINE MEVIPPI' },
  ].filter(t => !!t.src);

  let idx = Number(localStorage.getItem('track_idx') || 0) % tracks.length;
  audio.volume = 0.8;

  const setUI = (playing) => {
    player.querySelector('.eq').style.display = playing ? 'grid' : 'none';
    player.querySelector('.pp').style.display  = playing ? 'none' : 'inline';
    btnToggle.classList.toggle('loading', false);
  };

  // ► Now Playing: tự chuyển marquee khi quá dài
  const showTitle = () => {
    if (!nowEl) return;
    const txt = `Đang phát: ${tracks[idx]?.title || '...'}`;
    nowEl.classList.remove('marquee');
    nowEl.textContent = txt;

    requestAnimationFrame(() => {
      const need = nowEl.scrollWidth > nowEl.clientWidth + 10;
      if (need){
        nowEl.classList.add('marquee');
        const safe = txt.replace(/</g,'&lt;').replace(/>/g,'&gt;');
        nowEl.innerHTML = `<span class="np-inner"><span>${safe}</span><span aria-hidden="true">${safe}</span></span>`;
      }
    });
  };

  const load = async (autoplay=false) => {
    audio.src = tracks[idx].src;
    showTitle();
    try {
      btnToggle.classList.add('loading');
      await audio.play();
      setUI(true);
      localStorage.setItem('bgm_state','playing');
    } catch (e) {
      setUI(false);
      if (autoplay) next();
    }
    localStorage.setItem('track_idx', idx);
  };

  const next = () => { idx = (idx + 1) % tracks.length; load(true); };
  const prev = () => { idx = (idx - 1 + tracks.length) % tracks.length; load(true); };

  const play = async () => { try { btnToggle.classList.add('loading'); await audio.play(); setUI(true); localStorage.setItem('bgm_state','playing'); } catch(e){ btnToggle.classList.remove('loading'); } };
  const pause = () => { audio.pause(); setUI(false); localStorage.setItem('bgm_state','paused'); };

  audio.addEventListener('waiting', () => btnToggle.classList.add('loading'));
  audio.addEventListener('playing', () => btnToggle.classList.remove('loading'));
  audio.addEventListener('canplay', () => btnToggle.classList.remove('loading'));

  // ► Auto bật ngay NHẤP đầu tiên ở bất kỳ đâu
  const first = () => { load(true); window.removeEventListener('pointerdown', first); };
  window.addEventListener('pointerdown', first, { once: true });

  // Nút player
  btnToggle.addEventListener('click', (ev) => { ev.stopPropagation(); if (audio.paused) play(); else pause(); });
  btnNext?.addEventListener('click', (e)=>{ e.stopPropagation(); next(); });
  btnPrev?.addEventListener('click', (e)=>{ e.stopPropagation(); prev(); });
  audio.addEventListener('ended', next);

  // Mute tổng
  const setMuted = (m) => {
    audio.muted = m;
    localStorage.setItem('muted', m ? '1' : '0');
    document.body.classList.toggle('muted', m);
    btnMute.textContent = m ? '🔈' : '🔇';
  };
  btnMute?.addEventListener('click', (e) => { e.stopPropagation(); setMuted(!(localStorage.getItem('muted') === '1')); });

  // UI ban đầu
  setUI(localStorage.getItem('bgm_state') === 'playing');
  showTitle();
  setMuted(localStorage.getItem('muted') === '1');

  // ► MOBILE: chạm vào player để bung nút phụ trong vài giây
  let hideTimer = null;
  const openForAWhile = () => {
    player.classList.add('open');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(()=> player.classList.remove('open'), 2600);
  };
  player.addEventListener('touchstart', openForAWhile, { passive:true });
})();

/* ========== Click-to-View Gate + Avatar pop when enter ========== */
(() => {
  const gate = document.getElementById('click-gate');
  if (!gate) return;
  const enter = async () => {
    gate.classList.add('hide');
    setTimeout(() => gate.remove(), 400);
    document.body.classList.add('entered');

    const audio = document.getElementById('bgm');
    if (audio && audio.paused) { try { await audio.play(); } catch {} }

    document.dispatchEvent(new CustomEvent('vdch:entered'));
  };
  gate.addEventListener('click', enter);
  gate.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); enter(); } });
})();

/* ========== Settings (Theme + Effect + NameFX) + Quote + URL sync + Shortcuts + Swipe ========== */
(() => {
  const panel = document.getElementById('settings');
  const toggleBtn = document.querySelector('.settings-toggle');
  const selTheme = document.getElementById('sel-theme');
  const selEffect = document.getElementById('sel-effect');
  const selNameFx = document.getElementById('sel-namefx'); // NEW
  const quoteEl = document.getElementById('quote');
  const nameEl  = document.getElementById('display-name'); // NEW

  // Toggle panel
  if (toggleBtn && panel){
    const closeAll = (e) => { if (!panel.contains(e.target) && e.target !== toggleBtn){ panel.classList.remove('open'); } };
    toggleBtn.addEventListener('click', (e) => { e.stopPropagation(); panel.classList.toggle('open'); if (panel.classList.contains('open')) document.dispatchEvent(new Event('settings:opened')); });
    document.addEventListener('click', closeAll);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') panel.classList.remove('open'); });
  }

  // URL params helper
  const params = new URLSearchParams(location.search);
  const setQuery = (k, v) => {
    const p = new URLSearchParams(location.search);
    if (v) p.set(k, v); else p.delete(k);
    history.replaceState(null, '', `${location.pathname}?${p.toString()}`);
  };

  // Theme (auto theo giờ)
  let themeTimer = null;
  const pickAutoTheme = () => {
    const h = new Date().getHours();
    return (h >= 6 && h < 18) ? 'pastel' : 'neon';
  };
  const applyTheme = (t) => { document.body.setAttribute('data-theme', t); };
  const initTheme = () => {
    let t = params.get('theme') || localStorage.getItem('theme') || 'auto';
    if (t === 'auto'){ applyTheme(pickAutoTheme()); } else { applyTheme(t); }
    selTheme && (selTheme.value = t);
    if (themeTimer) { clearInterval(themeTimer); themeTimer = null; }
    if (t === 'auto'){ themeTimer = setInterval(() => applyTheme(pickAutoTheme()), 60*1000); }
  };
  initTheme();
  selTheme?.addEventListener('change', e => {
    const v = e.target.value;
    localStorage.setItem('theme', v);
    setQuery('theme', v);
    if (v === 'auto') applyTheme(pickAutoTheme()); else applyTheme(v);
    if (themeTimer) clearInterval(themeTimer);
    if (v === 'auto') themeTimer = setInterval(() => applyTheme(pickAutoTheme()), 60*1000);
  });

  // Effect (random nếu chọn)
  const EFFECTS = (window.Effects?.list || ['snow','rain','leaves','fireworks','stars','bubbles','combo','off']).filter(x=>x);
  const pickRandomEffect = () => {
    const pool = EFFECTS.filter(x => x!=='off');
    return pool[Math.floor(Math.random()*pool.length)];
  };
  const initEffect = () => {
    let e = params.get('fx') || localStorage.getItem('effect') || 'random';
    selEffect && (selEffect.value = e);
    if (e === 'random'){ e = pickRandomEffect(); }
    localStorage.setItem('effect', selEffect?.value || 'random');
    window.Effects && window.Effects.setEffect(e);
  };
  initEffect();
  selEffect?.addEventListener('change', e => {
    const v = e.target.value;
    localStorage.setItem('effect', v);
    setQuery('fx', v);
    const chosen = v === 'random' ? pickRandomEffect() : v;
    window.Effects && window.Effects.setEffect(chosen);
  });

  // Quote
  const BASE_QUOTES = [
    "Chill là một nghệ thuật, còn mình là nghệ sĩ 🎧",
    "Uống miếng trà, kệ thiên hạ 🍵",
    "Không drama – chỉ có llama 🦙",
    "Đi chậm cho đời bớt mệt.",
    "Hôm nay vui, mai cũng vậy.",
    "Nếu mệt quá thì chill tiếp 😴",
    "Vào Vùng Đất Chill là hết buồn 😌",
    "Nghe nhạc một chút, tâm hồn nhẹ hẳn 🎶",
    "Chill không phải lười, chill là sống chậm 😌",
    "Mặt trời thì cần mọc, mình thì cần ngủ thêm ☀️😴",
    "Cười lên cho đời bớt nhạt 😁",
    "Kệ đời bon chen, mình chill bên ly cà phê ☕",
    "Có bạn bè, có tiếng cười, thế là đủ 🌸",
    "Mưa rơi ngoài hiên, chill rơi trong tim 🌧️",
    "Sống như làn gió, tự do và mát lành 🍃",
    "Drama ngoài kia, mình chỉ cần meme trong đây 🤡",
    "Hạnh phúc đôi khi là một bản nhạc chill đúng lúc 🎼"
  ];
  if (quoteEl){
    const setQuote = () => {
      quoteEl.style.opacity = 0;
      setTimeout(() => {
        quoteEl.textContent = BASE_QUOTES[Math.floor(Math.random()*BASE_QUOTES.length)] || 'Chill thôi!';
        quoteEl.style.opacity = 1;
      }, 250);
    };
    setQuote();
    setInterval(setQuote, 12000);
  }

  // ===== Name Effect (fire / neon / electric / none)
  const applyNameFx = (v) => {
    if (!nameEl) return;
    nameEl.classList.remove('fire','neon','electric');
    if (v && v !== 'none') nameEl.classList.add(v);
  };
  const initNameFx = () => {
    const v = params.get('namefx') || localStorage.getItem('namefx') || 'fire';
    if (selNameFx) selNameFx.value = v;
    applyNameFx(v);
  };
  initNameFx();
  selNameFx?.addEventListener('change', (e) => {
    const v = e.target.value;
    localStorage.setItem('namefx', v);
    setQuery('namefx', v);
    applyNameFx(v);
  });

  // Phím tắt
  const isTyping = (el) => el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);
  document.addEventListener('keydown', (e) => {
    if (isTyping(document.activeElement)) return;
    if (e.key.toLowerCase() === 'm'){
      const audio = document.getElementById('bgm');
      if (audio?.paused) audio.play().catch(()=>{}); else audio.pause();
    }
    if (e.key.toLowerCase() === 't'){
      const opts = ['auto','dark','neon','pastel','cyberpunk','retro'];
      const cur = selTheme?.value || 'auto';
      const idx = (opts.indexOf(cur) + 1) % opts.length;
      selTheme.value = opts[idx]; selTheme.dispatchEvent(new Event('change'));
    }
    if (e.key.toLowerCase() === 'e'){
      const opts = ['random','snow','rain','leaves','fireworks','stars','bubbles','combo','off'];
      const cur = selEffect?.value || 'random';
      const idx = (opts.indexOf(cur) + 1) % opts.length;
      selEffect.value = opts[idx]; selEffect.dispatchEvent(new Event('change'));
    }
    if (e.key.toLowerCase() === 'n'){
      const opts = ['none','fire','neon','electric'];
      const cur  = selNameFx?.value || 'fire';
      const i    = (opts.indexOf(cur) + 1) % opts.length;
      if (selNameFx){ selNameFx.value = opts[i]; selNameFx.dispatchEvent(new Event('change')); }
    }
    if (e.key === 'Escape'){
      document.getElementById('settings')?.classList.remove('open');
    }
  });

  // Swipe trái->phải để mở settings (mobile)
  let tsX=0, tsY=0;
  window.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; tsX = t.clientX; tsY = t.clientY;
  }, {passive:true});
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    const dx = t.clientX - tsX, dy = t.clientY - tsY;
    if (tsX < 24 && Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)){
      document.getElementById('settings')?.classList.add('open');
    }
  }, {passive:true});
})();

/* ========== Nút chia sẻ Discord + QR server ========== */
(() => {
  const btnCopy = document.getElementById('btn-copy-discord');
  const btnQR = document.getElementById('btn-qr');
  const qrWrap = document.getElementById('qr-wrap');
  const qrImg = document.getElementById('qr-img');
  const discordLink = 'https://dsc.gg/vungdatchill';

  function ensureQR(){
    if (!qrWrap) return;
    const url = 'https://quickchart.io/qr?size=200&text=' + encodeURIComponent(discordLink);
    if (qrImg && !qrImg.src) qrImg.src = url;
    qrWrap.removeAttribute('hidden');
  }
  document.addEventListener('settings:opened', ensureQR);
  btnCopy?.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(discordLink);
      btnCopy.textContent = 'Đã copy ✓';
      setTimeout(()=> btnCopy.textContent = 'Copy Discord link', 1200);
      window.SFX && window.SFX.click();
    } catch(e){}
  });
  btnQR?.addEventListener('click', () => {
    if (qrWrap.hasAttribute('hidden')) ensureQR(); else qrWrap.setAttribute('hidden', '');
    window.SFX && window.SFX.click();
  });
})();

/* ========== Hiệu ứng âm thanh click (WebAudio beep) — tôn trọng mute tổng ========== */
(() => {
  const ctx = (window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null;
  function beep(freq=660, time=0.06){
    if (!ctx) return;
    if (localStorage.getItem('muted') === '1') return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    o.connect(g); g.connect(ctx.destination);
    g.gain.value = 0.08;
    o.start();
    setTimeout(()=>{ g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + time); }, 0);
    o.stop(ctx.currentTime + time + 0.02);
  }
  window.SFX = { click: ()=>beep(760, 0.05) };
  document.addEventListener('click', (e) => {
    const t = e.target;
    if (t.closest('.btn') || t.closest('.audio-btn') || t.closest('.audio-toggle') || t.closest('.mini-btn') || t.closest('.settings-toggle')){
      window.SFX.click();
    }
  }, {capture:true});
})();

/* ========== Gallery + Lightbox ========== */
(() => {
  const openBtn = document.getElementById('open-gallery');
  const modal = document.getElementById('modal-gallery');
  const grid = document.getElementById('gallery-grid');
  const lightbox = document.getElementById('lightbox');
  const lightImg = document.getElementById('lightbox-img');
  const closeBtn = document.querySelector('[data-close-gallery]');

  if (!openBtn || !modal || !grid) return;

  const IMAGES = [
    'media/gallery/1.jpg','media/gallery/2.jpg','media/gallery/3.jpg',
    'media/gallery/4.jpg','media/gallery/5.jpg','media/gallery/6.jpg'
  ];

  const showLB = (src) => {
    if (!lightbox || !lightImg) return;
    lightImg.style.opacity = 0;
    lightImg.src = src;
    lightbox.hidden = false;
    lightImg.onload = () => { lightImg.style.opacity = 1; };
  };

  const createItem = (src) => {
    const img = new Image();
    img.src = src;
    img.alt = 'Ảnh khoảnh khắc';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.tabIndex = 0;
    const openHandler = (e) => { e.stopPropagation(); showLB(src); };
    img.addEventListener('click', openHandler);
    img.addEventListener('pointerup', openHandler);
    img.addEventListener('keydown', (e)=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); openHandler(e);} });
    img.onerror = () => img.classList.add('hidden');
    return img;
  };

  const open = () => {
    modal.classList.add('open');
    if (lightbox) lightbox.hidden = true;
    if (grid.childElementCount === 0){
      IMAGES.forEach(s => grid.appendChild(createItem(s)));
    }
  };
  const close = () => {
    modal.classList.remove('open');
    if (lightbox) lightbox.hidden = true;
  };

  openBtn.addEventListener('click', open);
  closeBtn?.addEventListener('click', (e)=>{ e.stopPropagation(); close(); });
  modal.addEventListener('click', (e)=>{ if (e.target === modal) close(); });
  lightbox?.addEventListener('click', ()=> lightbox.hidden = true);

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (lightbox && !lightbox.hidden) { lightbox.hidden = true; return; }
    if (modal.classList.contains('open')) close();
  });
})();

/* ========== Discord widget stats (tuỳ cấu hình) ========== */
(() => {
  const el = document.getElementById('discord-stats');
  if (!el) return;
  const GUILD_ID = ''; // ← điền ID server nếu bật Widget (Server Settings > Widget)
  if (!GUILD_ID){ el.style.display = 'none'; return; }
  const fetchStats = async () => {
    try{
      const res = await fetch(`https://discord.com/api/guilds/${GUILD_ID}/widget.json`, { cache: 'no-store' });
      if (!res.ok) throw 0;
      const data = await res.json();
      el.textContent = `${data?.presence_count || 0} online`;
      el.style.display = 'inline-block';
    }catch{
      el.style.display = 'none';
    }
  };
  fetchStats();
  setInterval(fetchStats, 60_000);
})();

/* ========== Card tilt theo chuột (desktop, tự tắt mobile) ========== */
(() => {
  const card = document.querySelector('.card');
  if (!card) return;
  const supportHover = window.matchMedia && window.matchMedia('(hover: hover)').matches;
  if (!supportHover) return;

  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const onMove = (e) => {
    const r = card.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top)  / r.height;
    const rx = clamp((0.5 - y) * 10, -8, 8);
    const ry = clamp((x - 0.5) * 12, -10, 10);
    card.classList.add('is-tilting');
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
  };
  const reset = () => {
    card.classList.remove('is-tilting');
    card.style.transform = '';
  };

  card.addEventListener('mousemove', onMove, {passive:true});
  card.addEventListener('mouseleave', reset, {passive:true});
})();
