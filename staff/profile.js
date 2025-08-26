/* ========= Data ========= */
const staff = [
  { name: "Hugnw", role: "Founder",   img: "hugnw/media/avatar.jpg",  link: "hugnw/index.html" },
  { name: "Lyons", role: "Admin",     img: "lyons/media/avatar.jpg",  link: "lyons/index.html" },
  { name: "Thắng", role: "Admin",     img: "thang/media/avatar.jpg",  link: "thang/index.html" },
  { name: "Đức Linh", role: "Admin",     img: "duclinh/media/avatar.jpg",  link: "duclinh/index.html" },
  { name: "Đạo Sĩ Thịt Gà", role: "Moderator", img: "daosi/media/avatar.jpg", link: "daosi/index.html" },
  { name: "Havo",  role: "Lễ Tân",    img: "havo/media/avatar.jpg",  link: "havo/index.html" },
];
const roleOrder = ["Founder", "Admin", "Moderator", "Lễ Tân"];
// === Tích hợp thông tin trực tiếp, không dùng assets ===
const MEMBER_INFO = {
  "hugnw": {
    "bio": "Founder Vùng Đất Chill – định hướng chiến lược và xây dựng trải nghiệm cộng đồng.",
    "since": "2021",
    "location": "Ha Noi",
    "skills": ["Chill"],
    "links": {
      "facebook": "",
      "discord": "",
      "website": ""
    }
  },
  // Thêm thông tin gọn gàng cho các thành viên còn lại (placeholder hợp lý)
  "lyons": {
    "bio": "Admin hệ thống – tối ưu hiệu năng, chăm UI/UX và tự động hoá.",
    "since": "2024",
    "location": "Ninh Binh",
    "skills": ["Frontend", "Automation", "Design"],
    "links": { "facebook": "", "discord": "", "website": "" }
  },
  "thang": {
    "bio": "Admin – vận hành, cấu hình dịch vụ và bảo trì hạ tầng.",
    "since": "2024",
    "location": "Gia Lai",
    "skills": ["Server", "Monitoring", "Security"],
    "links": { "facebook": "", "discord": "", "website": "" }
  },
  "duc linh": {
    "bio": "Admin – hỗ trợ thành viên, quản lý nội dung và quy trình.",
    "since": "2022",
    "location": "Ha Noi",
    "skills": ["Ops", "Support", "Docs"],
    "links": { "facebook": "", "discord": "", "website": "" }
  },
  "dao si thit ga": {
    "bio": "Moderator – giữ nhịp cộng đồng, duyệt nội dung và tạo không khí tích cực.",
    "since": "2025",
    "location": "An Giang",
    "skills": ["Moderation", "Event", "Community"],
    "links": { "facebook": "", "discord": "", "website": "" }
  },
  "havo": {
    "bio": "Lễ Tân – đón tiếp, hướng dẫn và kết nối thành viên mới.",
    "since": "2025",
    "location": "Dong Nai",
    "skills": ["Welcome", "Guide", "Comms"],
    "links": { "facebook": "", "discord": "", "website": "" }
  }
};


const QUOTES = [
  "“Không gian chill là nơi câu chuyện tự tìm thấy người nghe.” — VDC",
  "“Đi xa cùng nhau, đi nhanh đúng lúc.” — Team",
  "“Tôn trọng, tích cực, khác biệt – ba mảnh ghép tạo cộng đồng.” — Staff",
  "“Mỗi reaction là một lời cảm ơn nho nhỏ.” — Mod",
  "“Đến để thư giãn, ở lại vì con người.” — VDC",
  "“Ít drama hơn, nhiều niềm vui hơn.” — Admin",
];

const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

/* ========= Helpers ========= */
const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
// Consider most touch + small screens as low-end for animation purposes
const isLowEnd = isTouch && (Math.min(window.innerWidth, window.innerHeight) <= 720);
function el(tag, cls){ const e = document.createElement(tag); if (cls) e.className = cls; return e; }
function createRipple(card, x, y){
  const r = el("span","ripple");
  const rect = card.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 1.1;
  Object.assign(r.style,{ width:size+"px", height:size+"px", left:(x-rect.left-size/2)+"px", top:(y-rect.top-size/2)+"px" });
  card.appendChild(r); setTimeout(() => r.remove(), 650);
}

