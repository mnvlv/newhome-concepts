// Прототип New Home Concept: общие данные, шапка и подвал, избранное и корзина (в браузере), перекраска ткани по маске.
(function () {
  'use strict';
  var IMG = '../assets/img/';
  var MARK = '../brand/logo/svg/mark-brown.svg';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  document.documentElement.classList.add('js');

  // ---------- Данные (в рабочем сайте приходят из Payload) ----------
  var FABRICS = [
    { id: 'milk', name: 'Букле молочный', hex: null, dot: '#EAE3D6' },
    { id: 'sand', name: 'Букле песочный', hex: '#C9AE8C' },
    { id: 'powder', name: 'Букле пудровый', hex: '#CFA597' },
    { id: 'olive', name: 'Велюр оливковый', hex: '#6B6D48' },
    { id: 'terra', name: 'Велюр терракотовый', hex: '#995233' },
    { id: 'graphite', name: 'Шенилл графитовый', hex: '#4A4744' },
    { id: 'navy', name: 'Шерсть «синяя ночь»', hex: '#2D3646' }
  ];
  var WOODS = ['Орех', 'Дуб натуральный', 'Ясень тонированный'];
  // Участок ткани для образцов: светлое букле с фото кресла
  var TEXTURE = { photo: IMG + 'armchair.jpg', rect: [60, 224, 44, 44] };

  var PRODUCTS = {
    armchair: { name: 'Кресло с глубокой посадкой', cat: 'Кресла', c: 'cn', photo: 'armchair.jpg', mask: 'img/armchair-mask.png',
      fabric: true, wood: true, size: '96 × 88 × 74 см', term: '45–60 дней', base: 'Цоколь из массива',
      alt: 'Кресло в светлом букле на ореховом цоколе' },
    sofa: { name: 'Диван с округлыми формами', cat: 'Диваны', c: 'eu', photo: 'sofa-arch.jpg', mask: 'img/sofa-arch-mask.png',
      fabric: true, wood: true, size: '260 × 105 × 72 см', term: '60–75 дней', base: 'Цоколь из массива',
      alt: 'Диван в букле с округлыми подлокотниками у арки' },
    sofa3: { name: 'Диван трёхместный', cat: 'Диваны', c: 'cn', photo: 'living-room.jpg', fabric: true, wood: true,
      size: '280 × 100 × 70 см', term: '45–60 дней', base: 'Цоколь из массива', alt: 'Трёхместный диван в букле' },
    table: { name: 'Столик на двух опорах', cat: 'Столики', c: 'ru', photo: 'pedestal-table.jpg', wood: true,
      size: '120 × 60 × 40 см', term: '30–40 дней', alt: 'Столик из ореха на двух опорах' },
    massage: { name: 'Массажное кресло', cat: 'Массажные кресла', c: 'cn', photo: null, size: 'по модели', term: '30–45 дней',
      note: 'Фото добавим из каталога фабрики' },
    parquet: { name: 'Паркет из ореха', cat: 'Паркет и доска', c: 'ru', photo: 'materials.jpg', size: 'планка 500 × 90 × 15 мм',
      term: '20–30 дней', note: 'Собственное производство', alt: 'Образцы паркета и материалов' },
    bed: { name: 'Кровать с мягким изголовьем', cat: 'Кровати', c: 'cn', photo: null, fabric: true, size: '180 × 200 см',
      term: '45–60 дней', note: 'Фото добавим из каталога фабрики' },
    modular: { name: 'Модульный диван', cat: 'Диваны', c: 'eu', photo: 'fabric-corner.jpg', fabric: true, wood: true,
      size: 'модули от 90 см', term: '60–75 дней', alt: 'Деталь обивки модульного дивана' }
  };
  var COUNTRY = { cn: 'Китай', ru: 'Россия', eu: 'Европа' };
  function fabricById(id) { for (var i = 0; i < FABRICS.length; i++) if (FABRICS[i].id === id) return FABRICS[i]; return FABRICS[0]; }
  function metaOf(p) {
    var parts = [];
    if (p.fabric) parts.push('Ткань на выбор'); else if (p.wood) parts.push('Массив'); else if (p.note) parts.push(p.note);
    parts.push(COUNTRY[p.c]);
    return parts.join(', ');
  }

  // ---------- Хранилище: избранное и корзина живут в браузере ----------
  var KEY = 'nh-proto-v1', mem = { fav: [], cart: [] };
  function load() { try { var s = JSON.parse(localStorage.getItem(KEY)); if (s && s.fav && s.cart) mem = s; } catch (e) {} return mem; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(mem)); } catch (e) {} paintCounts(true); }
  load();
  var store = {
    isFav: function (id) { return mem.fav.indexOf(id) >= 0; },
    toggleFav: function (id) { var i = mem.fav.indexOf(id); if (i >= 0) mem.fav.splice(i, 1); else mem.fav.push(id); save(); return i < 0; },
    add: function (id, fabric, wood) {
      var line = mem.cart.filter(function (l) { return l.id === id && l.fabric === fabric && l.wood === wood; })[0];
      if (line) line.qty++; else mem.cart.push({ id: id, fabric: fabric || null, wood: wood || null, qty: 1 });
      save();
    },
    cartCount: function () { return mem.cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  };

  // ---------- Значки ----------
  var ICON = {
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.3a4.3 4.3 0 0 1 7.5 2.5C19.5 15.4 12 20 12 20z"/></svg>',
    bag: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8.5h13l-1 11.5h-11z"/><path d="M9 8.5V7a3 3 0 0 1 6 0v1.5"/></svg>'
  };

  // ---------- Шапка ----------
  var MENU = [
    { t: 'Разработка проекта', h: 'От планировки до готового дома', ord: true, items: [
      ['Планировка', 'Замер и решение по зонам'], ['Дизайн-проект', 'Стиль, материалы, спецификация'],
      ['Подбор мебели и материалов', 'Мебель, полы, свет, текстиль'], ['Образцы и расчёт', 'Цена и срок до оплаты'],
      ['Производство', 'Контроль по эталону'], ['Доставка и сборка', 'Принимаем вместе с Вами']],
      fig: ['materials-plan.jpg', 'Можно прийти на любой этап или доверить весь путь.', 'Обсудить проект', 'index.html#contact'] },
    { t: 'Подбор мебели', h: 'Подбор мебели', items: [
      ['Мебель на заказ', 'Размер, ткань и отделка под проект'], ['Капсула для гостиной', 'Первая собственная коллекция'],
      ['Подберём по фото', 'Пришлите фото, найдём или сделаем'], ['Ткани и отделки', 'Образцы в руках до оплаты']],
      fig: ['sofa-arch.jpg', 'Диван из капсулы: ткань и оттенок дерева выбираются под Ваш дом.', 'Смотреть диван', 'product.html?id=sofa'] },
    { t: 'Каталог мебели', h: 'Каталог мебели', items: [
      ['Весь каталог', ''],['Диваны', ''], ['Кресла', ''], ['Кровати', ''], ['Столовые группы', ''], ['Столики', ''], ['Массажные кресла', ''], ['Паркет и доска', '']],
      fig: ['armchair.jpg', 'Больше 2 000 моделей из Китая, России и Европы.', 'Весь каталог', 'index.html#catalog'] },
    { t: 'Дизайнерам и архитекторам', h: 'Дизайнерам и архитекторам', items: [
      ['Условия партнёрства', 'Как работаем с бюро'], ['Образцы материалов', 'Ткани, дерево и камень'],
      ['Спецификация и расчёт', 'На языке проекта'], ['Ведение до объекта', 'Срок, приёмка, рекламации']],
      fig: ['materials.jpg', 'Отдельные условия для дизайнеров и архитекторов.', 'Стать партнёром', 'index.html#contact'] }
  ];
  // Ссылка пункта меню: категории каталога открывают каталог с фильтром (бывшая полоса категорий под шапкой)
  function menuHref(m, it) {
    if (m.t === 'Каталог мебели') return it[0] === 'Весь каталог' ? 'index.html#catalog' : 'index.html?cat=' + encodeURIComponent(it[0]) + '#catalog';
    if (it[0] === 'Капсула для гостиной') return 'index.html#capsule';
    return 'index.html#contact';
  }
  function headerHTML(page) {
    var menu = MENU.map(function (m, i) {
      var list = m.items.map(function (it) {
        var href = menuHref(m, it);
        return '<li><a href="' + href + '"><strong>' + it[0] + '</strong>' + (it[1] ? '<span>' + it[1] + '</span>' : '') + '</a></li>';
      }).join('');
      var tag = m.ord ? 'ol' : 'ul';
      return '<li><button type="button" aria-expanded="false" aria-controls="mega-' + i + '">' + m.t + '</button>' +
        '<div class="mega" id="mega-' + i + '"><div class="wrap"><div><h2>' + m.h + '</h2><' + tag + '>' + list + '</' + tag + '></div>' +
        '<figure><img src="' + IMG + m.fig[0] + '" alt="" loading="lazy"><figcaption>' + m.fig[1] + ' <a href="' + m.fig[3] + '">' + m.fig[2] + '</a></figcaption></figure></div></div></li>';
    }).join('');
    var burger = MENU.map(function (m) {
      return '<details><summary>' + m.t + '</summary>' + m.items.map(function (it) {
        return '<a href="' + menuHref(m, it) + '">' + it[0] + '</a>';
      }).join('') + '</details>';
    }).join('');
    return '<div class="util"><div class="wrap">' +
      '<a class="hide-md" href="tel:+70000000000">+7 (000) 000-00-00</a>' +
      '<a href="mailto:info@newhome.example">info@newhome.example</a>' +
      '<a href="index.html#contact">Контакты</a>' +
      '<a class="hide-md" href="https://2gis.ru/moscow" target="_blank" rel="noopener">Москва, карта 2ГИС</a></div></div>' +
      '<div class="wrap bar">' +
      '<a class="logo" href="index.html" aria-label="New Home Concept, на главную"><img src="../brand/logo/svg/logo-horizontal-brown.svg" alt="New Home Concept"></a>' +
      '<ul class="menu" role="list">' + menu + '</ul>' +
      '<div class="tools">' +
      '<a class="tool" href="cart.html#fav">' + ICON.heart + '<span class="lbl">Избранное</span><span class="count" data-count="fav" hidden></span></a>' +
      '<a class="tool" href="cart.html">' + ICON.bag + '<span class="lbl">Корзина</span><span class="count" data-count="cart" hidden></span></a>' +
      '<a class="link-cta cta" href="index.html#contact">Обсудить проект</a>' +
      '<details class="burger"><summary>Меню</summary><div class="panel">' + burger +
      '<a href="cart.html#fav">Избранное</a><a href="cart.html">Корзина</a><a href="index.html#contact">Обсудить проект</a>' +
      '<a href="tel:+70000000000">+7 (000) 000-00-00</a><a href="mailto:info@newhome.example">info@newhome.example</a>' +
      '<a href="https://2gis.ru/moscow" target="_blank" rel="noopener">Контакты и карта 2ГИС</a></div></details>' +
      '</div></div>';
  }
  function footerHTML() {
    return '<div class="wrap"><div class="cols">' +
      '<div><img src="../brand/logo/svg/logo-horizontal-cream.svg" alt="New Home Concept"><p style="color:var(--soft);font-size:14px;margin-top:16px;max-width:30ch">Мебель на заказ и комплектация интерьеров. С 2002 года.</p></div>' +
      '<div><strong>Каталог</strong><a href="index.html#catalog">Диваны</a><a href="index.html#catalog">Кресла</a><a href="index.html#catalog">Кровати</a><a href="index.html#catalog">Столовые группы</a><a href="index.html#capsule">Капсула для гостиной</a></div>' +
      '<div><strong>Компания</strong><a href="index.html#about">О компании</a><a href="index.html#partners">Дизайнерам и архитекторам</a><a href="index.html#geo">Производство и доставка</a><a href="index.html#contact">Проекты</a></div>' +
      '<div><strong>Контакты</strong><a href="tel:+70000000000">+7 (000) 000-00-00</a><a href="mailto:info@newhome.example">info@newhome.example</a><a href="#">Telegram</a><a href="#">WhatsApp</a><a href="https://2gis.ru/moscow" target="_blank" rel="noopener">Москва, карта 2ГИС</a></div>' +
      '</div><div class="legal"><span>ООО «Новый Дом», с 2002 года</span>' +
      '<span><a href="#">Политика конфиденциальности</a> · <a href="#">Согласие на обработку персональных данных</a> · <a href="#">Политика cookie</a></span></div></div>';
  }

  var page = document.body.getAttribute('data-page');
  var hdr = document.querySelector('[data-header]');
  if (hdr) { hdr.outerHTML = '<header class="header">' + headerHTML(page) + '</header>'; }
  var ftr = document.querySelector('[data-footer]');
  if (ftr) { ftr.outerHTML = '<footer class="footer dark">' + footerHTML() + '</footer>'; }

  function paintCounts(bump) {
    [['fav', mem.fav.length], ['cart', store.cartCount()]].forEach(function (pair) {
      document.querySelectorAll('[data-count="' + pair[0] + '"]').forEach(function (el) {
        var was = el.textContent;
        el.textContent = pair[1];
        el.hidden = !pair[1];
        if (bump && was !== String(pair[1]) && pair[1] && !reduce) { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); }
      });
    });
  }
  paintCounts(false);

  // Плашку прототипа можно скрыть, чтобы она не закрывала страницу
  var note = document.querySelector('.proto-note');
  if (note) {
    var hide = document.createElement('button');
    hide.type = 'button'; hide.className = 'note-x'; hide.textContent = 'Скрыть';
    hide.addEventListener('click', function () { note.remove(); });
    note.appendChild(hide);
  }

  // Выпадающее меню: открывается по наведению и по нажатию, закрывается по Esc и кликом мимо
  var openLi = null, hoverT = 0;
  function setOpen(li) {
    if (openLi && openLi !== li) { openLi.classList.remove('open'); openLi.querySelector('button').setAttribute('aria-expanded', 'false'); }
    openLi = li;
    if (li) { li.classList.add('open'); li.querySelector('button').setAttribute('aria-expanded', 'true'); }
  }
  document.querySelectorAll('.menu > li').forEach(function (li) {
    var btn = li.querySelector('button');
    btn.addEventListener('click', function () { setOpen(openLi === li ? null : li); });
    if (finePointer) {
      li.addEventListener('mouseenter', function () { clearTimeout(hoverT); hoverT = setTimeout(function () { setOpen(li); }, openLi ? 0 : 120); });
      li.addEventListener('mouseleave', function () { clearTimeout(hoverT); hoverT = setTimeout(function () { if (openLi === li) setOpen(null); }, 220); });
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && openLi) { var b = openLi.querySelector('button'); setOpen(null); b.focus(); }
  });
  document.addEventListener('click', function (e) { if (openLi && !openLi.contains(e.target)) setOpen(null); });

  // ---------- Всплывающее уведомление ----------
  var toastEl = null, toastT = 0;
  function toast(html) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.innerHTML = html;
    toastEl.classList.add('show');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 3200);
  }

  // ---------- Перекраска ткани по маске ----------
  // Фото и маска одного размера. Маска: белое — обивка, чёрное — всё остальное.
  // Цвет переносится в линейном пространстве: средняя яркость обивки становится цветом ткани, фактура сохраняется.
  var LIN = new Float32Array(256);
  for (var i = 0; i < 256; i++) { var c = i / 255; LIN[i] = c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
  function toSRGB(v) { v = v <= 0 ? 0 : v >= 1 ? 1 : v; return 255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055); }
  function hexLin(hex) { var n = parseInt(hex.slice(1), 16); return [LIN[n >> 16 & 255], LIN[n >> 8 & 255], LIN[n & 255]]; }
  function loadImg(src) {
    return new Promise(function (res, rej) { var im = new Image(); im.onload = function () { res(im); }; im.onerror = rej; im.src = src; });
  }
  var prepCache = {};
  function prepare(photo, mask, rect) {
    var key = photo + '|' + (mask || '') + '|' + (rect || '');
    if (prepCache[key]) return prepCache[key];
    prepCache[key] = Promise.all([loadImg(photo), mask ? loadImg(mask) : null]).then(function (r) {
      var im = r[0], sx = 0, sy = 0, w = im.naturalWidth, h = im.naturalHeight;
      if (rect) { sx = rect[0]; sy = rect[1]; w = rect[2]; h = rect[3]; }
      var cv = document.createElement('canvas'); cv.width = w; cv.height = h;
      var ctx = cv.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(im, sx, sy, w, h, 0, 0, w, h);
      var base = ctx.getImageData(0, 0, w, h); // на file:// бросит ошибку — тогда работает запасной вариант
      var alpha = new Float32Array(w * h);
      if (r[1]) {
        ctx.clearRect(0, 0, w, h); ctx.drawImage(r[1], sx, sy, w, h, 0, 0, w, h);
        var md = ctx.getImageData(0, 0, w, h).data;
        for (var k = 0; k < alpha.length; k++) alpha[k] = md[k * 4] / 255;
      } else alpha.fill(1);
      var d = base.data, lum = new Float32Array(w * h), sum = 0, wsum = 0;
      for (var p = 0; p < lum.length; p++) {
        var L = 0.2126 * LIN[d[p * 4]] + 0.7152 * LIN[d[p * 4 + 1]] + 0.0722 * LIN[d[p * 4 + 2]];
        lum[p] = L; sum += L * alpha[p]; wsum += alpha[p];
      }
      return { w: w, h: h, base: base, alpha: alpha, lum: lum, mean: sum / Math.max(wsum, 1) };
    });
    return prepCache[key];
  }
  function paint(prep, hex, canvas) {
    canvas.width = prep.w; canvas.height = prep.h;
    var ctx = canvas.getContext('2d');
    if (!hex) { ctx.putImageData(prep.base, 0, 0); return; }
    var out = ctx.createImageData(prep.w, prep.h), o = out.data, d = prep.base.data, t = hexLin(hex), m = prep.mean;
    for (var p = 0; p < prep.lum.length; p++) {
      var a = prep.alpha[p], j = p * 4;
      if (a < 0.004) { o[j] = d[j]; o[j + 1] = d[j + 1]; o[j + 2] = d[j + 2]; o[j + 3] = 255; continue; }
      var k = prep.lum[p] / m;
      o[j] = d[j] * (1 - a) + toSRGB(t[0] * k) * a;
      o[j + 1] = d[j + 1] * (1 - a) + toSRGB(t[1] * k) * a;
      o[j + 2] = d[j + 2] * (1 - a) + toSRGB(t[2] * k) * a;
      o[j + 3] = 255;
    }
    ctx.putImageData(out, 0, 0);
  }
  // Образец ткани: участок фактуры, перекрашенный в цвет ткани
  function swatch(canvas, fab) {
    return prepare(TEXTURE.photo, null, TEXTURE.rect).then(function (prep) { paint(prep, fab.hex, canvas); })
      .catch(function () { canvas.replaceWith(Object.assign(document.createElement('span'), { style: 'position:absolute;inset:0;background:' + (fab.hex || fab.dot) })); });
  }
  // Миниатюра товара в выбранной ткани (корзина, избранное)
  function thumb(holder, p, fabId) {
    var fab = fabricById(fabId);
    if (!p.photo) { holder.classList.add('empty'); holder.innerHTML = '<img src="' + MARK + '" alt="">'; return; }
    if (!p.mask || !fab.hex) { holder.innerHTML = '<img src="' + IMG + p.photo + '" alt="">'; return; }
    var cv = document.createElement('canvas'); holder.appendChild(cv);
    prepare(IMG + p.photo, p.mask).then(function (prep) { paint(prep, fab.hex, cv); })
      .catch(function () { holder.innerHTML = '<img src="' + IMG + p.photo + '" alt="">'; });
  }

  // ---------- Карточки каталога ----------
  function cardHTML(id) {
    var p = PRODUCTS[id], href = 'product.html?id=' + id;
    var ph = p.photo ? '<img src="' + IMG + p.photo + '" alt="' + (p.alt || p.name) + '" loading="lazy">' : '<img src="' + MARK + '" alt="" loading="lazy">';
    var dots = p.fabric ? '<span class="dots" aria-hidden="true">' + FABRICS.slice(0, 4).map(function (f) { return '<i style="background:' + (f.hex || f.dot) + '"></i>'; }).join('') + '</span>' : '';
    return '<article class="good" data-id="' + id + '" data-c="' + p.c + '">' +
      '<div class="ph' + (p.photo ? '' : ' empty') + '">' + ph + '<a href="' + href + '" tabindex="-1" aria-hidden="true"></a>' + dots +
      '<button class="fav" type="button" aria-pressed="false" aria-label="В избранное: ' + p.name + '">' + ICON.heart + '</button></div>' +
      '<h3><a href="' + href + '">' + p.name + '</a></h3><p class="meta">' + metaOf(p) + '</p>' +
      '<button class="add" type="button">В корзину</button></article>';
  }
  function wireCards(root) {
    root.querySelectorAll('.good').forEach(function (card) {
      var id = card.getAttribute('data-id'), p = PRODUCTS[id], fav = card.querySelector('.fav'), add = card.querySelector('.add');
      fav.setAttribute('aria-pressed', store.isFav(id));
      fav.addEventListener('click', function () {
        var on = store.toggleFav(id);
        fav.setAttribute('aria-pressed', on);
        toast(on ? 'Добавлено в избранное. <a href="cart.html#fav">Открыть</a>' : 'Убрано из избранного');
      });
      add.addEventListener('click', function () {
        store.add(id, p.fabric ? 'milk' : null, p.wood ? WOODS[0] : null);
        add.textContent = 'В корзине'; add.classList.add('done');
        toast('Добавлено в корзину. <a href="cart.html">Оформить запрос</a>');
      });
    });
  }
  var goods = document.querySelector('[data-goods]');
  if (goods) {
    goods.innerHTML = goods.getAttribute('data-goods').split(',').map(cardHTML).join('');
    wireCards(goods);
  }
  // Фильтр по стране: карточки плавно переезжают на новые места
  // Категория приходит из меню шапки или плиток (?cat=Диваны#catalog)
  var filters = document.querySelector('.filters');
  var it_animate = typeof Element.prototype.animate === 'function';
  var catState = { c: 'all', cat: new URLSearchParams(location.search).get('cat') };
  var catOn = document.querySelector('.cat-on'), catEmpty = document.querySelector('.cat-empty'), catH = document.getElementById('new-h');
  function applyCatalog(animate) {
    var items = Array.prototype.slice.call(goods.children), before = new Map();
    items.forEach(function (it) { if (!it.hidden) before.set(it, it.getBoundingClientRect()); });
    items.forEach(function (it) {
      var p = PRODUCTS[it.getAttribute('data-id')];
      it.hidden = (catState.c !== 'all' && p.c !== catState.c) || (catState.cat && p.cat !== catState.cat);
    });
    if (catH) catH.textContent = catState.cat || 'Новое в каталоге';
    if (catOn) catOn.hidden = !catState.cat;
    if (catEmpty) catEmpty.hidden = items.some(function (it) { return !it.hidden; });
    if (!animate || reduce || !it_animate) return;
    animateGoods(items, before);
  }
  function setCat(cat) {
    catState.cat = cat || null;
    var url = location.pathname + (cat ? '?cat=' + encodeURIComponent(cat) : '') + '#catalog';
    history.replaceState(null, '', url);
    applyCatalog(true);
  }
  if (goods) {
    // На главной ссылки на категории не перезагружают страницу, а сразу фильтруют каталог
    document.addEventListener('click', function (e) {
      var a = e.target.closest('a[href]'); if (!a) return;
      var u = new URL(a.getAttribute('href'), location.href);
      var norm = function (p) { return p.replace(/index\.html$/, ''); };
      if (norm(u.pathname) !== norm(location.pathname) || u.hash !== '#catalog') return;
      e.preventDefault();
      if (a.closest('.menu > li')) { clearTimeout(hoverT); setOpen(null); }
      var burger = a.closest('details.burger'); if (burger) burger.open = false;
      setCat(u.searchParams.get('cat'));
      document.getElementById('catalog').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
    });
    var reset = document.querySelector('[data-cat-reset]');
    if (reset) reset.addEventListener('click', function () { setCat(null); });
    if (catState.cat) applyCatalog(false);
  }
  if (filters && goods) filters.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    filters.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
    catState.c = b.getAttribute('data-f');
    applyCatalog(true);
  });
  function animateGoods(items, before) {
    items.forEach(function (it, k) {
      if (it.hidden) return;
      var now = it.getBoundingClientRect(), was = before.get(it);
      if (was) it.animate([{ transform: 'translate(' + (was.left - now.left) + 'px,' + (was.top - now.top) + 'px)' }, { transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.2,.7,.2,1)' });
      else it.animate([{ opacity: 0, transform: 'scale(.96)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 80 + k * 40, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
    });
  }

  // ---------- «Производим и привозим» (из варианта A): страны въезжают с разных сторон и встают лесенкой ----------
  var geo = document.querySelector('.geo .countries');
  var motionOn = !/[?&](static|motion=(0|off))\b/.test(location.search) && !reduce;
  if (geo && motionOn) {
    var gSpans = geo.querySelectorAll('span'), gFrom = [-1, 1, -1], gTick = 0;
    var gUpdate = function () {
      gTick = 0;
      var r = geo.getBoundingClientRect(), vh = window.innerHeight;
      gSpans.forEach(function (s, i) {
        var t = Math.min(1, Math.max(0, (vh - r.top) / (vh * 0.75) - i * 0.12)), e = 1 - Math.pow(1 - t, 3);
        s.style.transform = 'translate3d(' + (gFrom[i] * (1 - e) * 38).toFixed(2) + 'vw,0,0)';
        s.style.opacity = (0.1 + 0.9 * e).toFixed(3);
      });
    };
    gSpans.forEach(function (s) { s.style.willChange = 'transform'; });
    window.addEventListener('scroll', function () { if (!gTick) gTick = requestAnimationFrame(gUpdate); }, { passive: true });
    window.addEventListener('resize', gUpdate);
    gUpdate();
  }

  // ---------- «От одного кресла до нового дома»: превью за курсором, по нажатию крупно ----------
  var dirs = document.querySelectorAll('.dirs button');
  if (dirs.length) {
    var lb = document.createElement('div');
    lb.className = 'lb'; lb.hidden = true;
    lb.setAttribute('role', 'dialog'); lb.setAttribute('aria-modal', 'true'); lb.setAttribute('aria-labelledby', 'lb-t');
    lb.innerHTML = '<div class="lb-scrim"></div><div class="lb-box"><img alt=""><div class="lb-txt"><h3 id="lb-t"></h3><p></p><a class="link-cta" href="#contact">Обсудить</a></div>' +
      '<button class="lb-close" type="button">Закрыть</button></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img'), lbH = lb.querySelector('h3'), lbP = lb.querySelector('p'), lbA = lb.querySelector('a'), lbOpener = null;
    var closeLb = function () { lb.hidden = true; document.documentElement.style.overflow = ''; if (lbOpener) lbOpener.focus(); };
    lb.querySelector('.lb-close').addEventListener('click', closeLb);
    lb.querySelector('.lb-scrim').addEventListener('click', closeLb);
    lbA.addEventListener('click', closeLb);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !lb.hidden) closeLb(); });

    var flt = null, tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    if (finePointer) {
      flt = document.createElement('div'); flt.className = 'float'; flt.setAttribute('aria-hidden', 'true');
      document.body.appendChild(flt);
    }
    var loop = function () {
      var vx = tx - x;
      x += (tx - x) * (reduce ? 1 : 0.15); y += (ty - y) * (reduce ? 1 : 0.15);
      flt.style.transform = 'translate3d(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px,0) rotate(' + (reduce ? 0 : Math.max(-6, Math.min(6, vx * 0.05))).toFixed(2) + 'deg)';
      raf = (Math.abs(tx - x) + Math.abs(ty - y) > 0.3 || flt.classList.contains('show')) ? requestAnimationFrame(loop) : 0;
    };
    dirs.forEach(function (b) {
      var im = b.querySelector('img');
      b.addEventListener('click', function () {
        lbOpener = b;
        lbImg.src = im.currentSrc || im.src; lbImg.alt = im.getAttribute('data-alt') || '';
        lbH.textContent = b.querySelector('h3').textContent;
        lbP.textContent = b.querySelector('p').textContent;
        lbA.textContent = b.getAttribute('data-cta') || 'Обсудить';
        lbA.href = b.getAttribute('data-href') || '#contact';
        lb.hidden = false; document.documentElement.style.overflow = 'hidden';
        if (flt) flt.classList.remove('show');
        if (!reduce && it_animate) {
          var from = im.getBoundingClientRect(), to = lbImg.getBoundingClientRect();
          lbImg.animate([{ transform: 'translate(' + (from.left - to.left) + 'px,' + (from.top - to.top) + 'px) scale(' + (from.width / to.width) + ',' + (from.height / to.height) + ')', transformOrigin: '0 0' },
            { transform: 'none', transformOrigin: '0 0' }], { duration: 650, easing: 'cubic-bezier(.65,0,.2,1)' });
          lb.querySelector('.lb-scrim').animate([{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
          lb.querySelector('.lb-txt').animate([{ opacity: 0, transform: 'translateY(16px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 250, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
        }
        lb.querySelector('.lb-close').focus();
      });
      if (!flt) return;
      b.addEventListener('mouseenter', function (e) {
        if (!flt.classList.contains('show')) { x = tx = e.clientX + 30; y = ty = e.clientY - 105; }
        var url = im.currentSrc || im.src;
        if (flt.getAttribute('data-src') !== url) {
          flt.setAttribute('data-src', url);
          var n = new Image(); n.src = url; n.alt = ''; flt.appendChild(n);
          if (flt.children.length > 1 && !reduce && it_animate) {
            n.animate([{ clipPath: 'inset(0 0 0 100%)', transform: 'scale(1.12)' }, { clipPath: 'inset(0 0 0 0)', transform: 'none' }], { duration: 600, easing: 'cubic-bezier(.2,.7,.2,1)' })
              .onfinish = function () { while (flt.children.length > 1 && flt.firstChild !== n) flt.removeChild(flt.firstChild); };
          } else while (flt.children.length > 1) flt.removeChild(flt.firstChild);
        }
        flt.classList.add('show');
        if (!raf) raf = requestAnimationFrame(loop);
      });
      b.addEventListener('mousemove', function (e) { tx = e.clientX + 30; ty = e.clientY - 105; });
      b.addEventListener('mouseleave', function () { flt.classList.remove('show'); });
    });
  }

  // ---------- Формы: обязательны только имя и телефон ----------
  document.querySelectorAll('form.form').forEach(function (form) {
    var attach = form.querySelector('.attach'), file = form.querySelector('input[type=file]'), fname = form.querySelector('.attach-name');
    if (attach && file) {
      attach.addEventListener('click', function () { file.click(); });
      file.addEventListener('change', function () {
        var n = file.files.length;
        fname.textContent = n ? (n === 1 ? file.files[0].name : 'Файлов: ' + n) : '';
      });
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var err = form.querySelector('.form-err'), name = form.querySelector('[name=name]'), phone = form.querySelector('[name=phone]'), ok = form.querySelector('[name=consent]');
      var miss = [];
      if (!name.value.trim()) miss.push('имя');
      if (phone.value.replace(/\D/g, '').length < 10) miss.push('телефон');
      if (miss.length || (ok && !ok.checked)) {
        err.textContent = miss.length ? 'Укажите ' + miss.join(' и ') + ', чтобы мы могли связаться с Вами.' : 'Отметьте согласие на обработку персональных данных.';
        (miss.length ? (miss[0] === 'имя' ? name : phone) : ok).focus();
        return;
      }
      err.textContent = '';
      if (form.hasAttribute('data-cart')) { mem.cart = []; save(); }
      form.classList.add('sent');
      var done = form.querySelector('.form-done');
      done.setAttribute('tabindex', '-1'); done.focus();
    });
  });

  // ---------- Карточка товара ----------
  if (page === 'product') (function () {
    var params = new URLSearchParams(location.search);
    var id = PRODUCTS[params.get('id')] ? params.get('id') : 'armchair', p = PRODUCTS[id];
    var state = { fabric: p.fabric ? (fabricById(params.get('fabric')).id) : null, wood: p.wood ? WOODS[0] : null, mode: p.mask ? 'mask' : 'sample' };
    document.title = p.name + ' — New Home Concept';
    var $ = function (s) { return document.querySelector(s); };
    $('#p-name').textContent = p.name;
    $('#p-cat').textContent = p.cat; $('#p-cat').href = 'index.html#catalog';
    $('#p-crumb').textContent = p.name;
    $('#p-meta').textContent = (p.note ? p.note + '. ' : '') + 'Производство: ' + COUNTRY[p.c] + '.';
    $('#p-size').textContent = p.size; $('#p-term').textContent = p.term; $('#p-country').textContent = COUNTRY[p.c];
    if (!p.base) $('#p-base-row').remove(); else $('#p-base').textContent = p.base;

    var stage = $('.stage'), main = $('#p-canvas'), prev = $('#p-prev'), overlay = $('.stage .overlay'), sample = $('.stage .sample');
    var vizNote = $('#p-viz'), modeNote = $('#p-mode'), fabLabel = $('#p-fab-name'), canvasOK = true;

    if (!p.photo) {
      stage.innerHTML = '<img src="' + MARK + '" alt="" style="object-fit:contain;padding:30%;opacity:.35">';
      main = null;
    }

    function setMaskFallback(hex) {
      // Без canvas (например, страница открыта с диска): цветной слой в режиме «умножение» по той же маске
      overlay.style.background = hex || 'transparent';
      overlay.style.webkitMaskImage = overlay.style.maskImage = 'url(' + p.mask + ')';
      overlay.style.webkitMaskMode = overlay.style.maskMode = 'luminance';
      overlay.style.maskSize = overlay.style.webkitMaskSize = '100% 100%';
      overlay.style.opacity = hex ? '1' : '0';
    }
    function render(animate) {
      var fab = state.fabric ? fabricById(state.fabric) : null;
      if (fabLabel) fabLabel.textContent = fab ? fab.name : '';
      if (sample) {
        var showSample = !!fab && (state.mode === 'sample');
        sample.hidden = !showSample;
        if (showSample) { var sc = sample.querySelector('canvas'); swatch(sc, fab); sample.querySelector('span').textContent = fab.name; }
      }
      if (vizNote) vizNote.hidden = !(fab && fab.hex && state.mode === 'mask');
      if (!main) return;
      var hex = state.mode === 'mask' && fab ? fab.hex : null;
      if (!canvasOK) { setMaskFallback(hex); return; }
      prepare(IMG + p.photo, state.mode === 'mask' ? p.mask : null).then(function (prep) {
        if (animate && !reduce && it_animate && main.width) {
          prev.width = main.width; prev.height = main.height;
          prev.getContext('2d').drawImage(main, 0, 0);
          prev.style.visibility = 'visible';
          prev.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 0 100%)' }], { duration: 700, easing: 'cubic-bezier(.65,0,.2,1)' })
            .onfinish = function () { prev.style.visibility = 'hidden'; };
        }
        paint(prep, hex, main);
      }).catch(function () {
        canvasOK = false;
        main.replaceWith(Object.assign(document.createElement('img'), { src: IMG + p.photo, alt: p.alt || p.name }));
        main = document.createElement('canvas');
        setMaskFallback(hex);
      });
    }

    // Ткани
    var fabBox = $('#p-fabrics');
    if (p.fabric) {
      FABRICS.forEach(function (f) {
        var b = document.createElement('button');
        b.type = 'button'; b.setAttribute('aria-label', f.name + (f.hex ? '' : ', как на фото')); b.title = f.name;
        b.setAttribute('aria-pressed', f.id === state.fabric);
        var cv = document.createElement('canvas'); b.appendChild(cv); swatch(cv, f);
        b.addEventListener('click', function () {
          if (state.fabric === f.id) return;
          state.fabric = f.id;
          fabBox.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
          render(true);
        });
        fabBox.appendChild(b);
      });
    } else $('#p-fabric-opt').remove();
    // Режим: перекраска по маске или образец рядом с фото
    if (p.fabric && p.mask) {
      modeNote.innerHTML = 'Перекраска по маске обивки. <a href="#" data-mode>Показать образец рядом с фото</a>';
      modeNote.addEventListener('click', function (e) {
        if (!e.target.hasAttribute('data-mode')) return;
        e.preventDefault();
        state.mode = state.mode === 'mask' ? 'sample' : 'mask';
        modeNote.innerHTML = state.mode === 'mask' ? 'Перекраска по маске обивки. <a href="#" data-mode>Показать образец рядом с фото</a>'
          : 'Фото в исходной ткани, выбранный образец справа внизу. <a href="#" data-mode>Перекрасить фото</a>';
        render(true);
      });
    } else if (p.fabric) {
      modeNote.textContent = 'Для этой модели маски нет: показываем фото и образец выбранной ткани рядом.';
    } else modeNote.remove();
    // Дерево
    var woodBox = $('#p-woods');
    if (p.wood) {
      WOODS.forEach(function (w) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = w; b.setAttribute('aria-pressed', w === state.wood);
        b.addEventListener('click', function () { state.wood = w; woodBox.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b); }); });
        woodBox.appendChild(b);
      });
    } else $('#p-wood-opt').remove();

    // Галерея: второе фото — интерьер (для прототипа)
    var thumbs = $('#p-thumbs');
    if (p.photo) {
      [p.photo, 'interior-arches.jpg'].forEach(function (src, i) {
        var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-label', i ? 'Фото в интерьере' : 'Основное фото');
        b.setAttribute('aria-current', i === 0);
        b.innerHTML = '<img src="' + IMG + src + '" alt="">';
        b.addEventListener('click', function () {
          thumbs.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-current', x === b); });
          var alt = stage.querySelector('.alt-img');
          if (i === 0) { if (alt) alt.remove(); return; }
          if (!alt) { alt = document.createElement('img'); alt.className = 'alt-img'; alt.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;z-index:2'; stage.appendChild(alt); }
          alt.src = IMG + src; alt.alt = 'Интерьер с мебелью коллекции';
        });
        thumbs.appendChild(b);
      });
    }

    var favBtn = $('#p-fav');
    favBtn.setAttribute('aria-pressed', store.isFav(id));
    favBtn.querySelector('span').textContent = store.isFav(id) ? 'В избранном' : 'В избранное';
    favBtn.addEventListener('click', function () {
      var on = store.toggleFav(id);
      favBtn.setAttribute('aria-pressed', on);
      favBtn.querySelector('span').textContent = on ? 'В избранном' : 'В избранное';
    });
    $('#p-add').addEventListener('click', function () {
      store.add(id, state.fabric, state.wood);
      var fab = state.fabric ? fabricById(state.fabric).name.toLowerCase() : '';
      toast('Добавлено в корзину' + (fab ? ': ' + fab : '') + '. <a href="cart.html">Оформить запрос</a>');
    });
    render(false);
  })();

  // ---------- Корзина и избранное ----------
  if (page === 'cart') (function () {
    var params = new URLSearchParams(location.search);
    var shared = params.get('fav') ? params.get('fav').split(',').filter(function (k) { return PRODUCTS[k]; }) : null;
    var tabCart = document.querySelector('[data-tab=cart]'), tabFav = document.querySelector('[data-tab=fav]');
    var paneCart = document.getElementById('pane-cart'), paneFav = document.getElementById('pane-fav');
    function show() {
      var fav = location.hash === '#fav' || !!shared;
      paneCart.hidden = fav; paneFav.hidden = !fav;
      tabCart.setAttribute('aria-current', fav ? 'false' : 'page');
      tabFav.setAttribute('aria-current', fav ? 'page' : 'false');
      document.querySelector('[data-n=cart]').textContent = store.cartCount() || '';
      document.querySelector('[data-n=fav]').textContent = mem.fav.length || '';
      if (!fav) renderCart(); else renderFav();
    }
    window.addEventListener('hashchange', show);

    function lineHTML(p, l) {
      var fab = l.fabric ? fabricById(l.fabric) : null, opts = [];
      if (fab) opts.push('<i style="background:' + (fab.hex || fab.dot) + '"></i>' + fab.name);
      if (l.wood) opts.push(l.wood);
      return '<div class="ph"></div><div><h3><a href="product.html?id=' + l.id + (l.fabric ? '&fabric=' + l.fabric : '') + '">' + p.name + '</a></h3>' +
        '<p class="opts">' + (opts.join(' · ') || COUNTRY[p.c]) + '</p></div>';
    }
    function renderCart() {
      var box = document.getElementById('lines'), side = document.getElementById('cart-side');
      document.querySelector('[data-n=cart]').textContent = store.cartCount() || '';
      if (!mem.cart.length) {
        box.innerHTML = '<div class="empty-state"><h2 class="h2">Корзина пуста</h2><p>Добавьте модели из каталога. Мы пришлём расчёт с ценой и сроком, оплачивать на сайте ничего не нужно.</p><a class="btn" href="index.html#catalog">Перейти в каталог</a></div>';
        side.hidden = true; return;
      }
      side.hidden = false;
      box.innerHTML = '';
      mem.cart.forEach(function (l, idx) {
        var p = PRODUCTS[l.id], row = document.createElement('div');
        row.className = 'line';
        row.innerHTML = lineHTML(p, l) + '<div class="ctl"><div class="qty"><button type="button" aria-label="Меньше">−</button><output>' + l.qty + '</output><button type="button" aria-label="Больше">+</button></div>' +
          '<button class="linkbtn" type="button">Удалить</button></div>';
        thumb(row.querySelector('.ph'), p, l.fabric);
        var q = row.querySelectorAll('.qty button');
        q[0].addEventListener('click', function () { if (l.qty > 1) { l.qty--; save(); renderCart(); } });
        q[1].addEventListener('click', function () { l.qty++; save(); renderCart(); });
        row.querySelector('.linkbtn').addEventListener('click', function () { mem.cart.splice(idx, 1); save(); renderCart(); });
        box.appendChild(row);
      });
      document.getElementById('cart-sum').textContent = store.cartCount() + ' ' + plural(store.cartCount(), ['позиция', 'позиции', 'позиций']);
    }
    function renderFav() {
      var list = shared || mem.fav, box = document.getElementById('fav-lines'), side = document.getElementById('fav-side');
      document.querySelector('[data-n=fav]').textContent = mem.fav.length || '';
      document.getElementById('fav-shared').hidden = !shared;
      document.getElementById('fav-keep').hidden = !shared;
      document.getElementById('fav-copy').hidden = !!shared;
      if (!list.length) {
        box.innerHTML = '<div class="empty-state"><h2 class="h2">В избранном пусто</h2><p>Отмечайте модели сердечком в каталоге. Список сохранится в этом браузере, регистрация не нужна.</p><a class="btn" href="index.html#catalog">Перейти в каталог</a></div>';
        side.hidden = true; return;
      }
      side.hidden = false;
      box.innerHTML = '';
      list.forEach(function (id) {
        var p = PRODUCTS[id], row = document.createElement('div');
        row.className = 'line';
        row.innerHTML = lineHTML(p, { id: id }) + '<div class="ctl"><button class="btn ghost" type="button" data-add>' + ICON.bag + 'В корзину</button>' +
          (shared ? '' : '<button class="linkbtn" type="button" data-del>Убрать</button>') + '</div>';
        thumb(row.querySelector('.ph'), p, null);
        row.querySelector('[data-add]').addEventListener('click', function () {
          store.add(id, p.fabric ? 'milk' : null, p.wood ? WOODS[0] : null);
          toast('Добавлено в корзину. <a href="cart.html">Открыть корзину</a>');
        });
        var del = row.querySelector('[data-del]');
        if (del) del.addEventListener('click', function () { store.toggleFav(id); renderFav(); });
        box.appendChild(row);
      });
    }
    document.getElementById('fav-copy').addEventListener('click', function () {
      var url = location.origin + location.pathname + '?fav=' + mem.fav.join(',') + '#fav';
      var done = function () { toast('Ссылка на список скопирована'); };
      if (navigator.clipboard) navigator.clipboard.writeText(url).then(done, function () { prompt('Ссылка на список', url); });
      else prompt('Ссылка на список', url);
    });
    document.getElementById('fav-tocart').addEventListener('click', function () {
      (shared || mem.fav).forEach(function (id) { var p = PRODUCTS[id]; store.add(id, p.fabric ? 'milk' : null, p.wood ? WOODS[0] : null); });
      location.href = 'cart.html';
    });
    document.getElementById('fav-keep').addEventListener('click', function () {
      shared.forEach(function (id) { if (!store.isFav(id)) store.toggleFav(id); });
      location.href = 'cart.html#fav';
    });
    show();
  })();

  function plural(n, f) { var a = n % 10, b = n % 100; return f[a === 1 && b !== 11 ? 0 : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? 1 : 2]; }
})();
