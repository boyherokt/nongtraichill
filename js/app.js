// ===== Utils =====
const formatCoin = (n) => {
  if (n === undefined || n === null || isNaN(n)) return '—';
  try { return Number(n).toLocaleString('vi-VN') + ' CC'; } catch { return n + ' CC'; }
};
const el  = (sel, ctx=document) => ctx.querySelector(sel);
const els = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

// ===== Global State =====
window.currentQuery = window.currentQuery ?? '';
window.currentSort  = window.currentSort  ?? 'price-desc';

const applySort = (arr, keyGetter) => {
  const [_, dir] = String(window.currentSort).split('-');
  const k = (x) => Number(keyGetter(x)) || 0;
  return [...arr].sort((a,b) => (k(a) - k(b)) * (dir === 'asc' ? 1 : -1));
};
const matchQuery = (text) => !window.currentQuery || (text || '').toLowerCase().includes(String(window.currentQuery).toLowerCase());

/* ================= RENDER SECTIONS ================= */
// (giữ nguyên như trước)
const renderItems = () => {
  const root = el('#items .grid'); if (!root || !window.itemsData) return; root.innerHTML = '';
  const typeMeta = { marriage:{name:'Nhẫn cưới',icon:'💍'}, heal:{name:'Hồi máu',icon:'🧪'}, food:{name:'Đồ ăn',icon:'🍱'}, drink:{name:'Đồ uống',icon:'🥤'} };
  const filtered = window.itemsData.filter(i => matchQuery((i.name||'')+' '+(i.description||'')));
  applySort(filtered, x=>x.price).forEach(item=>{
    const meta = typeMeta[item.type] || {name:'Khác',icon:'📦'};
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img class="thumb" src="${item.thumbnail||''}" alt="${item.name||''}"/>
      <div class="body">
        <div class="title">${item.name||'Item'}</div>
        <div class="desc">${item.description||''}</div>
        <div class="row">
          <span class="badge">${meta.icon} ${meta.name}</span>
          <span class="price">${formatCoin(item.price)}</span>
        </div>
      </div>`;
    root.appendChild(card);
  });
};
const renderVehicles = () => {
  const root = el('#vehicles .grid'); if (!root || !window.vehiclesData) return; root.innerHTML = '';
  const filtered = window.vehiclesData.filter(v => matchQuery((v.name||'')+' '+(v.description||'')));
  applySort(filtered, x=>x.price).forEach(v=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img class="thumb" src="${v.image||''}" alt="${v.name||''}"/>
      <div class="body">
        <div class="title">${v.name||'Vehicle'}</div>
        <div class="desc">${v.description||''}</div>
        <div class="row">
          <span class="badge">Reputation: ${Number(v.reputation||0).toLocaleString('vi-VN')}</span>
          <span class="price">${formatCoin(v.price)}</span>
        </div>
      </div>`;
    root.appendChild(card);
  });
};
const renderHouses = () => {
  const root = el('#houses .grid'); if (!root || !window.housesData) return; root.innerHTML = '';
  const filtered = window.housesData.filter(h => matchQuery(h.name||''));
  applySort(filtered, x=>x.price).forEach(h=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <img class="thumb" src="${h.image||''}" alt="${h.name||''}"/>
      <div class="body">
        <div class="title">${h.name||'House'}</div>
        <div class="row">
          <span class="badge">Fame: ${Number(h.fame||0).toLocaleString('vi-VN')}</span>
          <span class="price">${formatCoin(h.price)}</span>
        </div>
      </div>`;
    root.appendChild(card);
  });
};
const renderCryptos = () => {
  const root = el('#cryptos .grid'); if (!root || !window.cryptosData) return; root.innerHTML = '';
  const filtered = window.cryptosData.filter(c => matchQuery((c.name||'')+' '+(c.description||'')));
  applySort(filtered, x=>x.basePrice).forEach(c=>{
    const bp = Number(c.basePrice||0), base = bp.toLocaleString('vi-VN')+' ¢';
    const vol = ((Number(c.volatility)||0)*100).toFixed(1)+'%';
    const gr  = ((Number(c.growthRate)||0)*100).toFixed(2)+'%';
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="body">
        <div class="title">${c.emoji||'🪙'} ${c.name||'Crypto'}</div>
        <div class="desc">${c.description||''}</div>
        <div class="row"><span class="badge">Vol: ${vol}</span><span class="price">Giá niêm yết ban đầu: ${base}</span></div>
        <div class="row"><span class="badge">Max: ${Number(c.maxSupply||0).toLocaleString('vi-VN')}</span><span class="badge">Growth: ${gr}</span></div>
      </div>`;
    root.appendChild(card);
  });
};
const renderJobs = () => {
  const root = el('#jobs .grid'); if (!root || !window.jobsData) return; root.innerHTML = '';
  const filtered = window.jobsData.filter(j => matchQuery((j.name||'')+' '+(j.description||'')));
  applySort(filtered, x=>((Number(x.minPay)||0)+(Number(x.maxPay)||0))/2).forEach(j=>{
    const card = document.createElement('div'); card.className='card';
    card.innerHTML = `
      <div class="body">
        <div class="title">${j.name||'Job'}</div>
        <div class="desc">${j.description||''}</div>
        <div class="row">
          <span class="badge">Fame req: ${Number(j.fameRequired||0).toLocaleString('vi-VN')}</span>
          <span class="price">${formatCoin(j.minPay)} — ${formatCoin(j.maxPay)}</span>
        </div>
        <div class="row">
          <span class="badge">Fame +${Number(j.fameReward||0).toLocaleString('vi-VN')}</span>
          <span class="badge">HP -${j.healthCost ?? 0}</span>
        </div>
      </div>`;
    root.appendChild(card);
  });
};