/** Build one card */
function buildCard(member, delay = 0){
  const a = el("a","card");
  a.href = member.link;
  a.setAttribute("role","link");
  a.setAttribute("aria-label", `${member.name} – ${member.role}`);
  a.tabIndex = 0;
  a.dataset.name = member.name.toLowerCase();
  a.dataset.role = member.role.toLowerCase();
  a.dataset.member = JSON.stringify(member);
  if (!prefersReduced) a.style.animationDelay = `${delay}s`;

  // Cover auto
  const memberDir = member.link.replace(/\\/g,'/').split('/').slice(0,-1).join('/');
  const coverBase = `${memberDir}/media/bia`;
  const coverWrap = el('div','cover-wrap');
  const coverImg = new Image();
  coverImg.className = 'cover';
  coverImg.alt = '';
  coverImg.loading = 'lazy';
  coverImg.decoding = 'async';
  coverImg.setAttribute('aria-hidden','true');
  coverImg.src = member.cover || `${coverBase}.gif`;
  coverImg.addEventListener('error', () => {
    // If using default path and GIF fails, try JPG once
    if (!member.cover && !coverImg.dataset.fallbackTried && coverImg.src.endsWith('.gif')){
      coverImg.dataset.fallbackTried = '1';
      coverImg.src = `${coverBase}.jpg`;
    } else {
      coverWrap.remove();
    }
  });
  coverWrap.appendChild(coverImg);
  coverWrap.appendChild(el('i','cover-glow'));
  a.appendChild(coverWrap);

  // Avatar
  const avaWrap = el('div','ava-wrap');
  const ava = el('img','ava'); ava.src = member.img; ava.alt = member.name; ava.loading='lazy'; ava.decoding='async';
  ava.onerror = () => { ava.src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22112%22 height=%22112%22/>'; };
  avaWrap.appendChild(ava);
  avaWrap.appendChild(el('i','ava-ring'));
  const orb1 = el('i','ava-orbit o1'); orb1.appendChild(el('i','orb'));
  const orb2 = el('i','ava-orbit o2'); orb2.appendChild(el('i','orb'));
  avaWrap.appendChild(orb1); avaWrap.appendChild(orb2);
  a.appendChild(avaWrap);

  // Text
  const nameEl = el('div','name'); nameEl.textContent = member.name; a.appendChild(nameEl);

  // Đưa badge role NGAY DƯỚI tên, căn giữa, hiệu ứng theo quyền
  const roleEl = el('div','role');
  roleEl.dataset.role = member.role;
  roleEl.textContent = member.role;
  a.appendChild(roleEl);

  // Details (filled on expand)
  const details = el('div','details');
  details.innerHTML = `
    <div class="row">
      <span class="badge"><i>📍</i><b class="loc skeleton" style="width:120px"></b></span>
      <span class="badge"><i>🗓️</i><b class="since skeleton" style="width:90px"></b></span>
      <span class="badge"><i>🛠️</i><b class="skills skeleton" style="width:160px"></b></span>
    </div>
    <p class="bio skeleton" style="height:48px; max-width:520px;"></p>
    <div class="row links"></div>
  `;
  a.appendChild(details);

  // Ripple (không đổi trạng thái mở rộng)
  a.addEventListener("click", (e) => {
    const rect = a.getBoundingClientRect();
    // On touch devices: first tap expands, second tap navigates
    if (isTouch && !a.classList.contains('is-active')){
      e.preventDefault();
      setActiveInGrid(a);
      createRipple(a, rect.left + rect.width/2, rect.top + rect.height/2);
      return;
    }
    createRipple(a, e.clientX || rect.left + rect.width/2, e.clientY || rect.top + rect.height/2);
  });

  // Hover expand ONLY (desktop)
  a.addEventListener('mouseenter', () => setActiveInGrid(a));
  // Avoid per-card mouseleave reset to prevent flicker when moving between cards
  a.addEventListener('mouseleave', () => {});
  // Touch: tap to focus/expand
  a.addEventListener('touchstart', () => setActiveInGrid(a), { passive: true });

  // Keyboard a11y: Enter/Space chỉ ripple, không toggle
  a.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const rect = a.getBoundingClientRect();
      createRipple(a, rect.left + rect.width/2, rect.top + rect.height/2);
    }
  });

  return a;
}

