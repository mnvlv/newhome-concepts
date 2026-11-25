// Анимации концептов. Включены по умолчанию; параметр ?static в адресе показывает страницу без движения.
// В плашке концепта есть переключатель «Выключить анимацию» / «Включить анимацию».
// Учитывает системную настройку «уменьшить движение»: тогда анимации не включаются.
//
// У каждого варианта один главный сценарий, остальное работает тише:
//   A «Галерея»  фото героя вешается в раму, путь заказа рассказан закреплённой сценой из четырёх кадров
//   B «Витрина»  первый кадр влетает в витрину, карточка открывается крупно, проекты едут вбок при прокрутке
//   C «Проём»    знак рисуется и впускает внутрь, путь из шести шагов проходится анфиладой проёмов
//   D «Вечер»    в гостиной сначала горит лампа, потом зажигается свет; капсула собирается по предметам
(function () {
  var html = document.documentElement;
  var on = !/[?&](static|motion=(0|off))\b/.test(location.search) && !html.hasAttribute('data-static');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var variant = document.body.getAttribute('data-variant');

  // Переключатель в плашке концепта
  var note = document.querySelector('.concept-note');
  if (note) {
    var q = location.search.replace(/[?&](static|motion)\b(=[^&]*)?/g, '').replace(/^&/, '?');
    if (on) q = q ? q + '&static' : '?static';
    var t = document.createElement('a');
    t.href = location.pathname + q + location.hash;
    t.textContent = on ? 'Выключить анимацию' : 'Включить анимацию';
    note.appendChild(document.createElement('br'));
    note.appendChild(t);
    if (on && reduce) note.appendChild(document.createTextNode(' (в системе включено «уменьшить движение», поэтому анимации отключены)'));
  }
  if (!on || reduce) return;

  html.classList.add('m-on');
  var EASE = 'cubic-bezier(.2,.7,.2,1)';

  var css = [
    ':root{--m-ease:cubic-bezier(.2,.7,.2,1)}',
    '.m-w{display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.14em;margin-bottom:-.14em}',
    '.m-w>span{display:inline-block}',
    '.m-curtain{clip-path:inset(100% 0 0 0);transform:scale(1.08);transition:clip-path 1.3s var(--m-ease),transform 1.9s var(--m-ease)}',
    '.m-curtain.m-in{clip-path:inset(0 0 0 0);transform:none}',
    '.m-ul{text-decoration:none!important;background:linear-gradient(currentColor,currentColor) 0 100%/0 1px no-repeat;padding-bottom:4px;transition:background-size .55s var(--m-ease)}',
    '.m-ul:hover,.m-ul:focus-visible{background-size:100% 1px}',
    '.m-pin{position:relative}',
    '.m-pinned{position:sticky;top:0}',
    '.m-scene{height:100vh;height:100svh}',
    '.m-clip{display:block;overflow:hidden;width:100%;height:100%}',
    '.m-sr{position:absolute!important;width:1px!important;height:1px!important;overflow:hidden!important;clip-path:inset(50%)!important;white-space:nowrap!important}',

    // ---------- A ----------
    '[data-variant=a] .header{position:sticky;top:0;z-index:40;background:var(--cream);transition:transform .5s var(--m-ease)}',
    '.header.m-hide{transform:translateY(-100%)}',
    '[data-variant=a] .hero img{animation:none}',
    '.m-media{position:absolute;inset:0;overflow:hidden}',
    '.m-media img{transform-origin:50% 50%}',
    '[data-variant=a] .geo{overflow-x:clip}',
    '[data-variant=a] .geo .countries span{will-change:transform}',
    '[data-variant=a] .cta .bg{will-change:transform}',
    '.m-story{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);grid-template-areas:"h stage" "txt stage";align-content:center;column-gap:clamp(32px,6vw,96px);row-gap:clamp(24px,4vh,44px);padding-block:clamp(72px,11vh,112px) clamp(28px,6vh,64px)}',
    '[data-variant=a] .m-story .h2{grid-area:h;align-self:end;margin:0}',
    '.m-story-stage{grid-area:stage;position:relative;height:min(70vh,620px);overflow:hidden;background:var(--limestone)}',
    '.m-story-l{position:absolute;inset:0;overflow:hidden}',
    '.m-story-l img{width:100%;height:100%;object-fit:cover}',
    '.m-story-txt{grid-area:txt;align-self:start}',
    '.m-story-steps{position:relative;min-height:230px}',
    '.m-story-steps li{position:absolute;left:0;right:0;top:0;opacity:0;transform:translateY(32px);transition:opacity .55s var(--m-ease),transform .8s var(--m-ease)}',
    '.m-story-steps li.m-past{transform:translateY(-32px)}',
    '.m-story-steps li.m-act{opacity:1;transform:none;transition-delay:.1s}',
    '.m-story-n{display:block;font:400 clamp(64px,7vw,108px)/1 var(--serif);color:var(--walnut)}',
    '.m-story-steps h3{font-size:clamp(28px,3vw,40px);margin-top:12px}',
    '.m-story-steps p{color:var(--ink-soft);margin-top:10px;max-width:34ch;font-size:17px}',
    '.m-story-bar{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:300px}',
    '.m-story-bar i{position:relative;height:1px;background:rgba(64,47,37,.2);overflow:hidden}',
    '.m-story-bar b{position:absolute;inset:0;background:var(--brown);transform-origin:left;transform:scaleX(0)}',
    '@media (max-width:760px){.m-story{grid-template-columns:minmax(0,1fr);grid-template-areas:"h" "stage" "txt";align-content:start;padding-block:84px 20px;row-gap:18px}.m-story-stage{height:40vh;height:40svh}.m-story-steps{min-height:170px}.m-story-n{font-size:52px}.m-story-steps h3{margin-top:6px}}',

    // ---------- B ----------
    '[data-variant=b] .cats ul{position:relative}',
    '[data-variant=b] .cats a{border-bottom-color:transparent!important}',
    '.m-ind{position:absolute;left:0;bottom:12px;height:1px;width:0;background:currentColor;pointer-events:none;transition:transform .45s var(--m-ease),width .45s var(--m-ease)}',
    '[data-variant=b] .item .ph img{transition:transform 1.2s var(--m-ease)}',
    '[data-variant=b] .item:hover .ph:not(.empty) img{transform:scale(1.045)}',
    '[data-variant=b] .item .ph:not(.empty){cursor:zoom-in}',
    '.m-fly{position:fixed;z-index:90;overflow:hidden;background:var(--brown-deep);pointer-events:none}',
    '.m-fly img{width:100%;height:100%;object-fit:cover}',
    '.m-fly i{position:absolute;inset:0;background:linear-gradient(0deg,rgba(46,33,25,.55),transparent 55%);opacity:0}',
    '.m-progress{position:relative;height:1px;margin-top:18px;background:rgba(246,239,229,.22);overflow:hidden}',
    '.m-progress i{position:absolute;left:0;top:0;bottom:0;background:var(--cream)}',
    '[data-variant=b] .rail{scrollbar-width:none}',
    '[data-variant=b] .rail::-webkit-scrollbar{display:none}',
    '.rail.m-drag{cursor:grab}',
    '.rail.m-dragging{cursor:grabbing;scroll-snap-type:none;user-select:none}',
    '[data-variant=b] .projects.m-pinned{height:100vh;height:100svh;padding-block:0;display:flex;align-items:center;overflow:hidden}',
    '[data-variant=b] .projects.m-pinned .rail{overflow:visible;scroll-snap-type:none;will-change:transform}',
    '[data-variant=b] .projects.m-pinned .rail.m-drag{cursor:auto}',
    '.m-qv{position:fixed;inset:0;z-index:95;display:grid;place-items:center}',
    '.m-qv[hidden]{display:none}',
    '.m-qv-scrim{position:absolute;inset:0;background:rgba(46,33,25,.64)}',
    '.m-qv-sheet{position:relative;width:min(1080px,100% - 2 * var(--gutter));height:min(620px,88vh);background:var(--cream);color:var(--brown);display:grid;grid-template-columns:1.1fr 1fr}',
    '.m-qv-slot{position:relative;background:var(--limestone);overflow:hidden}',
    '.m-qv-slot img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
    '.m-qv-info{display:flex;flex-direction:column;justify-content:center;align-items:flex-start;padding:clamp(28px,4vw,64px)}',
    '.m-qv-info h3{font:400 clamp(32px,3.4vw,48px)/1.08 var(--serif)}',
    '.m-qv-meta{color:var(--ink-soft);font-size:14px;margin-top:10px}',
    '.m-qv-text{margin:26px 0 34px;max-width:36ch;font-size:16px}',
    '.m-qv-close{position:absolute;top:12px;right:12px;background:none;border:0;padding:10px 12px;font:500 14px var(--sans);color:var(--brown);cursor:pointer;text-decoration:underline;text-underline-offset:5px}',
    '.m-qv-fly{position:fixed;z-index:97;object-fit:cover;pointer-events:none}',
    '@media (max-width:760px){.m-qv{place-items:end stretch}.m-qv-sheet{width:100%;height:auto;max-height:92vh;max-height:92svh;grid-template-columns:1fr;grid-template-rows:44vh auto;overflow:auto}.m-qv-info{padding:24px var(--gutter) 32px}.m-qv-close{background:var(--cream)}}',

    // ---------- C ----------
    '@keyframes m-rise{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}}',
    'html.m-intro .triptych .frame{animation-play-state:paused}',
    '.m-door{position:fixed;inset:0;z-index:200;background:var(--cream);cursor:pointer}',
    '.m-door svg{display:block;width:100%;height:100%}',
    '[data-variant=c] .m-watch .frame{clip-path:inset(100% 0 0 0)}',
    '[data-variant=c] .m-watch.m-in .frame{animation:m-rise 1.4s var(--m-ease) var(--d,0s) forwards}',
    '[data-variant=c] .m-watch.m-in .f2{animation-delay:calc(var(--d,0s) + .16s)}',
    '[data-variant=c] .m-watch.m-in .f3{animation-delay:calc(var(--d,0s) + .32s)}',
    '[data-variant=c] .dir .portal .frame{transition:inset .7s var(--m-ease)}',
    '[data-variant=c] .dir:hover .portal .f1,[data-variant=c] .dir:focus-visible .portal .f1{inset:-5px -5px 0}',
    '[data-variant=c] .dir:hover .portal .f2,[data-variant=c] .dir:focus-visible .portal .f2{inset:-27px -27px 0}',
    '[data-variant=c] .dir .portal img{transition:transform 1s var(--m-ease)}',
    '[data-variant=c] .quality img{will-change:transform}',
    '.m-enf{display:flex;flex-direction:column;padding-block:clamp(36px,7vh,80px) clamp(18px,4vh,40px)}',
    '[data-variant=c] .m-enf .center-head{margin-bottom:clamp(14px,3vh,32px)}',
    '.m-enf-stage{position:relative;flex:1;min-height:0;overflow:hidden}',
    '.m-enf-floor{position:absolute;inset:0;width:100%;height:100%;overflow:visible}',
    '.m-enf-floor line{stroke:rgba(64,47,37,.2);stroke-width:1}',
    '.m-enf-door{position:absolute;bottom:0;border:2px solid var(--walnut);border-bottom:0;will-change:transform,opacity}',
    '.m-enf-door::before{content:"";position:absolute;inset:14px 14px 0;border:1px solid rgba(107,74,51,.38);border-bottom:0}',
    '.m-enf-c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 12%}',
    '.m-enf-n{font:400 clamp(64px,11vh,128px)/1 var(--serif);color:var(--walnut)}',
    '.m-enf-h{font:500 clamp(28px,3.2vw,46px)/1.1 var(--serif);margin-top:14px}',
    '.m-enf-p{color:var(--ink-soft);margin-top:12px;font-size:17px;max-width:28ch}',
    '.m-enf-nav{position:relative;display:flex;justify-content:center;flex-wrap:wrap;gap:6px clamp(12px,2.2vw,34px);margin-top:clamp(12px,2.4vh,26px);padding-top:12px;border-top:1px solid var(--line);font-size:13px;color:var(--ink-soft)}',
    '.m-enf-nav span{opacity:.5;transition:opacity .4s,color .4s}',
    '.m-enf-nav span.m-act{opacity:1;color:var(--brown)}',
    '.m-enf-nav b{font:500 16px/1 var(--serif);margin-right:6px}',
    '.m-enf-nav em{font-style:normal}',
    '.m-enf-prog{position:absolute;left:0;top:-1px;height:2px;width:100%;background:var(--brown);transform-origin:left;transform:scaleX(0)}',
    '@media (max-width:640px){.m-enf-nav em{display:none}.m-enf-p{font-size:15px}.m-enf-c{padding:0 9%}}',

    // ---------- D ----------
    '[data-variant=d] .hero .frame img{transition:filter 1.6s var(--m-ease)}',
    '[data-variant=d] .hero .frame img.m-dim{filter:brightness(.2) saturate(.55)}',
    '.m-lit{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 60%;pointer-events:none;' +
      '-webkit-mask-image:radial-gradient(circle var(--r,0px) at var(--x,50%) var(--y,50%),#000 35%,rgba(0,0,0,.5) 62%,transparent 100%);' +
      'mask-image:radial-gradient(circle var(--r,0px) at var(--x,50%) var(--y,50%),#000 35%,rgba(0,0,0,.5) 62%,transparent 100%)}',
    '.m-glow{position:absolute;inset:0;pointer-events:none;mix-blend-mode:soft-light;transition:opacity 1.4s;' +
      'background:radial-gradient(circle calc(var(--r,0px) * .9) at var(--x,50%) var(--y,50%),rgba(255,190,120,.6),transparent 70%)}',
    '[data-variant=d] .capsule .photo{position:relative}',
    '[data-variant=d] .capsule.m-pinned{height:100vh;height:100svh;padding-block:0;display:flex;align-items:center}',
    '[data-variant=d] .capsule.m-pinned .wrap{align-items:center}',
    '[data-variant=d] .capsule.m-pinned .photo .m-cap-base{height:min(76vh,680px);aspect-ratio:auto}',
    '[data-variant=d] .capsule .photo .m-cap-l{position:absolute;inset:0;width:100%;height:100%;aspect-ratio:auto;object-fit:cover;visibility:hidden}',
    '.m-cap-edge{position:absolute;top:0;bottom:0;width:2px;margin-left:-1px;background:linear-gradient(transparent,rgba(246,239,229,.9),transparent);opacity:0;pointer-events:none}',
    '[data-variant=d] .capsule ul{position:relative}',
    '.m-cap-bar{position:absolute;left:-22px;top:0;bottom:0;width:1px;background:var(--sand);transform-origin:top;transform:scaleY(0)}',
    '[data-variant=d] .capsule li{transition:opacity .5s var(--m-ease)}',
    '[data-variant=d] .capsule.m-sel li{opacity:.4}',
    '[data-variant=d] .capsule.m-sel li.m-act{opacity:1}',
    '[data-variant=d] .capsule li h3{transition:transform .5s var(--m-ease)}',
    '[data-variant=d] .capsule li.m-act h3{transform:translateX(10px)}',
    '.m-swap{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s var(--m-ease)}',
    '.m-swap.m-show{opacity:1}',
    '[data-variant=d] .capsule:not(.m-pinned) li:hover h3{transform:translateX(8px)}',
    '[data-variant=d] .closeup{position:relative;overflow:hidden}',
    '[data-variant=d] .closeup .wrap{position:relative;z-index:1}',
    '.m-sun{position:absolute;left:50%;bottom:0;width:130vw;aspect-ratio:1;margin-left:-65vw;border-radius:50%;pointer-events:none;' +
      'background:radial-gradient(circle,rgba(255,206,150,.55),rgba(255,206,150,.18) 38%,rgba(255,206,150,0) 62%)}',
    '.m-float{position:fixed;left:0;top:0;width:280px;height:190px;z-index:60;pointer-events:none;overflow:hidden;opacity:0;transition:opacity .35s var(--m-ease)}',
    '.m-float img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}',
    '.m-float.m-show{opacity:1}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- помощники ----------
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function smooth(t) { return t * t * (3 - 2 * t); }
  function easeIO(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  function seg(v, a, b) { return clamp((v - a) / (b - a), 0, 1); }
  function px(v) { return v.toFixed(1) + 'px'; }
  // Прогресс 0..1 превращается в номер шага 0..n-1 с паузой на каждом шаге
  function staged(p, n, dwell) {
    var u = clamp(p, 0, 1) * (n - 1), i = Math.floor(u);
    if (i >= n - 1) return n - 1;
    var d = dwell / 2;
    return i + smooth(clamp((u - i - d) / (1 - 2 * d), 0, 1));
  }
  // Насколько элемент прошёл через экран: 0 — только показался снизу, 1 — ушёл вверх
  function through(el) {
    var r = el.getBoundingClientRect(), vh = window.innerHeight;
    return clamp((vh - r.top) / (vh + r.height), 0, 1);
  }
  function once(els, cb, margin) {
    if (!('IntersectionObserver' in window)) { els.forEach(cb); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); cb(e.target); } });
    }, { rootMargin: margin || '0px 0px -12% 0px' });
    els.forEach(function (el) { io.observe(el); });
  }
  function onScroll(fn) {
    var queued = false;
    function run() { queued = false; fn(); }
    window.addEventListener('scroll', function () { if (!queued) { queued = true; requestAnimationFrame(run); } }, { passive: true });
    window.addEventListener('resize', fn);
    fn();
  }
  // Делит заголовок на слова; неразрывный пробел сохраняет пары слов вместе
  function splitWords(el, cls) {
    var text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.textContent = '';
    var parts = text.split(/ +/);
    return parts.map(function (w, i) {
      var outer = document.createElement('span');
      outer.className = cls || 'm-w';
      outer.setAttribute('aria-hidden', 'true');
      var inner = document.createElement('span');
      inner.textContent = w;
      outer.appendChild(inner);
      el.appendChild(outer);
      if (i < parts.length - 1) el.appendChild(document.createTextNode(' '));
      return cls ? outer : inner;
    });
  }
  function riseWords(el, delay, step) {
    return splitWords(el).map(function (w, i) {
      return w.animate([{ transform: 'translateY(108%)' }, { transform: 'none' }],
        { duration: 1100, delay: delay + i * (step || 70), easing: EASE, fill: 'backwards' });
    });
  }
  function fadeIn(el, delay) {
    if (!el) return null;
    return el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
      { duration: 900, delay: delay, easing: EASE, fill: 'backwards' });
  }
  function curtain(els) {
    els.forEach(function (el) { el.classList.add('m-curtain'); });
    once(els, function (el) { el.classList.add('m-in'); });
  }
  function underline(els) { els.forEach(function (el) { el.classList.add('m-ul'); }); }
  function wrapClip(img) {
    var s = document.createElement('span');
    s.className = 'm-clip';
    img.parentNode.insertBefore(s, img);
    s.appendChild(img);
    return s;
  }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }
  // На время вступления прокрутка не двигает страницу, а любое действие ускоряет показ
  function guard(onInput) {
    var stop = function (e) { e.preventDefault(); onInput(); };
    var key = function (e) {
      if (/^(Arrow|Page|Home|End)/.test(e.key) || e.key === ' ') e.preventDefault();
      onInput();
    };
    window.addEventListener('wheel', stop, { passive: false });
    window.addEventListener('touchmove', stop, { passive: false });
    window.addEventListener('keydown', key);
    window.addEventListener('pointerdown', onInput);
    html.classList.add('m-hold'); // признак для плавной прокрутки (smooth.js): страницу сейчас не двигать
    return function () {
      html.classList.remove('m-hold');
      window.removeEventListener('wheel', stop);
      window.removeEventListener('touchmove', stop);
      window.removeEventListener('keydown', key);
      window.removeEventListener('pointerdown', onInput);
    };
  }
  var atTop = window.scrollY < 60 && !location.hash;

  // Закрепление сцены: элемент липнет к верху экрана, пока прокручивается его «запас» высоты
  var pins = [], lastW = window.innerWidth, lastH = window.innerHeight;
  function pin(node, extra, enabled) {
    var sp = el('div', 'm-pin');
    node.parentNode.insertBefore(sp, node);
    sp.appendChild(node);
    var api = { el: node, sp: sp, active: false };
    api.size = function () {
      api.active = !enabled || enabled();
      node.classList.toggle('m-pinned', api.active);
      sp.style.height = '';
      if (api.active) sp.style.height = (node.offsetHeight + extra()) + 'px';
    };
    api.p = function () {
      if (!api.active) return 0;
      var r = sp.getBoundingClientRect(), d = r.height - node.offsetHeight;
      return d > 0 ? clamp(-r.top / d, 0, 1) : 0;
    };
    api.size();
    pins.push(api);
    return api;
  }
  function resizePins() { pins.forEach(function (a) { a.size(); }); }
  window.addEventListener('resize', function () {
    // мобильная адресная строка меняет высоту на несколько десятков пикселей, это не повод пересчитывать
    if (window.innerWidth === lastW && Math.abs(window.innerHeight - lastH) < 140) return;
    lastW = window.innerWidth; lastH = window.innerHeight;
    resizePins();
  });
  function relayout() { resizePins(); window.dispatchEvent(new Event('scroll')); }
  if (document.fonts) document.fonts.ready.then(relayout);
  window.addEventListener('load', relayout);

  // ---------- A «Галерея» ----------
  function variantA() {
    var hero = document.querySelector('.hero'), himg = hero && hero.querySelector('img');
    var htext = hero && hero.querySelector('.wrap');

    // 1. Фото открывается от центра, как створки, заголовок поднимается по словам
    if (himg) {
      var media = el('div', 'm-media');
      himg.parentNode.insertBefore(media, himg);
      media.appendChild(himg);
      media.animate([{ clipPath: 'inset(0 50% 0 50%)' }, { clipPath: 'inset(0 0% 0 0%)' }],
        { duration: 1600, delay: 120, easing: 'cubic-bezier(.7,0,.2,1)', fill: 'backwards' });
      himg.animate([{ transform: 'scale(1.3)' }, { transform: 'none' }],
        { duration: 2600, delay: 120, easing: EASE, fill: 'backwards' });
    }
    var h1 = document.querySelector('.hero h1');
    if (h1) riseWords(h1, 900, 90);
    fadeIn(document.querySelector('.hero p'), 1500);
    fadeIn(document.querySelector('.hero .link-cta'), 1650);

    // 2. При прокрутке фото остаётся на месте и «вешается в раму»: поле вокруг растёт, текст уходит
    if (hero && media) {
      var hp = pin(hero, function () { return window.innerHeight * 0.55; });
      onScroll(function () {
        var top0 = hp.sp.getBoundingClientRect().top + window.scrollY;
        var range = top0 + hp.sp.offsetHeight - hero.offsetHeight;
        var e = smooth(clamp(window.scrollY / range, 0, 1));
        var gx = Math.min(window.innerWidth * 0.06, 96) * e, gy = Math.min(window.innerHeight * 0.08, 72) * e;
        hero.style.clipPath = 'inset(' + px(gy) + ' ' + px(gx) + ')';
        media.style.transform = 'scale(' + (1 - 0.06 * e).toFixed(4) + ')';
        if (htext) {
          htext.style.transform = 'translate3d(0,' + px(-110 * e) + ',0)';
          htext.style.opacity = clamp(1 - e * 1.5, 0, 1).toFixed(3);
        }
      });
    }

    // 3. Главный сценарий: путь заказа в четырёх кадрах, каждый открывается створками
    var plan = document.querySelector('.plan'), photo = plan && plan.querySelector('.plan-photo');
    var h2 = plan && plan.querySelector('.h2');
    if (photo && h2) {
      var dir = (photo.currentSrc || photo.src).replace(/[^\/]*$/, '');
      var STEPS = [
        ['materials-plan.jpg', 'Планировка', 'Замер и решение по зонам: где жить, где хранить, где принимать гостей.'],
        ['materials.jpg', 'Материалы', 'Ткань, дерево и камень в руках, а не на экране.'],
        ['craftsman.jpg', 'Мебель', 'Готовая или по размерам проекта, по утверждённому образцу.'],
        ['interior-arches.jpg', 'Дом', 'Привозим, собираем и принимаем вместе с вами.']
      ];
      var scene = el('div', 'm-story m-scene');
      var stage = el('div', 'm-story-stage');
      stage.setAttribute('aria-hidden', 'true');
      var txt = el('div', 'm-story-txt');
      var list = el('ol', 'm-story-steps');
      var bar = el('div', 'm-story-bar');
      bar.setAttribute('aria-hidden', 'true');
      var layers = [], items = [], fills = [];
      STEPS.forEach(function (s, i) {
        var L = el('div', 'm-story-l'), im = el('img');
        im.src = dir + s[0]; im.alt = ''; im.decoding = 'async';
        L.appendChild(im); stage.appendChild(L); layers.push(L);
        var li = el('li');
        li.appendChild(el('span', 'm-story-n', String(i + 1)));
        li.appendChild(el('h3', '', s[1]));
        li.appendChild(el('p', '', s[2]));
        list.appendChild(li); items.push(li);
        var seg_ = el('i'), b = el('b');
        seg_.appendChild(b); bar.appendChild(seg_); fills.push(b);
      });
      txt.appendChild(list); txt.appendChild(bar);
      h2.parentNode.insertBefore(scene, h2);
      scene.appendChild(h2); scene.appendChild(stage); scene.appendChild(txt);
      photo.style.display = 'none';

      var sp = pin(scene, function () { return window.innerHeight * 2.6; });
      onScroll(function () {
        var a = staged(sp.p(), STEPS.length, 0.36), act = Math.round(a);
        layers.forEach(function (L, i) {
          var open = i === 0 ? 1 : clamp(a - (i - 1), 0, 1);
          var next = clamp(a - i, 0, 1);
          L.style.visibility = open <= 0 ? 'hidden' : '';
          L.style.clipPath = i === 0 ? '' : 'inset(0 ' + (50 * (1 - open)).toFixed(2) + '% 0 ' + (50 * (1 - open)).toFixed(2) + '%)';
          L.firstChild.style.transform = 'scale(' + (1.24 - 0.24 * open + 0.06 * next).toFixed(4) + ')';
          L.style.filter = next > 0 ? 'brightness(' + (1 - 0.35 * next).toFixed(3) + ')' : '';
        });
        items.forEach(function (li, i) {
          li.classList.toggle('m-act', i === act);
          li.classList.toggle('m-past', i < act);
        });
        fills.forEach(function (b, i) { b.style.transform = 'scaleX(' + clamp(a + 1 - i, 0, 1).toFixed(3) + ')'; });
      });
    }

    curtain($$('.quality img, .partners img'));
    underline($$('.triad a, .dirs a, .product a'));

    // 4. Карточки каталога развешаны со сдвигом и движутся с разной скоростью
    var products = $$('.products .product');
    if (products.length) onScroll(function () {
      var wide = window.innerWidth >= 960;
      products.forEach(function (p, i) {
        if (!wide || i % 2 === 0) { p.style.transform = ''; return; }
        p.style.transform = 'translate3d(0,' + px((0.5 - through(p)) * 110 + 40) + ',0)';
      });
    });

    // 5. Страны въезжают с разных сторон и встают в колонку
    var geo = document.querySelector('.geo .countries');
    if (geo) {
      var spans = $$('span', geo), from = [-1, 1, -1];
      onScroll(function () {
        var r = geo.getBoundingClientRect(), vh = window.innerHeight;
        spans.forEach(function (s, i) {
          var e = easeOut(clamp((vh - r.top) / (vh * 0.75) - i * 0.12, 0, 1));
          s.style.transform = 'translate3d(' + (from[i] * (1 - e) * 38).toFixed(2) + 'vw,0,0)';
          s.style.opacity = (0.1 + 0.9 * e).toFixed(3);
        });
      });
    }

    // 6. Фон заявки движется медленнее страницы
    var bg = document.querySelector('.cta .bg');
    if (bg) onScroll(function () {
      bg.style.transform = 'translate3d(0,' + px((through(bg.parentNode) - 0.5) * -120) + ',0) scale(1.18)';
    });

    // Шапка прячется при прокрутке вниз и возвращается при прокрутке вверх
    var header = document.querySelector('.header'), last = window.scrollY;
    if (header) onScroll(function () {
      var y = window.scrollY;
      if (header.querySelector('details[open]')) { last = y; return; }
      if (y > 240 && y > last + 4) header.classList.add('m-hide');
      else if (y < last - 4 || y < 240) header.classList.remove('m-hide');
      last = y;
    });
  }

  // ---------- B «Витрина» ----------
  function variantB() {
    // 1. Первый кадр на весь экран, потом он «встаёт в витрину» на своё место в мозаике
    var big = document.querySelector('.mosaic .big'), bimg = big && big.querySelector('img');
    var tiles = $$('.mosaic a:not(.big)'), bh1 = document.querySelector('.mosaic h1');
    var revealTiles = function (start) {
      return tiles.map(function (a, i) {
        var img = a.querySelector('img'), d = start + i * 110;
        if (img) img.animate([{ transform: 'scale(1.16)' }, { transform: 'none' }], { duration: 1700, delay: d, easing: EASE, fill: 'backwards' });
        return a.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
          { duration: 1050, delay: d, easing: EASE, fill: 'backwards' });
      });
    };
    if (bimg && atTop) {
      var HOLD = 600, MORPH = 1300;
      var fly = el('div', 'm-fly'), fimg = el('img'), grad = el('i');
      fly.setAttribute('aria-hidden', 'true');
      fimg.src = bimg.currentSrc || bimg.src; fimg.alt = '';
      fimg.style.objectPosition = getComputedStyle(bimg).objectPosition;
      fly.appendChild(fimg); fly.appendChild(grad);
      fly.style.cssText = 'left:0;top:0;width:100%;height:100vh';
      document.body.appendChild(fly);
      big.style.visibility = 'hidden';
      var anims = revealTiles(HOLD + MORPH * 0.55);
      anims.push(fimg.animate([{ transform: 'scale(1.16)' }, { transform: 'scale(1)' }],
        { duration: HOLD + MORPH, easing: EASE, fill: 'forwards' }));
      var speed = 1, vt = 0, prev = performance.now();
      var release = guard(function () { if (speed === 1) { speed = 4; anims.forEach(function (a) { a.playbackRate = 4; }); } });
      var frame = function (now) {
        vt += (now - prev) * speed; prev = now;
        var tt = clamp((vt - HOLD) / MORPH, 0, 1), e = easeIO(tt);
        var r = big.getBoundingClientRect(), W = html.clientWidth, H = window.innerHeight;
        fly.style.left = px(lerp(0, r.left, e));
        fly.style.top = px(lerp(0, r.top, e));
        fly.style.width = px(lerp(W, r.width, e));
        fly.style.height = px(lerp(H, r.height, e));
        grad.style.opacity = e.toFixed(3);
        if (tt < 1) { requestAnimationFrame(frame); return; }
        big.style.visibility = '';
        fly.remove();
        release();
        if (bh1) riseWords(bh1, 60, 80);
      };
      requestAnimationFrame(function (now) { prev = now; frame(now); });
    } else {
      revealTiles(120);
      if (bh1) riseWords(bh1, 700, 80);
    }

    // Линия-указатель в полосе категорий
    var ul = document.querySelector('.cats ul');
    if (ul) {
      var ind = el('span', 'm-ind');
      ul.appendChild(ind);
      var links = $$('a', ul);
      var current = ul.querySelector('a[aria-current]') || links[0];
      var place = function (a) { ind.style.width = a.offsetWidth + 'px'; ind.style.transform = 'translateX(' + a.offsetLeft + 'px)'; };
      links.forEach(function (a) {
        a.addEventListener('mouseenter', function () { place(a); });
        a.addEventListener('focus', function () { place(a); });
        a.addEventListener('click', function () {
          links.forEach(function (x) { x.removeAttribute('aria-current'); });
          a.setAttribute('aria-current', 'page');
          current = a; place(a);
        });
      });
      ul.addEventListener('mouseleave', function () { place(current); });
      window.addEventListener('resize', function () { place(current); });
      if (document.fonts) document.fonts.ready.then(function () { place(current); });
      place(current);
    }

    // Фильтр по стране: карточки плавно переезжают на новые места (FLIP)
    var filters = document.querySelector('.filters');
    if (filters) filters.addEventListener('click', function (e) {
      if (!e.target.closest('button')) return;
      var items = $$('.grid .item'), before = new Map();
      items.forEach(function (it) { if (!it.hidden) before.set(it, it.getBoundingClientRect()); });
      requestAnimationFrame(function () {
        var k = 0;
        items.forEach(function (it) {
          if (it.hidden) return;
          var now = it.getBoundingClientRect(), was = before.get(it);
          if (was) {
            var dx = was.left - now.left, dy = was.top - now.top;
            if (dx || dy) it.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px)' }, { transform: 'none' }],
              { duration: 650, easing: EASE });
          } else {
            it.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }],
              { duration: 550, delay: 120 + k++ * 50, easing: EASE, fill: 'backwards' });
          }
        });
      });
    }, true);

    underline($$('.item a'));

    // 2. Карточка открывается крупно: фото перелетает из сетки в окно с описанием
    quickView();

    // 3. Проекты: на широком экране секция встаёт, лента едет вбок вместе с прокруткой
    var proj = document.querySelector('.projects'), rail = proj && proj.querySelector('.rail');
    if (rail) {
      var bar = el('div', 'm-progress'), fillBar = el('i');
      bar.setAttribute('aria-hidden', 'true');
      bar.appendChild(fillBar);
      rail.after(bar);
      var imgs = $$('img', rail);
      imgs.forEach(function (im) { wrapClip(im); im.draggable = false; });
      var shift = 0;
      var rp = pin(proj, function () {
        rail.style.transform = '';
        var rr = rail.getBoundingClientRect(), lr = rail.lastElementChild.getBoundingClientRect();
        shift = Math.max(0, lr.right - rr.right);
        return shift * 1.1 + window.innerHeight * 0.4;
      }, function () { return window.innerWidth >= 900; });
      var showBar = function (share, pos) {
        bar.style.visibility = share >= 0.995 ? 'hidden' : '';
        fillBar.style.width = (share * 100) + '%';
        fillBar.style.transform = 'translateX(' + (pos * (1 / share - 1) * 100) + '%)';
      };
      var update = function () {
        if (rp.active) {
          var qq = seg(rp.p(), 0.12, 0.88);
          rail.style.transform = 'translate3d(' + px(-qq * shift) + ',0,0)';
          var cx = window.innerWidth / 2;
          imgs.forEach(function (im) {
            var r = im.parentNode.getBoundingClientRect();
            var d = (r.left + r.width / 2 - cx) / window.innerWidth;
            im.style.transform = 'translate3d(' + px(-d * 70) + ',0,0) scale(1.2)';
          });
          showBar(rail.clientWidth / (rail.clientWidth + shift), qq);
        } else {
          rail.style.transform = '';
          imgs.forEach(function (im) { im.style.transform = ''; });
          var max = rail.scrollWidth - rail.clientWidth;
          showBar(rail.clientWidth / rail.scrollWidth, max ? rail.scrollLeft / max : 0);
        }
      };
      rail.addEventListener('scroll', update, { passive: true });
      onScroll(update);
      // На узком экране с мышью ленту можно тянуть
      if (finePointer) {
        rail.classList.add('m-drag');
        var startX = 0, startLeft = 0, dragging = false;
        rail.addEventListener('pointerdown', function (e) {
          if (e.pointerType !== 'mouse' || rp.active) return;
          dragging = true; startX = e.clientX; startLeft = rail.scrollLeft;
          rail.classList.add('m-dragging'); rail.setPointerCapture(e.pointerId);
        });
        rail.addEventListener('pointermove', function (e) { if (dragging) rail.scrollLeft = startLeft - (e.clientX - startX); });
        var stopDrag = function () { if (!dragging) return; dragging = false; rail.classList.remove('m-dragging'); };
        rail.addEventListener('pointerup', stopDrag);
        rail.addEventListener('pointercancel', stopDrag);
      }
    }
  }

  function quickView() {
    var cards = $$('.grid .item').filter(function (it) { return it.querySelector('.ph:not(.empty) img'); });
    if (!cards.length) return;
    var dlg = el('div', 'm-qv');
    dlg.hidden = true;
    dlg.setAttribute('role', 'dialog');
    dlg.setAttribute('aria-modal', 'true');
    dlg.setAttribute('aria-labelledby', 'm-qv-t');
    dlg.innerHTML = '<div class="m-qv-scrim"></div><div class="m-qv-sheet"><div class="m-qv-slot"></div>' +
      '<div class="m-qv-info"><h3 id="m-qv-t"></h3><p class="m-qv-meta"></p>' +
      '<p class="m-qv-text">Размер, ткань и оттенок дерева подбираем под ваш интерьер. До оплаты покажем образцы и согласуем цену и срок.</p>' +
      '<a class="link-cta" href="#contact">Запросить расчёт</a></div>' +
      '<button class="m-qv-close" type="button">Закрыть</button></div>';
    document.body.appendChild(dlg);
    var scrim = dlg.querySelector('.m-qv-scrim'), sheet = dlg.querySelector('.m-qv-sheet');
    var slot = dlg.querySelector('.m-qv-slot'), info = dlg.querySelector('.m-qv-info');
    var title = dlg.querySelector('h3'), meta = dlg.querySelector('.m-qv-meta');
    var cta = dlg.querySelector('.link-cta'), closeBtn = dlg.querySelector('.m-qv-close');
    var src = null, opener = null, busy = false;

    function flight(from, to, url, done) {
      var f = el('img', 'm-qv-fly');
      f.src = url; f.alt = '';
      document.body.appendChild(f);
      var rect = function (r) { return { left: px(r.left), top: px(r.top), width: px(r.width), height: px(r.height) }; };
      f.animate([rect(from), rect(to)], { duration: 760, easing: 'cubic-bezier(.65,0,.2,1)', fill: 'forwards' })
        .onfinish = function () { done(); f.remove(); };
    }
    function lock(onoff) {
      if (onoff) {
        var gap = window.innerWidth - html.clientWidth;
        html.style.overflow = 'hidden';
        if (gap) document.body.style.paddingRight = gap + 'px';
      } else { html.style.overflow = ''; document.body.style.paddingRight = ''; }
    }
    function open(card) {
      if (busy) return;
      busy = true;
      opener = card.querySelector('.ph');
      src = opener.querySelector('img');
      title.textContent = card.querySelector('h3').textContent;
      var m = card.querySelector('.meta');
      meta.textContent = m ? m.textContent : '';
      slot.textContent = '';
      lock(true);
      dlg.hidden = false;
      var from = src.getBoundingClientRect(), to = slot.getBoundingClientRect(), url = src.currentSrc || src.src;
      src.style.visibility = 'hidden';
      scrim.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 450, easing: 'ease-out' });
      sheet.animate([{ opacity: 0, transform: 'translateY(24px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 120, easing: EASE, fill: 'backwards' });
      Array.prototype.forEach.call(info.children, function (c, i) {
        c.animate([{ opacity: 0, transform: 'translateY(18px)' }, { opacity: 1, transform: 'none' }], { duration: 700, delay: 380 + i * 80, easing: EASE, fill: 'backwards' });
      });
      flight(from, to, url, function () {
        var im = el('img'); im.src = url; im.alt = src.alt;
        slot.appendChild(im);
        busy = false;
      });
      closeBtn.focus({ preventScroll: true });
    }
    function close(after) {
      if (busy || dlg.hidden) return;
      busy = true;
      var im = slot.querySelector('img');
      var finish = function () {
        dlg.hidden = true; lock(false);
        src.style.visibility = '';
        busy = false;
        if (opener) opener.focus({ preventScroll: true });
        if (after) after();
      };
      scrim.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 500, easing: 'ease-in', fill: 'forwards' });
      sheet.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' });
      if (im) {
        var from = im.getBoundingClientRect();
        im.style.visibility = 'hidden';
        flight(from, src.getBoundingClientRect(), im.src, function () {
          dlg.getAnimations({ subtree: true }).forEach(function (a) { a.cancel(); });
          finish();
        });
      } else finish();
    }
    cards.forEach(function (card) {
      var ph = card.querySelector('.ph');
      ph.setAttribute('role', 'button');
      ph.setAttribute('tabindex', '0');
      ph.setAttribute('aria-label', 'Подробнее: ' + card.querySelector('h3').textContent);
      ph.addEventListener('click', function () { open(card); });
      ph.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(card); }
      });
    });
    closeBtn.addEventListener('click', function () { close(); });
    scrim.addEventListener('click', function () { close(); });
    cta.addEventListener('click', function (e) {
      e.preventDefault();
      close(function () {
        var c = document.getElementById('contact');
        if (c) c.scrollIntoView({ behavior: 'smooth' });
      });
    });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { close(); return; }
      if (e.key !== 'Tab') return;
      var f = [cta, closeBtn];
      var i = f.indexOf(document.activeElement);
      if (e.shiftKey && i <= 0) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && i === f.length - 1) { e.preventDefault(); f[0].focus(); }
    });
  }

  // ---------- C «Проём» ----------
  function variantC() {
    var h1 = document.querySelector('.hero h1');
    var reveal = function (d) {
      html.classList.remove('m-intro');
      if (h1) riseWords(h1, d, 80);
      fadeIn(document.querySelector('.hero .sub'), d + 500);
      $$('.triptych .portal img').forEach(function (im, i) {
        im.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
          { duration: 1500, delay: d + (i === 1 ? 150 : 420), easing: EASE, fill: 'backwards' });
      });
      fadeIn(document.querySelector('.hero .cta-row'), d + 1100);
    };

    // 1. Вступление: знак рисуется тремя линиями, в проёме появляется гостиная, и мы входим внутрь
    var center = document.querySelector('.triptych .center img');
    if (center && atTop) doorIntro(center.currentSrc || center.src, reveal);
    else reveal(300);

    // Рамки остальных проёмов вырастают, когда доходят до экрана
    var portals = $$('.dirs .portal, .partners .portal, .contact .portal');
    portals.forEach(function (p) {
      p.classList.add('m-watch');
      var dir = p.closest('.dir');
      if (dir) p.style.setProperty('--d', ($$('.dirs .dir').indexOf(dir) * 0.14) + 's');
    });
    once(portals, function (p) { p.classList.add('m-in'); }, '0px 0px -18% 0px');

    // 2. Главный сценарий: путь проходится анфиладой проёмов, на каждом шаге — пауза
    enfilade();

    // 3. В направлениях фото внутри проёма чуть смещается за курсором
    if (finePointer) $$('.dirs .dir').forEach(function (dir) {
      var img = dir.querySelector('.portal img');
      if (!img) return;
      wrapClip(img);
      dir.addEventListener('mousemove', function (e) {
        var r = dir.getBoundingClientRect();
        var dx = (e.clientX - r.left) / r.width - 0.5, dy = (e.clientY - r.top) / r.height - 0.5;
        img.style.transform = 'translate3d(' + px(-dx * 22) + ',' + px(-dy * 22) + ',0) scale(1.1)';
      });
      dir.addEventListener('mouseleave', function () { img.style.transform = ''; });
    });

    // 4. Крупные планы у цитаты движутся навстречу друг другу
    var qimgs = $$('.quality img');
    if (qimgs.length) onScroll(function () {
      var narrow = window.innerWidth <= 640;
      qimgs.forEach(function (im, i) {
        im.style.transform = narrow ? '' : 'translate3d(0,' + px((through(im) - 0.5) * (i % 2 ? 90 : -90)) + ',0)';
      });
    });

    underline($$('.dirs-more a'));

    // После отправки заявки рамки заново вырастают вокруг благодарности
    var form = document.querySelector('.contact form');
    if (form) form.addEventListener('submit', function () {
      var p = form.closest('.portal');
      if (!p) return;
      p.classList.remove('m-in');
      void p.offsetWidth;
      p.classList.add('m-in');
      fadeIn(form.querySelector('.form-done'), 500);
    });
  }

  function doorIntro(src, reveal) {
    html.classList.add('m-intro');
    var vw = html.clientWidth, vh = window.innerHeight, NS = 'http://www.w3.org/2000/svg';
    var k = Math.min(vw * (vw < 700 ? 0.64 : 0.44), vh * 0.62, 440) / 520;
    // центр проёма (260; 298,5 в координатах знака) ставим в центр экрана, туда же и «входим»
    var cx = vw / 2, cy = vh / 2, ox = cx - 260 * k, oy = cy - 298.5 * k;
    var ov = el('div', 'm-door');
    ov.setAttribute('aria-hidden', 'true');
    var arch = function (d, w) {
      return '<path d="' + d + '" fill="none" stroke="#6B4A33" stroke-width="' + w + '" pathLength="1" stroke-dasharray="1 1" stroke-dashoffset="1"/>';
    };
    ov.innerHTML = '<svg xmlns="' + NS + '" viewBox="0 0 ' + vw + ' ' + vh + '" preserveAspectRatio="xMidYMid slice">' +
      '<defs><clipPath id="m-hole"><rect x="164" y="164" width="192" height="269"/></clipPath></defs>' +
      '<g transform="translate(' + ox.toFixed(2) + ' ' + oy.toFixed(2) + ') scale(' + k.toFixed(5) + ')">' +
      '<image href="' + src + '" x="164" y="164" width="192" height="269" preserveAspectRatio="xMidYMid slice" clip-path="url(#m-hole)" opacity="0"/>' +
      arch('M16 433V16H504V433', 32) + arch('M85 433V88H435V433', 30) + arch('M150.5 409V150.5H369.5V409', 27) +
      '</g></svg>';
    document.body.appendChild(ov);
    var svg = ov.firstChild, image = svg.querySelector('image');
    var anims = $$('path', svg).map(function (p, i) {
      return p.animate([{ strokeDashoffset: '1px' }, { strokeDashoffset: '0px' }],
        { duration: 1150, delay: 150 + i * 230, easing: 'cubic-bezier(.6,0,.25,1)', fill: 'forwards' });
    });
    anims.push(image.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 750, delay: 1150, easing: 'ease-out', fill: 'forwards' }));

    var S = Math.max(vw / (192 * k), vh / (269 * k)) * 1.35, zooming = false, revealed = false;
    var zoom = function (dur) {
      if (zooming) return;
      zooming = true;
      anims.forEach(function (a) { a.finish(); });
      var t0 = performance.now();
      var step = function (now) {
        var tt = clamp((now - t0) / dur, 0, 1), s = Math.exp(Math.log(S) * tt * tt);
        var w = vw / s, h = vh / s;
        svg.setAttribute('viewBox', (cx - w / 2).toFixed(2) + ' ' + (cy - h / 2).toFixed(2) + ' ' + w.toFixed(2) + ' ' + h.toFixed(2));
        ov.style.opacity = (1 - seg(tt, 0.7, 1)).toFixed(3);
        if (!revealed && tt > 0.62) { revealed = true; reveal(0); }
        if (tt < 1) requestAnimationFrame(step);
        else { ov.remove(); release(); }
      };
      requestAnimationFrame(step);
    };
    var timer = setTimeout(function () { zoom(1350); }, 2050);
    var release = guard(function () { clearTimeout(timer); zoom(800); });
  }

  function enfilade() {
    var path = document.querySelector('.path'), ol = path && path.querySelector('ol');
    var head = path && path.querySelector('.center-head');
    if (!ol || !head) return;
    var data = $$('li', ol).map(function (li) {
      return [li.querySelector('.n').textContent, li.querySelector('h3').textContent, li.querySelector('p').textContent];
    });
    var scene = el('div', 'm-enf m-scene');
    var stage = el('div', 'm-enf-stage'), nav = el('div', 'm-enf-nav'), prog = el('i', 'm-enf-prog');
    stage.setAttribute('aria-hidden', 'true');
    nav.setAttribute('aria-hidden', 'true');
    var NS = 'http://www.w3.org/2000/svg';
    var floor = document.createElementNS(NS, 'svg');
    floor.setAttribute('class', 'm-enf-floor');
    var lines = [0, 1, 2, 3].map(function () { var l = document.createElementNS(NS, 'line'); floor.appendChild(l); return l; });
    stage.appendChild(floor);
    var doors = data.map(function (d, i) {
      var door = el('div', 'm-enf-door'), c = el('div', 'm-enf-c');
      c.appendChild(el('div', 'm-enf-n', d[0]));
      c.appendChild(el('div', 'm-enf-h', d[1]));
      c.appendChild(el('div', 'm-enf-p', d[2]));
      door.appendChild(c);
      door.style.zIndex = String(10 + data.length - i);
      stage.appendChild(door);
      return { door: door, c: c };
    });
    var tabs = data.map(function (d) {
      var s = el('span'); s.appendChild(el('b', '', d[0])); s.appendChild(el('em', '', d[1]));
      nav.appendChild(s); return s;
    });
    nav.appendChild(prog);
    head.parentNode.insertBefore(scene, head);
    scene.appendChild(head); scene.appendChild(stage); scene.appendChild(nav);
    ol.classList.add('m-sr');

    var sw = 0, sh = 0;
    var layout = function () {
      if (stage.clientWidth === sw && stage.clientHeight === sh) return;
      sw = stage.clientWidth; sh = stage.clientHeight;
      var dh = sh * 0.95, dw = Math.min(sw * 0.92, dh * 0.86, 660), vpY = sh * 0.34, left = (sw - dw) / 2;
      doors.forEach(function (o) {
        o.door.style.width = px(dw); o.door.style.height = px(dh); o.door.style.left = px(left);
        o.door.style.transformOrigin = '50% ' + px(vpY - (sh - dh));
      });
      // линии пола и потолка ведут к углам ближнего проёма и сходятся в одну точку за ним,
      // внутри проёма их не рисуем, чтобы не перечёркивать текст шага
      [[left, sh], [left + dw, sh], [left, sh - dh], [left + dw, sh - dh]].forEach(function (pt, i) {
        var dx = sw / 2 - pt[0], dy = vpY - pt[1];
        lines[i].setAttribute('x1', (pt[0] - dx * 3).toFixed(1)); lines[i].setAttribute('y1', (pt[1] - dy * 3).toFixed(1));
        lines[i].setAttribute('x2', pt[0].toFixed(1)); lines[i].setAttribute('y2', pt[1].toFixed(1));
      });
    };
    var sp = pin(scene, function () { return window.innerHeight * 3.6; });
    onScroll(function () {
      layout();
      var a = staged(sp.p(), data.length, 0.3), act = Math.round(a);
      doors.forEach(function (o, i) {
        var z = i - a, s, op;
        if (z >= 0) { s = Math.pow(0.56, z); op = clamp(1 - z * 0.22, 0.08, 1); }
        else { s = 1 - z * 2.6; op = clamp(1 + z * 1.8, 0, 1); }
        o.door.style.transform = 'scale(' + s.toFixed(4) + ')';
        o.door.style.opacity = op.toFixed(3);
        o.door.style.visibility = op < 0.01 ? 'hidden' : '';
        o.c.style.opacity = clamp(1 - Math.abs(z) * 2.4, 0, 1).toFixed(3);
      });
      tabs.forEach(function (s, i) { s.classList.toggle('m-act', i === act); });
      prog.style.transform = 'scaleX(' + (a / (data.length - 1)).toFixed(4) + ')';
    });
  }

  // ---------- D «Вечер» ----------
  function variantD() {
    // 1. В тёмной гостиной горит лампа: пятно света бродит или следует за курсором, потом свет зажигается
    var frame = document.querySelector('.hero .frame'), base = frame && frame.querySelector('img');
    var h1 = document.querySelector('.hero h1'), htext = document.querySelector('.hero .text > div');
    var showText = function (d) {
      if (h1) h1.animate([{ opacity: 0, filter: 'blur(8px)', transform: 'translateY(14px)' }, { opacity: 1, filter: 'blur(0)', transform: 'none' }],
        { duration: 1500, delay: d, easing: EASE, fill: 'backwards' });
      fadeIn(htext, d + 600);
    };
    if (base && window.scrollY < window.innerHeight * 0.5) lamp(frame, base, showText);
    else showText(200);

    // 2. Капсула: на широком экране секция встаёт, фото собирается из предметов коллекции
    capsule();

    // Направления: крупное превью следует за курсором, наклоняется по ходу движения и меняется шторкой
    if (finePointer) {
      var flt = el('div', 'm-float');
      flt.setAttribute('aria-hidden', 'true');
      document.body.appendChild(flt);
      var tx = 0, ty = 0, x = 0, y = 0, raf = 0, shown = '';
      var loop = function () {
        var vx = tx - x;
        x += (tx - x) * 0.14; y += (ty - y) * 0.14;
        flt.style.transform = 'translate3d(' + px(x) + ',' + px(y) + ',0) rotate(' + clamp(vx * 0.06, -7, 7).toFixed(2) + 'deg)';
        raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.3 || flt.classList.contains('m-show')) ? requestAnimationFrame(loop) : 0;
      };
      var setImg = function (url) {
        if (url === shown) return;
        shown = url;
        var im = el('img'); im.src = url; im.alt = '';
        flt.appendChild(im);
        if (flt.children.length > 1) {
          im.animate([{ clipPath: 'inset(0 0 0 100%)', transform: 'scale(1.15)' }, { clipPath: 'inset(0 0 0 0)', transform: 'none' }],
            { duration: 620, easing: EASE }).onfinish = function () {
            while (flt.children.length > 1 && flt.firstChild !== im) flt.removeChild(flt.firstChild);
          };
        }
      };
      $$('.dirs a').forEach(function (a) {
        var im = a.querySelector(':scope > img');
        a.addEventListener('mouseenter', function (e) {
          if (!im) { flt.classList.remove('m-show'); return; }
          if (!flt.classList.contains('m-show')) { x = tx = e.clientX + 28; y = ty = e.clientY - 95; }
          setImg(im.currentSrc || im.src);
          flt.classList.add('m-show');
          if (!raf) raf = requestAnimationFrame(loop);
        });
        a.addEventListener('mousemove', function (e) { tx = e.clientX + 28; ty = e.clientY - 95; });
        a.addEventListener('mouseleave', function () { flt.classList.remove('m-show'); });
      });
    }

    // 3. Светлая полоса «рассветает»: поднимается тёплое солнце, мастер выходит из тени, цитата проявляется по словам
    var sec = document.querySelector('.closeup');
    var quote = sec && sec.querySelector('.quote'), cimg = sec && sec.querySelector('img');
    if (sec) {
      var words = quote ? splitWords(quote, 'm-q') : [];
      var sun = el('div', 'm-sun');
      sun.setAttribute('aria-hidden', 'true');
      sec.insertBefore(sun, sec.firstChild);
      var mix = function (a, b, t) { return 'rgb(' + a.map(function (v, i) { return Math.round(v + (b[i] - v) * t); }).join(',') + ')'; };
      var deep = [46, 33, 25], walnut = [107, 74, 51], sand = [205, 184, 156], cream = [246, 239, 229], brown = [64, 47, 37];
      // через орех и песок палитры, чтобы переход оставался тёплым, а не серым
      var dawn = function (t) {
        if (t < 0.35) return mix(deep, walnut, t / 0.35);
        if (t < 0.7) return mix(walnut, sand, (t - 0.35) / 0.35);
        return mix(sand, cream, (t - 0.7) / 0.3);
      };
      onScroll(function () {
        var vh = window.innerHeight, r = sec.getBoundingClientRect();
        var t = clamp((vh - r.top) / (vh * 0.6), 0, 1);
        sec.style.backgroundColor = dawn(t);
        sec.style.color = t < 0.5 ? 'rgb(246,239,229)' : mix(cream, brown, clamp((t - 0.5) / 0.3, 0, 1));
        sun.style.transform = 'translate3d(0,' + (62 - 70 * t).toFixed(2) + '%,0)';
        sun.style.opacity = (Math.sin(Math.PI * clamp(t * 1.1, 0, 1)) * 0.9 + 0.1 * (1 - t)).toFixed(3);
        if (cimg) cimg.style.filter = t >= 1 ? '' : 'brightness(' + (0.3 + 0.7 * t).toFixed(3) + ') saturate(' + (0.6 + 0.4 * t).toFixed(3) + ')';
        if (quote) {
          var qr = quote.getBoundingClientRect();
          var qq = Math.min(clamp((vh * 0.85 - qr.top) / (vh * 0.4), 0, 1), seg(t, 0.25, 0.85)), n = words.length;
          words.forEach(function (w, i) { w.style.opacity = (0.14 + 0.86 * clamp(qq * n - i, 0, 1)).toFixed(2); });
        }
      });
    }
  }

  function lamp(frame, base, showText) {
    base.style.animation = 'none';
    base.classList.add('m-dim');
    var lit = base.cloneNode();
    lit.className = 'm-lit'; lit.alt = ''; lit.style.animation = 'none';
    lit.removeAttribute('loading');
    lit.setAttribute('aria-hidden', 'true');
    var glow = el('div', 'm-glow');
    glow.setAttribute('aria-hidden', 'true');
    frame.appendChild(lit); frame.appendChild(glow);
    var h1 = document.querySelector('.hero h1'), htext = document.querySelector('.hero .text > div');
    [h1, htext].forEach(function (n) { if (n) n.style.opacity = '0'; });

    var w = frame.clientWidth, h = frame.clientHeight;
    var x = w * 0.5, y = h * 0.56, tx = x, ty = y, r = 0, r0 = 0, R = 1;
    var state = 'lamp', t0 = performance.now(), onAt = 0, lastMove = 0;
    var lightsOn = function () {
      if (state !== 'lamp') return;
      state = 'on'; onAt = performance.now(); r0 = r;
      var far = Math.max(Math.hypot(x, y), Math.hypot(w - x, y), Math.hypot(x, h - y), Math.hypot(w - x, h - y));
      R = far / 0.35 + 20;
      base.classList.remove('m-dim');
      glow.style.opacity = '0';
      [h1, htext].forEach(function (n) { if (n) n.style.opacity = ''; });
      showText(450);
    };
    var loop = function (now) {
      w = frame.clientWidth; h = frame.clientHeight;
      var el_ = now - t0;
      if (state === 'lamp') {
        if (!(finePointer && lastMove && now - lastMove < 1600)) {
          tx = w * (0.5 + 0.3 * Math.sin(el_ / 1150));
          ty = h * (0.54 + 0.16 * Math.sin(el_ / 720 + 1.2));
        }
        x += (tx - x) * 0.07; y += (ty - y) * 0.07;
        r = Math.min(w, h) * 0.5 * easeOut(clamp(el_ / 900, 0, 1)) * (1 + 0.012 * Math.sin(el_ / 85));
        var deadline = lastMove ? Math.min(7000, Math.max(3000, lastMove - t0 + 1500)) : 3000;
        if (el_ > deadline) lightsOn();
      } else {
        r = lerp(r0, R, easeIO(clamp((now - onAt) / 1500, 0, 1)));
        if (now - onAt >= 1500) { lit.remove(); glow.remove(); return; }
      }
      frame.style.setProperty('--x', px(x));
      frame.style.setProperty('--y', px(y));
      frame.style.setProperty('--r', px(r));
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
    if (finePointer) frame.addEventListener('mousemove', function (e) {
      var b = frame.getBoundingClientRect();
      tx = e.clientX - b.left; ty = e.clientY - b.top; lastMove = performance.now();
    });
    frame.addEventListener('click', lightsOn);
    window.addEventListener('keydown', lightsOn, { once: true });
    window.addEventListener('scroll', function s() { if (window.scrollY > 40) { lightsOn(); window.removeEventListener('scroll', s); } }, { passive: true });
  }

  function capsule() {
    var cap = document.querySelector('.capsule'), photo = cap && cap.querySelector('.photo');
    if (!photo) return;
    var baseImg = photo.querySelector('img');
    if (baseImg) baseImg.classList.add('m-cap-base');
    var lis = $$('.capsule li');
    var cp = pin(cap, function () { return window.innerHeight * 2.3; }, function () { return window.innerWidth >= 960; });

    // слои фото: предметы капсулы по очереди; у предмета без снимка показываем всю гостиную целиком
    var layers = lis.map(function (li) {
      var im = li.querySelector(':scope > img') || baseImg, L;
      L = el('img', 'm-cap-l'); L.src = im.currentSrc || im.src; L.alt = '';
      L.setAttribute('aria-hidden', 'true');
      photo.appendChild(L);
      return L;
    });
    var edge = el('div', 'm-cap-edge'), ul = cap.querySelector('ul'), bar = el('i', 'm-cap-bar');
    photo.appendChild(edge);
    if (ul) ul.appendChild(bar);
    onScroll(function () {
      if (!cp.active) {
        layers.forEach(function (L) { L.style.visibility = ''; L.style.clipPath = ''; });
        lis.forEach(function (li) { li.classList.remove('m-act'); });
        cap.classList.remove('m-sel');
        edge.style.opacity = '0';
        return;
      }
      var a = staged(cp.p(), lis.length + 1, 0.34), moving = -1;
      layers.forEach(function (L, i) {
        var e = clamp(a - i, 0, 1);
        L.style.visibility = e <= 0 ? 'hidden' : 'visible';
        L.style.clipPath = 'inset(0 ' + ((1 - e) * 100).toFixed(2) + '% 0 0)';
        L.style.filter = e < 1 ? 'brightness(' + (0.5 + 0.5 * e).toFixed(3) + ')' : '';
        if (e > 0 && e < 1) moving = e;
      });
      edge.style.opacity = moving > 0 ? '1' : '0';
      if (moving > 0) edge.style.left = (moving * 100).toFixed(2) + '%';
      var act = a < 0.5 ? -1 : Math.round(a) - 1;
      lis.forEach(function (li, i) { li.classList.toggle('m-act', i === act); });
      cap.classList.toggle('m-sel', act >= 0);
      bar.style.transform = 'scaleY(' + (a / lis.length).toFixed(4) + ')';
    });

    // На узком экране с мышью: при наведении на предмет большое фото меняется на него
    if (finePointer) {
      var swap = el('img', 'm-swap');
      swap.alt = '';
      photo.appendChild(swap);
      lis.forEach(function (li) {
        var im = li.querySelector(':scope > img');
        li.addEventListener('mouseenter', function () {
          if (cp.active || !im) { swap.classList.remove('m-show'); return; }
          swap.src = im.currentSrc || im.src;
          swap.classList.add('m-show');
        });
      });
      if (ul) ul.addEventListener('mouseleave', function () { swap.classList.remove('m-show'); });
    }
  }

  ({ a: variantA, b: variantB, c: variantC, d: variantD }[variant] || function () {})();
})();