/* ================= SHOW/HIDE SECTIONS ================= */
const showSection = (sectionId) => {
  const sections = els('.section');
  sections.forEach(sec => { if (!sectionId || sectionId === 'all') sec.style.display = ''; else sec.style.display = (sec.id === sectionId) ? '' : 'none'; });
  els('.nav a').forEach(a => {
    const href = a.getAttribute('href') || ''; const id = href.startsWith('#') ? href.slice(1) : href;
    if ((sectionId || 'all') === id) a.classList.add('active'); else a.classList.remove('active');
  });
};

/* ================= INIT ================= */
const rerenderAll = () => { renderItems(); renderVehicles(); renderHouses(); renderCryptos(); renderJobs(); };

document.addEventListener('DOMContentLoaded', () => {
  const search = el('#search'), sort = el('#sort');
  if (search) search.addEventListener('input', (e)=>{ window.currentQuery = e.target.value.trim(); rerenderAll(); });
  if (sort)   sort.addEventListener('change', (e)=>{ window.currentSort = e.target.value; rerenderAll(); });

  els('.nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = (link.getAttribute('href') || '').slice(1);
      history.replaceState(null, '', `#${targetId}`);
      showSection(targetId);
      const menuBtn = document.querySelector('.menu-toggle');
      const nav = document.getElementById('site-nav');
      if (menuBtn && nav) { menuBtn.setAttribute('aria-expanded','false'); nav.classList.remove('open'); }
    });
  });

  rerenderAll();
  showSection((location.hash || '#all').slice(1));
});

/* ================= SCROLL GIÁ TIỀN ================= */
(function () {
  const setupScrollingPrices = () => {
    document.querySelectorAll('.card .row .price').forEach(priceEl => {
      const text = priceEl.textContent.trim();
      if (!priceEl.querySelector('span')) priceEl.innerHTML = `<span>${text}</span>`;
      const span = priceEl.querySelector('span');
      priceEl.classList.remove('scroll');
      const boxWidth = priceEl.clientWidth;
      const textWidth = span.scrollWidth;
      if (textWidth > boxWidth) { priceEl.style.setProperty('--visible-width', boxWidth + 'px'); priceEl.classList.add('scroll'); }
    });
  };
  const _rerenderAll = window.rerenderAll;
  window.rerenderAll = () => { _rerenderAll(); requestAnimationFrame(setupScrollingPrices); };
  document.addEventListener('DOMContentLoaded', () => requestAnimationFrame(setupScrollingPrices));
  window.addEventListener('resize', () => requestAnimationFrame(setupScrollingPrices));
})();

/* ================= HERO: QUOTE ĐỘNG ================= */
(function () {
  const quotes = [
    'Nơi mọi thứ đều chill ✨',
    'Sưu tầm — Chơi vui — Gắn kết',
    'Chill Coin • Game • Nhiệm vụ',
    'Tận hưởng, không vội vàng 🌴'
  ];
  let idx = 0;
  const label = document.getElementById('hero-quote');
  if (!label) return;
  const tick = () => { idx = (idx + 1) % quotes.length; label.textContent = quotes[idx]; };
  setInterval(tick, 6000);
})();

/* ================= BG VIDEO: AUTOPLAY MOBILE & FALLBACK ================= */
(function () {
  const v = document.getElementById('bgVideo');
  if (!v) return;

  // Thuộc tính cần cho iOS/Android
  v.muted = true; v.setAttribute('muted','');
  v.loop  = true; v.setAttribute('loop','');
  v.playsInline = true; v.setAttribute('playsinline',''); v.setAttribute('webkit-playsinline','');
  v.removeAttribute('controls');

  const markOK = () => document.body.classList.remove('video-failed');
  const markFail = () => document.body.classList.add('video-failed');

  const tryPlay = () => v.play().then(markOK).catch(markFail);

  // Thử phát khi có đủ dữ liệu & khi tab visible
  const ready = () => document.visibilityState === 'visible';
  const onReadyTry = () => { if (ready()) tryPlay(); };

  if (v.readyState >= 2) onReadyTry();
  v.addEventListener('loadeddata', onReadyTry, { once:true });
  v.addEventListener('canplay', onReadyTry, { once:true });

  // Thử lại khi quay lại tab / khi user chạm 1 lần
  document.addEventListener('visibilitychange', onReadyTry);
  window.addEventListener('touchstart', onReadyTry, { once:true, passive:true });
  window.addEventListener('click', onReadyTry, { once:true });
})();