/* ========= Render ========= */
(function render(){
  const container = document.getElementById("staff-list");
  if (!container) return;

  const frag = document.createDocumentFragment();
  let cardIndex = 0;
  roleOrder.forEach(role => {
    const members = staff.filter(s => s.role === role).sort((a,b)=> a.name.localeCompare(b.name, 'vi'));
    if (!members.length) return;

    const group = el('section','group');
    group.setAttribute('aria-label', `Nhóm ${role}`);
    if (members.length === 1) group.classList.add('is-single');

    const title = el('h2','group-title'); title.textContent = role;
    const desc  = el('p','group-desc');   desc.textContent = ({
      'Founder': 'Sáng lập – định hướng tầm nhìn và chiến lược tổng thể.',
      'Admin': 'Quản trị hệ thống – cấu hình, phân quyền và vận hành.',
      'Moderator': 'Điều phối cộng đồng – duyệt nội dung và giữ môi trường tích cực.',
      'Lễ Tân': 'Tiếp nhận và hỗ trợ thông tin ban đầu, điều phối liên lạc.'
    })[role] || role;

    const grid  = el('div','group-grid');
    const innerFrag = document.createDocumentFragment();
    members.forEach(m => { innerFrag.appendChild(buildCard(m, prefersReduced ? 0 : (cardIndex * 0.10))); cardIndex++; });
    grid.appendChild(innerFrag);
    // Only restore if the mouse leaves to an area that is NOT another card
    grid.addEventListener('mouseleave', (e) => {
      const next = e.relatedTarget;
      if (!next || !next.closest || !next.closest('.card')){
        restoreGrid(grid);
      }
    });

    group.appendChild(title); group.appendChild(desc); group.appendChild(grid);
    frag.appendChild(group);
  });
  container.appendChild(frag);

  // Nâng cao
  initSearch(container);
  if (!isLowEnd) initTilt(container);
  initTheme();
  initStyle();        // Epic toggle
  if (!isLowEnd) initCanvas();
  initPrefetchAvatars(container);
  initGlobalShortcuts();
  if (!isLowEnd) initFireflies();
  initQuotes();
})();

/* ========= Expand behavior (hover only) ========= */
function restoreGrid(_grid){
  const all = document.querySelectorAll('.card');
  all.forEach(c => c.classList.remove('is-active','is-dim'));
  document.querySelectorAll('.group-grid').forEach(g => g.classList.remove('has-active'));
}
function setActiveInGrid(card){
  const all = document.querySelectorAll('.card');
  all.forEach(c => {
    if (c === card){
      c.classList.add('is-active');
      c.classList.remove('is-dim');
      ensureDetailsLoaded(c);
    } else {
      c.classList.add('is-dim');
      c.classList.remove('is-active');
    }
  });
  // indicate any grid has an active card (used by CSS spacing)
  const grid = card.closest('.group-grid');
  if (grid) grid.classList.add('has-active');
}

/* ========= Load details from assets (json -> html) =========
  Đặt trong thư mục con của mỗi profile:
  Ưu tiên: <profile>/assets/info.json
  Dự phòng: <profile>/assets/info.html (nội dung HTML tự do)
============================================================= */

async function ensureDetailsLoaded(card){
  if (card.dataset.detailsLoaded) return;
  const member = JSON.parse(card.dataset.member);
  // Robust key normalization: remove diacritics, map 'đ'->'d', keep letters/numbers/spaces only
  const rawName = (member.name || "").toLowerCase();
  const key = rawName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9 ]+/g, '')
    .trim();
  const info = MEMBER_INFO[key] || {};

  const details = card.querySelector('.details');
  const rowBadges = details.querySelectorAll('.badge b');
  const bio = details.querySelector('.bio');
  const linksWrap = details.querySelector('.links');

  const setText = (el, text) => {
    el.textContent = text;
    el.classList.remove('skeleton');
    // Clear inline skeleton sizing so content fits its text
    if (el.style){ el.style.width = ''; el.style.height = ''; }
  };
  // location (as-is)
  setText(rowBadges[0], info.location || "—");
  // since: show only year if provided like YYYY-MM
  const sinceYear = typeof info.since === 'string' && info.since.match(/^\d{4}/) ? info.since.slice(0,4) : (info.since || "—");
  setText(rowBadges[1], sinceYear);
  // skills: limit to first 3, append +N if more
  let skillsText = "—";
  if (Array.isArray(info.skills) && info.skills.length){
    const first = info.skills.slice(0,3);
    const more = info.skills.length - first.length;
    skillsText = first.join(" • ") + (more>0 ? ` +${more}` : "");
  }
  setText(rowBadges[2], skillsText);
  bio.textContent = info.bio || "Chưa có mô tả."; bio.classList.remove('skeleton');

  linksWrap.innerHTML = "";
  const linkIcons = { facebook:"📘", discord:"💬", tiktok:"🎵", youtube:"▶️", instagram:"📸", website:"🔗" };
  if (info.links){
    Object.entries(info.links).forEach(([k,v])=>{
      if (!v) return;
      const a = el('a','badge'); a.href = v; a.target="_blank"; a.rel="noopener";
      a.innerHTML = `<i>${linkIcons[k] || "🔗"}</i><b>${k}</b>`;
      linksWrap.appendChild(a);
    });
  }

  card.dataset.detailsLoaded = "1";
}


