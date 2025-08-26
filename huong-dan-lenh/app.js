// app.js — UI Hướng dẫn lệnh (đã giữ nguyên logic chính; rút gọn Audio UI)
// - Accordion danh mục + "Copy tất cả"
// - Copy trong code block + Toast
// - Autocomplete gợi ý
// - Deep link ?q=... (search)
// - Command Palette (Ctrl/Cmd + K)
// - Audio UI (chỉ còn bật/tắt)

var $ = function (s) { return document.querySelector(s); };
var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

(function () {
  // ====== Nạp & chuẩn hoá dữ liệu ======
  var RAW = window.COMMANDS || [];
  function norm(c) {
    return {
      name: c.name,
      type: (c.type || "").toLowerCase(), // "prefix" | "slash"
      usage: c.usage || "",
      desc: c.description || "",
      category: c.category || "Khác",
      ownerOnly: !!c.ownerOnly,
      privateReply: !!c.ephemeral
    };
  }
  var ALL = RAW.map(norm).filter(function (c) { return !c.ownerOnly; });

  // ====== Thứ tự danh mục gợi ý ======
  var catOrder = [
    "Hôn nhân & Cá nhân","Điểm danh & Nhiệm vụ","Ngân hàng","Tiền ảo","Vay/Nợ",
    "Phương tiện","Nhà cửa","Chợ Tốt","Việc làm","Cướp","Bảng xếp hạng",
    "Cửa hàng & Kho","Chuyển/Giao dịch","Khác"
  ];
  var weight = {};
  for (var i = 0; i < catOrder.length; i++) weight[catOrder[i]] = i;

  // ====== State lọc ======
  var typeFilter = "all", catFilter = "all", keyword = "";

  // ====== Utils ======
  var toastEl = $("#toast");
  var toastTimer = 0;
  function showToast(msg) {
    if (msg === void 0) msg = "Đã copy!";
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 1400);
  }

  function copyToClipboard(text) {
    return new Promise(function (resolve) {
      // Clipboard API (secure context)
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(text).then(function () {
          resolve(true);
        }).catch(function () {
          // fallback phía dưới
          try {
            var ta = document.createElement("textarea");
            ta.value = text;
            ta.setAttribute("readonly", "");
            ta.style.position = "fixed";
            ta.style.left = "-9999px";
            document.body.appendChild(ta);
            ta.select();
            ta.setSelectionRange(0, ta.value.length);
            var ok = document.execCommand("copy");
            document.body.removeChild(ta);
            resolve(ok);
          } catch (e2) {
            resolve(false);
          }
        });
        return;
      }
      // Fallback cho HTTP/Safari cũ
      try {
        var ta2 = document.createElement("textarea");
        ta2.value = text;
        ta2.setAttribute("readonly", "");
        ta2.style.position = "fixed";
        ta2.style.left = "-9999px";
        document.body.appendChild(ta2);
        ta2.select();
        ta2.setSelectionRange(0, ta2.value.length);
        var ok2 = document.execCommand("copy");
        document.body.removeChild(ta2);
        resolve(ok2);
      } catch (e) {
        resolve(false);
      }
    });
  }

  function shortTitle(desc) {
    if (desc === void 0) desc = "";
    return String(desc).replace(/\([^)]*\)/g, "").replace(/[.。]\s*$/, "").replace(/\s+/g, " ").trim();
  }
  function escapeHtml(s) {
    if (s === void 0) s = "";
    return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;");
  }
  function highlight(text, q) {
    if (!q) return escapeHtml(text);
    try {
      var re = new RegExp("(" + q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + ")", "ig");
      return escapeHtml(text).replace(re, '<span class="hl">$1</span>');
    } catch (e) {
      return escapeHtml(text);
    }
  }

  // ====== Lọc dữ liệu ======
  function applyFilters() {
    return ALL.filter(function (c) {
      if (typeFilter !== "all" && c.type !== typeFilter) return false;
      if (catFilter !== "all" && c.category !== catFilter) return false;
      if (keyword) {
        var hay = (c.name + " " + c.desc + " " + c.usage + " " + c.category).toLowerCase();
        if (hay.indexOf(keyword) === -1) return false;
      }
      return true;
    });
  }
  function sortByCategoryThenName(arr) {
    return arr.slice().sort(function (a, b) {
      var wa = (weight[a.category] != null ? weight[a.category] : 999);
      var wb = (weight[b.category] != null ? weight[b.category] : 999);
      if (wa !== wb) return wa - wb;
      return a.name.localeCompare(b.name);
    });
  }

  // ====== Xây dropdown Danh mục ======
  var catSelect = $("#cmd-category");
  if (catSelect) {
    var allCatsMap = {};
    for (var j = 0; j < ALL.length; j++) allCatsMap[ALL[j].category] = 1;
    var categoriesAll = Object.keys(allCatsMap).sort(function (a, b) {
      var wa = (weight[a] != null ? weight[a] : 999);
      var wb = (weight[b] != null ? weight[b] : 999);
      if (wa !== wb) return wa - wb;
      return a.localeCompare(b);
    });
    categoriesAll.forEach(function (cat) {
      var o = document.createElement("option");
      o.value = cat; o.textContent = cat;
      var exists = false;
      for (var k = 0; k < catSelect.options.length; k++) {
        if (catSelect.options[k].value === cat) { exists = true; break; }
      }
      if (!exists) catSelect.appendChild(o);
    });
  }

  // ====== Danh mục + Icon cho hiện đại ======
  var catIcons = {
    "Hôn nhân & Cá nhân": "💑",
    "Điểm danh & Nhiệm vụ": "📅",
    "Ngân hàng": "🏦",
    "Tiền ảo": "💰",
    "Vay/Nợ": "💳",
    "Phương tiện": "🚗",
    "Nhà cửa": "🏠",
    "Chợ Tốt": "🛒",
    "Việc làm": "💼",
    "Cướp": "🦹",
    "Bảng xếp hạng": "🏆",
    "Cửa hàng & Kho": "📦",
    "Chuyển/Giao dịch": "🔄",
    "Khác": "✨"
  };
  // Tên mới dễ nhìn hơn cho hiện đại
  var catNamesModern = {
    "Hôn nhân & Cá nhân": "Cá nhân & Hôn nhân",
    "Điểm danh & Nhiệm vụ": "Điểm danh & Nhiệm vụ",
    "Ngân hàng": "Ngân hàng",
    "Tiền ảo": "Tiền tệ",
    "Vay/Nợ": "Vay & Nợ",
    "Phương tiện": "Phương tiện",
    "Nhà cửa": "Nhà cửa",
    "Chợ Tốt": "Chợ Tốt",
    "Việc làm": "Việc làm",
    "Cướp": "Cướp",
    "Bảng xếp hạng": "Bảng xếp hạng",
    "Cửa hàng & Kho": "Cửa hàng & Kho",
    "Chuyển/Giao dịch": "Chuyển/Giao dịch",
    "Khác": "Khác"
  };

  // ====== Render ======
  function render() {
    var data = sortByCategoryThenName(applyFilters());
    var host = $("#cmd-list");
    if (!host) return;
    host.innerHTML = "";

    if (!data.length) {
      host.innerHTML = '<p class="muted">Không tìm thấy lệnh phù hợp.</p>';
      return;
    }

    // DS danh mục hiện có
    var presentMap = {};
    data.forEach(function (c) { presentMap[c.category] = 1; });
    var presentCats = Object.keys(presentMap).sort(function (a, b) {
      var wa = (weight[a] != null ? weight[a] : 999);
      var wb = (weight[b] != null ? weight[b] : 999);
      if (wa !== wb) return wa - wb;
      return a.localeCompare(b);
    });

    // Kiểm tra theme retro
    var isRetro = document.body.classList.contains("theme-retro");

    presentCats.forEach(function (cat) {
      var items = data.filter(function (x) { return x.category === cat; });

      var group = document.createElement("section");
      group.className = "cat-group";

      var head = document.createElement("div");
      head.className = "cat-head";

      var titleBtn = document.createElement("button");
      titleBtn.className = "cat-title";
      titleBtn.setAttribute("aria-expanded", "true");

      // Thêm icon và tên mới cho hiện đại
      var icon = catIcons[cat] || "📁";
      var nameModern = catNamesModern[cat] || cat;
      var catLabel = isRetro ? escapeHtml(cat) : (icon + ' ' + escapeHtml(nameModern));

      titleBtn.innerHTML = '<span class="caret">▾</span> ' + catLabel;

      // Không tạo copyAllBtn nữa ở hiện đại
      var actions = document.createElement("div");
      actions.className = "cat-actions";
      if (isRetro) {
        var copyAllBtn = document.createElement("button");
        copyAllBtn.className = "btn-mini";
        copyAllBtn.textContent = "Copy tất cả";
        copyAllBtn.title = 'Copy toàn bộ lệnh trong “' + cat + '”';
        actions.appendChild(copyAllBtn);
      }
      head.appendChild(titleBtn);
      head.appendChild(actions);
      group.appendChild(head);

      var body = document.createElement("div");
      body.className = "cat-body";

      var grid = document.createElement("div");
      grid.className = "cmd-grid";

      items.forEach(function (c) {
        var card = document.createElement("div");
        card.className = "cmd-card";

        var titleText = shortTitle(c.desc) || c.name;
        var typeClass = (c.type === "slash") ? "type-slash" : ((c.type === "prefix") ? "type-prefix" : "");
        var headHtml = '<strong>' + highlight(titleText, keyword) + '</strong> <span class="badge ' + typeClass + '">' + (c.type || "CMD").toUpperCase() + '</span>';
        var headDiv = document.createElement("div");
        headDiv.innerHTML = headHtml;
        card.appendChild(headDiv);

        var descClean = shortTitle(c.desc || "");
        if (descClean && descClean.toLowerCase() !== titleText.toLowerCase()) {
          var p = document.createElement("p");
          p.className = "muted";
          p.innerHTML = highlight(descClean, keyword);
          card.appendChild(p);
        }

        // Code block + copy
        var usageWrap = document.createElement("div");
        usageWrap.className = "usage-wrap";

        var usage = document.createElement("pre");
        usage.className = "cmd-usage";
        usage.textContent = c.usage || "";
        usage.dataset.text = c.usage || "";

        var btn = document.createElement("button");
        btn.className = "btn-copy";
        btn.type = "button";
        btn.title = "Copy cú pháp";
        btn.setAttribute("aria-label", "Copy cú pháp");
        btn.textContent = "📋";

        function doCopy() {
          copyToClipboard(usage.dataset.text || "").then(function (ok) {
            btn.textContent = ok ? "✅" : "❌";
            if (ok) btn.classList.add("copied"); else btn.classList.remove("copied");
            showToast(ok ? ('Đã copy lệnh: ' + c.name) : "Không copy được");
            setTimeout(function () {
              btn.textContent = "📋";
              btn.classList.remove("copied");
            }, 1200);
          });
        }

        btn.addEventListener("click", function (e) { e.stopPropagation(); doCopy(); });
        usage.addEventListener("click", doCopy);

        usageWrap.appendChild(usage);
        usageWrap.appendChild(btn);
        card.appendChild(usageWrap);
        grid.appendChild(card);
      });

      body.appendChild(grid);
      group.appendChild(body);
      host.appendChild(group);

      // ====== Copy tất cả & accordion ======
      if (isRetro && actions.firstChild) {
        actions.firstChild.addEventListener("click", function () {
          var joined = items.map(function (i) { return i.usage || ""; }).filter(function (s) { return !!s; }).join("\n");
          if (!joined.trim()) { showToast("Danh mục chưa có cú pháp để copy"); return; }
          copyToClipboard(joined).then(function (ok) {
            showToast(ok ? ('Đã copy ' + items.length + ' lệnh trong “' + cat + '”') : "Không copy được");
          });
        });
      }

      titleBtn.addEventListener("click", function () {
        var expanded = titleBtn.getAttribute("aria-expanded") === "true";
        titleBtn.setAttribute("aria-expanded", String(!expanded));
        if (expanded) group.classList.add("cat-collapsed");
        else group.classList.remove("cat-collapsed");
      });

      // Thu gọn mặc định trên mobile
      try {
        if (window.matchMedia && window.matchMedia("(max-width:560px)").matches) {
          titleBtn.click();
        }
      } catch (e) {}
    });

    updateURL(); // deep link
  }

  // ====== Autocomplete ======
  var searchEl = $("#cmd-search");
  var suggestEl = $("#suggest");
  var sugIndex = -1;

  function buildSuggestions(q){
    if (!suggestEl) return;
    suggestEl.innerHTML = "";
    sugIndex = -1;
    if (!q) { suggestEl.hidden = true; return; }

    var ql = String(q).toLowerCase();
    var pool = ALL.filter(function (c) { return c.name.toLowerCase().indexOf(ql) !== -1; }).slice(0, 8);
    if (!pool.length) { suggestEl.hidden = true; return; }

    pool.forEach(function (c) {
      var li = document.createElement("li");
      li.innerHTML = '<span class="badge ' + (c.type==='slash'?'type-slash':'type-prefix') + '">' + (c.type||'CMD').toUpperCase() + '</span> ' + escapeHtml(c.name);
      li.addEventListener("mousedown", function (e) {
        e.preventDefault();
        searchEl.value = c.name;
        keyword = c.name.toLowerCase();
        render();
        suggestEl.hidden = true;
      });
      suggestEl.appendChild(li);
    });

    suggestEl.hidden = false;
  }

  if (searchEl){
    // Nạp từ URL nếu có ?q=
    var urlQ = null;
    try {
      urlQ = new URL(window.location.href).searchParams.get("q");
    } catch (e) {
      urlQ = null;
    }
    if (urlQ) { searchEl.value = urlQ; keyword = String(urlQ).toLowerCase(); }

    searchEl.addEventListener("input", function (e) {
      keyword = String(e.target.value || "").toLowerCase();
      render();
      buildSuggestions(e.target.value);
    });

    searchEl.addEventListener("keydown", function (e) {
      if (suggestEl.hidden) return;
      var items = Array.prototype.slice.call(suggestEl.children);
      if (!items.length) return;

      if (e.key === "ArrowDown"){
        e.preventDefault();
        sugIndex = (sugIndex + 1) < items.length ? sugIndex + 1 : 0;
      } else if (e.key === "ArrowUp"){
        e.preventDefault();
        sugIndex = (sugIndex - 1) >= 0 ? sugIndex - 1 : items.length - 1;
      } else if (e.key === "Enter"){
        e.preventDefault();
        if (sugIndex >= 0){
          items[sugIndex].dispatchEvent(new MouseEvent("mousedown", {bubbles:true}));
        } else {
          suggestEl.hidden = true;
        }
      } else if (e.key === "Escape"){
        suggestEl.hidden = true;
        return;
      } else {
        return;
      }
      items.forEach(function (li, i) { li.classList.toggle("active", i === sugIndex); });
    });

    searchEl.addEventListener("blur", function () {
      setTimeout(function(){ suggestEl.hidden = true; }, 80);
    });
  }

  // ====== Bộ lọc loại/danh mục ======
  var typeEl = $("#cmd-type");
  if (typeEl) typeEl.onchange = function (e) { typeFilter = e.target.value; render(); };
  var catEl = $("#cmd-category");
  if (catEl) catEl.onchange = function (e) { catFilter = e.target.value; render(); };

  // ====== Deep link cập nhật URL ======
  var urlTimer = 0;
  function updateURL(){
    clearTimeout(urlTimer);
    urlTimer = setTimeout(function () {
      try {
        var u = new URL(window.location.href);
        if (keyword) u.searchParams.set("q", keyword);
        else u.searchParams["delete"]("q");
        history.replaceState({}, "", u.toString());
      } catch (e) {}
    }, 200);
  }

  // ====== Command Palette (Ctrl/Cmd + K) ======
  var kbar  = $("#kbar");
  var kInput= $("#kbar-input");
  var kList = $("#kbar-list");
  var kClose= $("#kbar-close");
  var kIndex = -1, kData = [];

  function openKbar() {
    if (!kbar || !kInput || !kList) return;
    kIndex = -1; kData = ALL.slice();
    kList.innerHTML = "";
    kInput.value = searchEl ? searchEl.value : "";
    buildKbar(kInput.value);
    kbar.hidden = false;
    try { kInput.focus(); } catch (e) {}
  }
  function closeKbar() { if (kbar) kbar.hidden = true; }
  function buildKbar(q){
    if (!kList) return;
    var ql = String(q || "").toLowerCase();
    var res = ALL.filter(function(c){
      return (c.name + " " + c.desc + " " + c.usage).toLowerCase().indexOf(ql) !== -1;
    }).slice(0, 12);
    kData = res;
    kList.innerHTML = "";
    if (!res.length) {
      var empty = document.createElement("li");
      empty.className = "muted";
      empty.textContent = "Không có kết quả…";
      kList.appendChild(empty);
      return;
    }
    res.forEach(function (c) {
      var li = document.createElement("li");
      li.setAttribute("role","option");
      li.innerHTML = '<span class="badge ' + (c.type==='slash'?'type-slash':'type-prefix') + '">' + (c.type||'CMD').toUpperCase() + '</span> ' +
        '<span>' + highlight(c.name, ql) + ' — <span class="muted">' + highlight(shortTitle(c.desc), ql) + '</span></span>';
      li.addEventListener("mousedown", function (e) {
        e.preventDefault();
        doCopyUsage(c);
      });
      kList.appendChild(li);
    });
    kIndex = -1;
  }
  function doCopyUsage(c){
    copyToClipboard(c.usage || "").then(function (ok) {
      showToast(ok ? ('Đã copy lệnh: ' + c.name) : "Không copy được");
      closeKbar();
    });
  }

  document.addEventListener("keydown", function (e) {
    var metaK = (e.ctrlKey || e.metaKey) && (String(e.key).toLowerCase() === "k");
    if (metaK){
      e.preventDefault(); openKbar(); return;
    }
    if (kbar && !kbar.hidden){
      if (e.key === "Escape"){ e.preventDefault(); closeKbar(); }
      if (e.key === "ArrowDown" || e.key === "ArrowUp"){
        e.preventDefault();
        var items = Array.prototype.slice.call(kList.children).filter(function(li){ return li.getAttribute("role")==="option"; });
        if (!items.length) return;
        if (e.key === "ArrowDown") kIndex = (kIndex + 1) % items.length;
        else kIndex = (kIndex - 1 + items.length) % items.length;
        items.forEach(function (li,i){ li.classList.toggle("active", i===kIndex); });
        try { items[kIndex].scrollIntoView({block:"nearest"}); } catch (e2) {}
      }
      if (e.key === "Enter"){
        var items2 = Array.prototype.slice.call(kList.children).filter(function(li){ return li.getAttribute("role")==="option"; });
        if (items2.length && kIndex >= 0){
          items2[kIndex].dispatchEvent(new MouseEvent("mousedown",{bubbles:true}));
        } else if (kData[0]) {
          doCopyUsage(kData[0]);
        }
      }
    }
  });
  if (kInput){
    kInput.addEventListener("input", function (e) { buildKbar(e.target.value); });
  }
  if (kClose){ kClose.addEventListener("click", closeKbar); }
  if (kbar){
    kbar.addEventListener("click", function (e){ if(e.target === kbar) closeKbar(); });
  }

  // ===== Nhạc nền (rút gọn: bỏ thanh volume) =====
  (function bgmInit(){
    var audio = $("#bgm");
    var ui = $("#audio-ui");
    var btn = $("#bgm-toggle");
    if (!audio || !btn || !ui) return;

    var LS_ENABLED = "vdc_bgm_enabled";
    var rawEnabled = localStorage.getItem(LS_ENABLED);
    var enabled;
    try { enabled = JSON.parse(rawEnabled != null ? rawEnabled : "true"); }
    catch (e) { enabled = true; }

    // Volume cố định mức vừa phải
    audio.volume = 0.35;

    function setUI(){
      var playing = !audio.paused && !audio.ended;
      ui.classList.toggle("playing", playing);
      btn.title = playing ? "Tắt nhạc" : "Bật nhạc";
    }

    function tryAutoplay(){
      audio.muted = false;
      if (enabled) {
        audio.play().then(function(){ setUI(); }).catch(function () {
          audio.muted = true;
          audio.play().then(function(){ setUI(); }).catch(function () { setUI(); });
        });
      } else setUI();
    }

    function unlock(){
      if (!enabled) { cleanupUnlock(); return; }
      audio.muted = false;
      audio.play().then(function(){ setUI(); }).catch(function () { setUI(); });
      cleanupUnlock();
    }
    function cleanupUnlock(){
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      window.removeEventListener("touchstart", unlock);
    }
    window.addEventListener("pointerdown", unlock);
    window.addEventListener("keydown", unlock);
    window.addEventListener("touchstart", unlock, {passive:true});

    btn.addEventListener("click", function () {
      var playing = !audio.paused && !audio.ended;
      enabled = !playing;
      try { localStorage.setItem(LS_ENABLED, JSON.stringify(enabled)); } catch (e) {}
      if (enabled) {
        audio.muted = false;
        audio.play().then(function(){ setUI(); }).catch(function () { setUI(); });
      } else {
        audio.pause(); setUI();
      }
    });

    // Tôn trọng reduce motion
    var reduceMotion = false;
    try { reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches; }
    catch (e) {}
    if (reduceMotion) {
      enabled = false;
      try { localStorage.setItem(LS_ENABLED, "false"); } catch (e3) {}
      setUI();
    } else {
      tryAutoplay();
    }
  })();

  // ===== Render lần đầu =====
  var typeEl = $("#cmd-type");
  var catEl = $("#cmd-category");
  if (typeEl) typeEl.value = "all";
  if (catEl)  catEl.value  = "all";
  render();

})();
