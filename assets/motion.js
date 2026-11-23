// Демо анимаций для концептов. Включается параметром ?motion в адресе страницы.
// Без параметра страница остаётся спокойной, в плашке концепта появляется переключатель.
// Учитывает системную настройку «уменьшить движение»: тогда анимации не включаются.
(function () {
  var html = document.documentElement;
  var on = /[?&]motion\b/.test(location.search) || html.hasAttribute('data-motion');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var variant = document.body.getAttribute('data-variant');

  // Переключатель в плашке концепта
  var note = document.querySelector('.concept-note');
  if (note) {
    var q = location.search.replace(/[?&]motion(=[^&]*)?/, '').replace(/^&/, '?');
    if (!on) q = q ? q + '&motion' : '?motion';
    var t = document.createElement('a');
    t.href = location.pathname + q;
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
    // A
    '[data-variant=a] .header{position:sticky;top:0;z-index:40;background:var(--cream);transition:transform .5s var(--m-ease)}',
    '.header.m-hide{transform:translateY(-100%)}',
    // B
    '[data-variant=b] .cats ul{position:relative}',
    '[data-variant=b] .cats a{border-bottom-color:transparent!important}',
    '.m-ind{position:absolute;left:0;bottom:12px;height:1px;width:0;background:currentColor;pointer-events:none;transition:transform .45s var(--m-ease),width .45s var(--m-ease)}',
    '[data-variant=b] .item .ph img{transition:transform 1.2s var(--m-ease)}',
    '[data-variant=b] .item:hover .ph:not(.empty) img{transform:scale(1.045)}',
    '.m-progress{position:relative;height:1px;margin-top:18px;background:rgba(246,239,229,.22);overflow:hidden}',
    '.m-progress i{position:absolute;left:0;top:0;bottom:0;background:var(--cream)}',
    '[data-variant=b] .rail{scrollbar-width:none}',
    '[data-variant=b] .rail::-webkit-scrollbar{display:none}',
    '.rail.m-drag{cursor:grab}',
    '.rail.m-dragging{cursor:grabbing;scroll-snap-type:none;user-select:none}',
    // C
    '@keyframes m-rise{from{clip-path:inset(100% 0 0 0)}to{clip-path:inset(0 0 0 0)}}',
    '[data-variant=c] .m-watch .frame{clip-path:inset(100% 0 0 0)}',
    '[data-variant=c] .m-watch.m-in .frame{animation:m-rise 1.4s var(--m-ease) var(--d,0s) forwards}',
    '[data-variant=c] .m-watch.m-in .f2{animation-delay:calc(var(--d,0s) + .16s)}',
    '[data-variant=c] .m-watch.m-in .f3{animation-delay:calc(var(--d,0s) + .32s)}',
    '[data-variant=c] .dir .portal .frame{transition:inset .7s var(--m-ease)}',
    '[data-variant=c] .dir:hover .portal .f1,[data-variant=c] .dir:focus-visible .portal .f1{inset:-5px -5px 0}',
    '[data-variant=c] .dir:hover .portal .f2,[data-variant=c] .dir:focus-visible .portal .f2{inset:-27px -27px 0}',
    '[data-variant=c] .path ol{position:relative}',
    '.m-line{position:absolute;left:0;top:-1px;width:100%;height:2px;background:var(--brown);transform-origin:left;transform:scaleX(var(--p,0))}',
    '[data-variant=c] .path .n{display:inline-block;opacity:.22;transform:translateY(6px);transition:opacity .7s var(--m-ease),transform .7s var(--m-ease)}',
    '[data-variant=c] .path li.m-past .n{opacity:1;transform:none}',
    '@media (max-width:640px){.m-line{top:0;left:-1px;width:2px;height:100%;transform-origin:top;transform:scaleY(var(--p,0))}}',
    // D
    '[data-variant=d] .capsule .photo{position:relative}',
    '.m-swap{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .7s var(--m-ease)}',
    '.m-swap.m-show{opacity:1}',
    '[data-variant=d] .capsule li h3{transition:transform .5s var(--m-ease)}',
    '[data-variant=d] .capsule li:hover h3{transform:translateX(8px)}',
    '.m-float{position:fixed;left:0;top:0;width:280px;height:190px;z-index:60;pointer-events:none;overflow:hidden;opacity:0;transition:opacity .35s var(--m-ease)}',
    '.m-float img{width:100%;height:100%;object-fit:cover;transform:scale(1.1);transition:transform .9s var(--m-ease)}',
    '.m-float.m-show{opacity:1}',
    '.m-float.m-show img{transform:none}'
  ].join('\n');
  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  // ---------- помощники ----------
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
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
    splitWords(el).forEach(function (w, i) {
      w.animate([{ transform: 'translateY(108%)' }, { transform: 'none' }],
        { duration: 1100, delay: delay + i * (step || 70), easing: EASE, fill: 'backwards' });
    });
  }
  function fadeIn(el, delay) {
    if (!el) return;
    el.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }],
      { duration: 900, delay: delay, easing: EASE, fill: 'backwards' });
  }
  function curtain(els) {
    els.forEach(function (el) { el.classList.add('m-curtain'); });
    once(els, function (el) { el.classList.add('m-in'); });
  }
  function underline(els) { els.forEach(function (el) { el.classList.add('m-ul'); }); }

  // ---------- A «Галерея» ----------
  function variantA() {
    var h1 = document.querySelector('.hero h1');
    if (h1) riseWords(h1, 650, 80);
    fadeIn(document.querySelector('.hero p'), 1250);
    fadeIn(document.querySelector('.hero .link-cta'), 1400);

    curtain($$('.plan-photo, .quality img, .partners img'));
    underline($$('.triad a, .dirs a, .product a'));

    // Страны медленно расходятся при прокрутке
    var geo = document.querySelector('.geo .countries');
    if (geo) {
      var spans = $$('span', geo), dirs = [-1, 0.6, -0.35];
      onScroll(function () {
        var r = geo.getBoundingClientRect(), vh = window.innerHeight;
        var p = clamp((vh - r.top) / (vh + r.height), 0, 1) - 0.5;
        var amp = Math.min(140, window.innerWidth * 0.09);
        spans.forEach(function (s, i) { s.style.transform = 'translate3d(' + (p * amp * dirs[i]).toFixed(1) + 'px,0,0)'; });
      });
    }

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
    // Мозаика раскрывается по очереди, затем поднимается заголовок
    $$('.mosaic a').forEach(function (a, i) {
      a.animate([{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0 0 0 0)' }],
        { duration: 1100, delay: 120 + i * 90, easing: EASE, fill: 'backwards' });
      var img = a.querySelector('img');
      if (img) img.animate([{ transform: 'scale(1.12)' }, { transform: 'none' }],
        { duration: 1700, delay: 120 + i * 90, easing: EASE, fill: 'backwards' });
    });
    var h1 = document.querySelector('.mosaic h1');
    if (h1) riseWords(h1, 700, 80);

    // Линия-указатель в полосе категорий
    var ul = document.querySelector('.cats ul');
    if (ul) {
      var ind = document.createElement('span');
      ind.className = 'm-ind';
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

    // Лента интерьеров: тянется мышью, внизу линия прогресса
    var rail = document.querySelector('.rail');
    if (rail) {
      var bar = document.createElement('div');
      bar.className = 'm-progress';
      bar.setAttribute('aria-hidden', 'true');
      var fill = document.createElement('i');
      bar.appendChild(fill);
      rail.after(bar);
      var update = function () {
        var max = rail.scrollWidth - rail.clientWidth, share = rail.clientWidth / rail.scrollWidth;
        bar.style.visibility = share >= 0.995 ? 'hidden' : '';
        fill.style.width = (share * 100) + '%';
        fill.style.transform = 'translateX(' + (max ? (rail.scrollLeft / max) * (1 / share - 1) * 100 : 0) + '%)';
      };
      rail.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
      if (finePointer) {
        rail.classList.add('m-drag');
        $$('img', rail).forEach(function (im) { im.draggable = false; });
        var startX = 0, startLeft = 0, dragging = false;
        rail.addEventListener('pointerdown', function (e) {
          if (e.pointerType !== 'mouse') return;
          dragging = true; startX = e.clientX; startLeft = rail.scrollLeft;
          rail.classList.add('m-dragging'); rail.setPointerCapture(e.pointerId);
        });
        rail.addEventListener('pointermove', function (e) { if (dragging) rail.scrollLeft = startLeft - (e.clientX - startX); });
        var stop = function () { if (!dragging) return; dragging = false; rail.classList.remove('m-dragging'); };
        rail.addEventListener('pointerup', stop);
        rail.addEventListener('pointercancel', stop);
      }
    }
  }

  // ---------- C «Проём» ----------
  function variantC() {
    // Рамки остальных проёмов вырастают, когда доходят до экрана
    var portals = $$('.dirs .portal, .partners .portal, .contact .portal');
    portals.forEach(function (p) {
      p.classList.add('m-watch');
      var dir = p.closest('.dir');
      if (dir) p.style.setProperty('--d', ($$('.dirs .dir').indexOf(dir) * 0.14) + 's');
    });
    once(portals, function (p) { p.classList.add('m-in'); }, '0px 0px -18% 0px');

    // Путь «от планировки до дома»: линия идёт по шагам вместе с прокруткой
    var ol = document.querySelector('.path ol');
    if (ol) {
      var line = document.createElement('span');
      line.className = 'm-line';
      line.setAttribute('aria-hidden', 'true');
      ol.appendChild(line);
      var steps = $$('li', ol);
      onScroll(function () {
        var r = ol.getBoundingClientRect(), vh = window.innerHeight;
        var mobile = window.innerWidth <= 640;
        var p = mobile ? clamp((vh * 0.75 - r.top) / r.height, 0, 1)
                       : clamp((vh * 0.88 - r.top) / (vh * 0.42), 0, 1);
        ol.style.setProperty('--p', p.toFixed(3));
        steps.forEach(function (li, i) { li.classList.toggle('m-past', p >= (i + 0.35) / steps.length); });
      });
    }

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

  // ---------- D «Вечер» ----------
  function variantD() {
    // Заголовок проявляется вместе со светом в гостиной
    var h1 = document.querySelector('.hero h1');
    if (h1) h1.animate([{ opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0)' }],
      { duration: 1600, delay: 1100, easing: EASE, fill: 'backwards' });
    fadeIn(document.querySelector('.hero .text > div'), 1700);

    // Капсула: при наведении на предмет большое фото меняется на него
    var photo = document.querySelector('.capsule .photo');
    if (photo && finePointer) {
      var swap = document.createElement('img');
      swap.className = 'm-swap';
      swap.alt = '';
      photo.appendChild(swap);
      $$('.capsule li').forEach(function (li) {
        var im = li.querySelector(':scope > img');
        li.addEventListener('mouseenter', function () {
          if (!im) { swap.classList.remove('m-show'); return; }
          swap.src = im.currentSrc || im.src;
          swap.classList.add('m-show');
        });
      });
      var list = document.querySelector('.capsule ul');
      if (list) list.addEventListener('mouseleave', function () { swap.classList.remove('m-show'); });
    }

    // Направления: крупное превью следует за курсором
    if (finePointer) {
      var flt = document.createElement('div');
      flt.className = 'm-float';
      flt.setAttribute('aria-hidden', 'true');
      var fim = document.createElement('img');
      fim.alt = '';
      flt.appendChild(fim);
      document.body.appendChild(flt);
      var tx = 0, ty = 0, x = 0, y = 0, raf = 0;
      var loop = function () {
        x += (tx - x) * 0.14; y += (ty - y) * 0.14;
        flt.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0)';
        raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.3 || flt.classList.contains('m-show')) ? requestAnimationFrame(loop) : 0;
      };
      $$('.dirs a').forEach(function (a) {
        var im = a.querySelector(':scope > img');
        a.addEventListener('mouseenter', function (e) {
          if (!im) { flt.classList.remove('m-show'); return; }
          fim.src = im.currentSrc || im.src;
          if (!flt.classList.contains('m-show')) { x = tx = e.clientX + 28; y = ty = e.clientY - 95; }
          flt.classList.add('m-show');
          if (!raf) raf = requestAnimationFrame(loop);
        });
        a.addEventListener('mousemove', function (e) { tx = e.clientX + 28; ty = e.clientY - 95; });
        a.addEventListener('mouseleave', function () { flt.classList.remove('m-show'); });
      });
    }

    // Светлая полоса «рассветает» при прокрутке, цитата проявляется по словам
    var sec = document.querySelector('.closeup');
    var quote = sec && sec.querySelector('.quote');
    if (sec) {
      var words = quote ? splitWords(quote, 'm-q') : [];
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
        var t = clamp((vh - r.top) / (vh * 0.55), 0, 1);
        sec.style.backgroundColor = dawn(t);
        sec.style.color = t < 0.5 ? 'rgb(246,239,229)' : mix(cream, brown, clamp((t - 0.5) / 0.3, 0, 1));
        if (quote) {
          var qr = quote.getBoundingClientRect();
          var q = clamp((vh * 0.85 - qr.top) / (vh * 0.4), 0, 1), n = words.length;
          words.forEach(function (w, i) { w.style.opacity = (0.14 + 0.86 * clamp(q * n - i, 0, 1)).toFixed(2); });
        }
      });
    }
  }

  ({ a: variantA, b: variantB, c: variantC, d: variantD }[variant] || function () {})();
})();