/* ========= Search ========= */
function initSearch(container){
  const input = document.getElementById("search");
  const status = document.getElementById("result-status");
  if (!input) return;
  const groups = Array.from(container.querySelectorAll('.group'));

  const url = new URL(location.href);
  const qParam = url.searchParams.get('q');
  const saved = localStorage.getItem('staff-search') || '';
  input.value = qParam ?? saved ?? '';
  filter();

  input.addEventListener('input', () => {
    filter();
    localStorage.setItem('staff-search', input.value);
    const u = new URL(location.href);
    if (input.value) u.searchParams.set('q', input.value); else u.searchParams.delete('q');
    history.replaceState(null, '', u.toString());
  });
  input.addEventListener('keydown', (e) => { if (e.key === 'Escape' && input.value){ input.value = ''; input.dispatchEvent(new Event('input')); } });

  function filter(){
    const q = input.value.trim().toLowerCase();
    let total = 0;
    groups.forEach(group => {
      const cards = Array.from(group.querySelectorAll('.card'));
      let visible = 0;
      cards.forEach(c => {
        if (!q){ c.classList.remove('is-hidden'); visible++; total++; return; }
        const ok = c.dataset.name.includes(q) || c.dataset.role.includes(q);
        c.classList.toggle('is-hidden', !ok);
        if (ok){ visible++; total++; }
      });
      group.style.display = visible ? '' : 'none';
    });
    if (status){ status.textContent = q ? `Có ${total} kết quả cho “${input.value}”.` : ''; }
  }
}

/* ========= Theme (light/dark) ========= */
function initTheme(){
  const btn = document.getElementById('theme-toggle'); if (!btn) return;
  const apply = (mode) => {
    document.body.dataset.theme = mode;
    btn.setAttribute('aria-pressed', String(mode === 'light'));
    btn.textContent = mode === 'light' ? '☀️' : '🌙';
  };
  const saved = localStorage.getItem('theme') || 'dark';
  apply(saved);
  btn.addEventListener('click', () => {
    const cur = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    apply(cur); localStorage.setItem('theme', cur);
  });
}

/* ========= Giao diện (Classic/Epic) ========= */
function initStyle(){
  const btn = document.getElementById('style-toggle'); if (!btn) return;

  const styles = ['gravity','classic','epic','sunset'];
  const labels = { gravity:'Gravity', classic:'Classic', epic:'Epic', sunset:'Sunset' };

  const apply = (style) => {
    document.body.dataset.style = style;
    btn.textContent = `🎛️ ${labels[style]}`;
    btn.setAttribute('aria-label', `Đổi giao diện (hiện tại: ${labels[style]})`);
    const eg = document.getElementById('epic-grid');
    if (eg) eg.style.display = (style === 'epic') ? 'block' : 'none';
    window.dispatchEvent(new Event('ui-style-changed'));
  };

  let saved = localStorage.getItem('ui-style');
  if (!styles.includes(saved)) saved = 'classic';
  // On low-end/touch devices, avoid heavy styles by default
  if (isLowEnd && (saved === 'epic' || saved === 'gravity')) saved = 'classic';
  apply(saved);

  btn.addEventListener('click', () => {
    const cur = document.body.dataset.style || 'classic';
    const next = styles[(styles.indexOf(cur)+1)%styles.length];
    apply(next);
    localStorage.setItem('ui-style', next);
  });
}

/* ========= 3D Tilt ========= */
function initTilt(container){
  if (prefersReduced) return;
  if (isTouch) return; // skip tilt on touch devices to reduce jank
  const max = 8;
  const cards = Array.from(container.querySelectorAll('.card'));
  const states = new WeakMap();

  function ensureState(card){
    let s = states.get(card);
    if (!s){ s = { rx:0, ry:0, tx:0, ty:0, raf:null, hovering:false }; states.set(card, s); }
    return s;
  }
  function animate(card){
    const s = states.get(card); if (!s) return;
    const ease = 0.18;
    s.rx += (s.tx - s.rx) * ease; s.ry += (s.ty - s.ry) * ease;
    const base = card.classList.contains('is-active') ? 'scale(1.06)' : (card.matches('.group-grid:hover .card') ? 'scale(.94)' : '');
    card.style.transform = `${base} rotateX(${s.rx.toFixed(2)}deg) rotateY(${s.ry.toFixed(2)}deg)`;
    const near = Math.abs(s.tx - s.rx) < 0.05 && Math.abs(s.ty - s.ry) < 0.05;
    if (!s.hovering && near){ card.style.transform = ''; s.rx=s.ry=s.tx=s.ty=0; card.classList.remove('tilting'); s.raf = null; return; }
    s.raf = requestAnimationFrame(() => animate(card));
  }
  function startAnim(card){ const s = ensureState(card); if (!s.raf){ s.raf = requestAnimationFrame(() => animate(card)); } }

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => { const s = ensureState(card); s.hovering = true; card.classList.add('tilting'); startAnim(card); });
    card.addEventListener('mousemove', (e) => {
      if (card.matches(':active')) return;
      const rect = card.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      const s = ensureState(card); s.tx = -py * max; s.ty =  px * max; startAnim(card);
    });
    card.addEventListener('mouseleave', () => { const s = ensureState(card); s.hovering = false; s.tx = s.ty = 0; startAnim(card); });
    card.addEventListener('touchstart', () => { const s = ensureState(card); s.hovering = false; s.tx = s.ty = 0; card.classList.remove('tilting'); card.style.transform = ''; }, { passive: true });
  });

  window.addEventListener('scroll', () => {
    cards.forEach(card => {
      const s = ensureState(card); s.hovering = false; s.tx = s.ty = 0; s.rx = s.ry = 0;
      if (s.raf){ cancelAnimationFrame(s.raf); s.raf = null; }
      card.classList.remove('tilting'); card.style.transform = '';
    });
  }, { passive: true });
}


/* ========= Animated Background Canvas ========= */
function initCanvas(){
  if (prefersReduced) return;
  if (isLowEnd) return; // disable canvas animations on low-end/mobile
  const mainCanvas = document.getElementById('bg-canvas');
  const gravityCanvas = document.getElementById('canvas');
  const gctx = gravityCanvas?.getContext('2d');
  const bctx = mainCanvas?.getContext('2d');
  let rafId = null, rafId2 = null;

  function resize(c, ctx){
    if (!c || !ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    c.width = Math.floor(innerWidth * dpr); c.height = Math.floor(innerHeight * dpr);
    c.style.width = innerWidth + 'px'; c.style.height = innerHeight + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  window.addEventListener('resize', () => {
    resize(gravityCanvas,gctx);
    resize(mainCanvas,bctx);
    // keep GR physics bounds in sync with viewport size
    GR.onresize?.();
  }, { passive:true });
  resize(gravityCanvas,gctx); resize(mainCanvas,bctx);

  const GR = (()=>{
    let width=innerWidth, height=innerHeight, xGravity=0, yGravity=1, friction=0.99;
    let dots=[], palettes=[
      ['#2e2932','#01a2a6','#37d8c2','#bdf271','#ffffa6'],
      ['#405952','#9c9b7a','#ffd393','#ff974f','#f35033'],
      ['#962d3e','#343641','#979c9c','#f2ebc9','#388898'],
      ['#f2ebbf','#5c4b51','#8dbeb2','#f2b468','#ee6163']
    ];
    let paletteCount=palettes.length, paletteCurrent=3, colorCount=palettes[0].length, tick=0, shapeIdx=0;
    const shapes=['circle','square','triangle','diamond'];

    function rand(min,max){ return Math.random()*(max-min)+min; }
    function randInt(min,max){ return Math.floor( min + Math.random()*(max-min+1) ); }
    function Dot(){ this.x=width/2; this.y=height/2; this.vx=rand(-2,2); this.vy=rand(-2,2); this.radius=rand(5,15); this.color=randInt(1,colorCount-1); }
    Dot.prototype.step=function(){
      this.x+=this.vx; this.y+=this.vy;
      if(this.vx>0 && this.x+this.radius>=width) this.vx*=-0.6;
      if(this.vx<0 && this.x-this.radius<=0) this.vx*=-0.6;
      if(this.vy>0 && this.y+this.radius>=height) this.vy*=-0.6;
      if(this.vy<0 && this.y-this.radius<=0) this.vy*=-0.6;
      if(this.x+this.radius>width){ this.x=width-this.radius; this.vy*=friction; }
      if(this.x-this.radius<0){ this.x=this.radius; this.vy*=friction; }
      if(this.y+this.radius>height){ this.y=height-this.radius; this.vx*=friction; }
      if(this.y-this.radius<0){ this.y=this.radius; this.vx*=friction; }
      this.vx+=xGravity; this.vy+=yGravity;
    };
    Dot.prototype.collide=function(other){
      var dx=other.x-this.x, dy=other.y-this.y, dist=Math.sqrt(dx*dx+dy*dy), minDist=this.radius+other.radius;
      if(dist<minDist){
        var tx=this.x+dx/dist*minDist, ty=this.y+dy/dist*minDist, ax=(tx-other.x)*0.6, ay=(ty-other.y)*0.6;
        this.vx-=ax; this.vy-=ay; other.vx+=ax; other.vy+=ay;
        this.vx*=friction*0.9; this.vy*=friction*0.9; other.vx*=friction*0.9; other.vy*=friction*0.9;
      }
    };
    Dot.prototype.draw=function(){
      gctx.fillStyle = palettes[paletteCurrent][this.color];
      const r=this.radius, x=this.x, y=this.y;
      gctx.beginPath();
      switch(shapes[shapeIdx]){
        case 'square':
          gctx.save(); gctx.translate(x,y); gctx.rotate(0.0); gctx.rect(-r, -r, r*2, r*2); gctx.restore(); break;
        case 'diamond':
          gctx.moveTo(x, y-r); gctx.lineTo(x+r, y); gctx.lineTo(x, y+r); gctx.lineTo(x-r, y); gctx.closePath(); break;
        case 'triangle':
          gctx.moveTo(x, y-r); gctx.lineTo(x+r*0.866, y+r*0.5); gctx.lineTo(x-r*0.866, y+r*0.5); gctx.closePath(); break;
        default: // circle
          gctx.arc(x,y,r,0,Math.PI*2); break;
      }
      gctx.fill();
    };
    function reset(){ width=innerWidth; height=innerHeight; dots.length=0; tick=0; }
    function onresize(){ width=innerWidth; height=innerHeight; }
    function create(){ const cap = (('ontouchstart' in window) || (navigator.maxTouchPoints>0)) ? 280 : 500; if(tick && dots.length<cap) dots.push(new Dot()); }
    function step(){
      for(let i=dots.length-1;i>=0;i--) dots[i].step();
      for(let i=dots.length-1;i>=0;i--){ const d=dots[i]; for(let j=i-1;j>=0;j--) d.collide(dots[j]); }
    }
    function draw(){
      // subtle trail
      gctx.globalCompositeOperation = 'source-over';
      const bg = palettes[paletteCurrent][0];
      const grd = gctx.createRadialGradient(innerWidth*0.5, innerHeight*0.35, 60, innerWidth*0.5, innerHeight*0.8, Math.max(innerWidth,innerHeight));
      grd.addColorStop(0, bg);
      grd.addColorStop(1, '#0a0e19');
      gctx.fillStyle = grd;
      gctx.globalAlpha = 0.9;
      gctx.fillRect(0,0,innerWidth,innerHeight);
      gctx.globalAlpha = 1;
      // particles
      for(let i=dots.length-1;i>=0;i--) dots[i].draw();
    }
    function loop(){ create(); step(); draw(); tick++; rafId = requestAnimationFrame(loop); }
    function start(){ stop(); reset(); loop(); }
    function stop(){ if(rafId){ cancelAnimationFrame(rafId); rafId=null; } }
    function onmousemove(e){ const mx=e.pageX, my=e.pageY; xGravity=(mx-innerWidth/2)/(innerWidth/2); yGravity=(my-innerHeight/2)/(innerHeight/2); }
    function onmousedown(){ for(let i=dots.length-1;i>=0;i--){ dots[i].vx+=rand(-10,10); dots[i].vy+=rand(-10,10); } paletteCurrent = (paletteCurrent+1)%paletteCount; shapeIdx = (shapeIdx+1) % shapes.length; }
    return { start, stop, onmousemove, onmousedown, onresize };
  })();

  const SP = (()=>{
    let particles=[], COUNT=60;
    function rand(min,max){ return Math.random()*(max-min)+min; }
    function seed(){
      particles.length=0;
      const epic = document.body.dataset.style==='epic';
      COUNT = epic ? 140 : 60;
      for(let i=0;i<COUNT;i++){
        particles.push({
          x: rand(0, innerWidth), y: rand(0, innerHeight),
          vx: rand(epic?-.35: -.2, epic? .35: .2),
          vy: rand(epic?-.25: -.15, epic? .25: .15),
          r: rand(epic? 0.8:1.2, epic? 1.8:2.2),
          hue: epic? rand(180,320): rand(190,280),
          tail: epic? rand(6,16): 0
        });
      }
    }
    function loop(){
      if (!bctx) return;
      bctx.clearRect(0,0,innerWidth,innerHeight);
      const epic = document.body.dataset.style==='epic';
      for(const p of particles){
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0||p.x>innerWidth) p.vx*=-1;
        if(p.y<0||p.y>innerHeight) p.vy*=-1;
        if(epic && p.tail){
          bctx.beginPath(); bctx.strokeStyle = `hsla(${p.hue},90%,65%,.18)`; bctx.lineWidth=1;
          bctx.moveTo(p.x,p.y); bctx.lineTo(p.x-p.vx*p.tail, p.y-p.vy*p.tail); bctx.stroke();
        }
        bctx.beginPath(); bctx.fillStyle = `hsla(${p.hue},85%,65%,${epic?'.22':'.18'})`;
        bctx.arc(p.x,p.y,p.r,0,Math.PI*2); bctx.fill();
      }
      rafId2 = requestAnimationFrame(loop);
    }
    function start(){ stop(); seed(); loop(); }
    function stop(){ if(rafId2){ cancelAnimationFrame(rafId2); rafId2=null; } }
    return { start, stop };
  })();

  function apply(){
    const style = document.body.dataset.style || 'classic';
    // Gravity -> run GR on #canvas
    if (style === 'gravity'){
      SP.stop();
      // ensure canvas matches current DPR and size before start
      resize(gravityCanvas,gctx);
      GR.onresize?.();
      GR.start();
      if (gravityCanvas) gravityCanvas.style.display='block';
      if (mainCanvas) mainCanvas.style.display='none';
      window.addEventListener('mousemove', GR.onmousemove, { passive:true });
      window.addEventListener('mousedown', GR.onmousedown);
    }
    // Epic -> run SP on #bg-canvas
    else if (style === 'epic'){
      window.removeEventListener('mousemove', GR.onmousemove, { passive:true });
      window.removeEventListener('mousedown', GR.onmousedown);
      GR.stop(); SP.start();
      if (gravityCanvas) gravityCanvas.style.display='none';
      if (mainCanvas) mainCanvas.style.display='block';
    }
    // Classic/Sunset -> static backgrounds (no canvas anim)
    else {
      window.removeEventListener('mousemove', GR.onmousemove, { passive:true });
      window.removeEventListener('mousedown', GR.onmousedown);
      GR.stop(); SP.stop();
      if (gravityCanvas) gravityCanvas.style.display='none';
      if (mainCanvas) mainCanvas.style.display='none';
    }
  }
  apply();
  window.addEventListener('ui-style-changed', apply);

  // React to devicePixelRatio changes (e.g., browser zoom) to avoid clipped canvas
  let dpr = window.devicePixelRatio || 1;
  try {
    let mql = window.matchMedia && window.matchMedia(`(resolution: ${dpr}dppx)`);
    if (mql && 'addEventListener' in mql){
      mql.addEventListener('change', () => {
        resize(gravityCanvas,gctx); resize(mainCanvas,bctx);
        GR.onresize?.();
        // refresh watcher for new DPR value
        dpr = window.devicePixelRatio || 1;
        mql.removeEventListener('change', this);
      });
    } else {
      // Fallback: poll occasionally to detect DPR change
      let last = dpr;
      setInterval(() => {
        const cur = window.devicePixelRatio || 1;
        if (Math.abs(cur - last) > 1e-3){
          last = cur;
          resize(gravityCanvas,gctx); resize(mainCanvas,bctx);
          GR.onresize?.();
        }
      }, 800);
    }
  } catch(_) {}
}
/* ========= Prefetch avatar ========= */
/* ========= Prefetch avatar ========= */
function initPrefetchAvatars(container){
  if (!('IntersectionObserver' in window)) return;
  const imgs = container.querySelectorAll('.ava');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const img = entry.target;
        const link = img.closest('.card')?.getAttribute('href');
        if (link){
          const dir = link.replace(/\\/g,'/').split('/').slice(0,-1).join('/');
          new Image().src = `${dir}/media/bia.gif`;
        }
        io.unobserve(img);
      }
    });
  }, { rootMargin: '120px' });
  imgs.forEach(img => io.observe(img));
}

/* ========= Shortcuts ========= */
function initGlobalShortcuts(){
  const input = document.getElementById('search');
  document.addEventListener('keydown', (e) => {
    const target = e.target;
    const typing = ['INPUT','TEXTAREA'].includes(target?.tagName) || target?.isContentEditable;
    if (!typing && (e.key === '/' || (e.ctrlKey && e.key.toLowerCase() === 'k'))){ e.preventDefault(); input?.focus(); }
    if (!typing && e.key.toLowerCase() === 't'){ e.preventDefault(); document.getElementById('theme-toggle')?.click(); }
    if (!typing && e.key.toLowerCase() === 'g'){ e.preventDefault(); document.getElementById('style-toggle')?.click(); }
  });
}

/* ========= Đom đóm ========= */
function initFireflies(){
  if (prefersReduced) return;
  const wrap = document.querySelector('.title-wrap .fireflies'); if (!wrap) return;
  const baseCount = 14, epicCount = 22;
  function build(count){
    wrap.innerHTML = '';
    for (let i=0;i<count;i++){
      const f = el('i','firefly');
      const x0 = (Math.random()*100|0) - 50, y0 = (Math.random()*60|0) - 30;
      const x1 = x0 + (Math.random()*80 - 40), y1 = y0 + (Math.random()*60 - 30);
      const x2 = x1 + (Math.random()*80 - 40), y2 = y1 + (Math.random()*60 - 30);
      const x3 = x2 + (Math.random()*80 - 40), y3 = y2 + (Math.random()*60 - 30);
      const dur = (8 + Math.random()*4).toFixed(2) + 's';
      f.style.setProperty('--x0', x0 + 'px'); f.style.setProperty('--y0', y0 + 'px');
      f.style.setProperty('--x1', x1 + 'px'); f.style.setProperty('--y1', y1 + 'px');
      f.style.setProperty('--x2', x2 + 'px'); f.style.setProperty('--y2', y2 + 'px');
      f.style.setProperty('--x3', x3 + 'px'); f.style.setProperty('--y3', y3 + 'px');
      f.style.setProperty('--dur', dur);
      f.style.left = (50 + x0) + 'px'; f.style.top  = (10 + y0) + 'px';
      wrap.appendChild(f);
    }
  }
  const set = () => build(document.body.dataset.style === 'epic' ? epicCount : baseCount);
  set(); window.addEventListener('ui-style-changed', set);
}

/* ========= Quote ========= */
function initQuotes(){
  const elq = document.getElementById('quote'); if (!elq || !Array.isArray(QUOTES) || QUOTES.length===0) return;
  let i = Math.floor(Math.random() * QUOTES.length);
  function show(){ elq.textContent = QUOTES[i % QUOTES.length]; elq.classList.add('fade'); }
  function next(){ i++; elq.classList.remove('fade'); // restart css anim
    requestAnimationFrame(()=>{ requestAnimationFrame(()=>{ elq.classList.add('fade'); elq.textContent = QUOTES[i % QUOTES.length]; }); });
  }
  show();
  let t = setInterval(next, 8000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden){ clearInterval(t); } else { next(); t = setInterval(next, 8000); }
  });
}
