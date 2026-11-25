// Плавная прокрутка на всех устройствах: колесо, тачпад и касание (библиотека Lenis).
// При системной настройке «уменьшить движение» не включается: остаётся обычная прокрутка.
// Если библиотека не загрузилась, страница прокручивается как обычно.
// Пока открыто окно и у <html> стоит overflow: hidden, плавная прокрутка на паузе (autoToggle).
// Ссылки на якоря прокручиваются плавно с учётом scroll-margin-top и переводят фокус на цель.
(function () {
  'use strict';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  var lenis = null, html = document.documentElement;

  function focusTarget(t) {
    if (!t.matches('a[href], button, input, select, textarea, [tabindex]')) t.setAttribute('tabindex', '-1');
    t.focus({ preventScroll: true });
  }
  // Цель считаем от настоящей позиции окна: браузер может сдвинуть прокрутку сам
  // (догрузились картинки выше экрана), и тогда внутренний счётчик Lenis отстаёт.
  function go(t, done) {
    var y = t.getBoundingClientRect().top + window.scrollY - (parseFloat(getComputedStyle(t).scrollMarginTop) || 0);
    if (Math.abs(lenis.animatedScroll - window.scrollY) > 1 && !lenis.isScrolling) lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    lenis.scrollTo(Math.max(0, y), { force: true, onComplete: done });
  }
  // Общая функция для скриптов страницы: прокрутить к элементу
  window.nhScrollTo = function (t) {
    if (lenis) go(t);
    else t.scrollIntoView({ behavior: 'smooth' });
  };

  function init() {
    if (!window.Lenis) return;
    lenis = new window.Lenis({
      autoRaf: true,
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: true,
      syncTouchLerp: 0.08,
      autoToggle: true,
      allowNestedScroll: true,
      stopInertiaOnNavigate: true,
      // заставки концептов на время вступления держат страницу (класс m-hold из motion.js)
      virtualScroll: function (d) { return !d.event.defaultPrevented && !html.classList.contains('m-hold'); }
    });
    window.nhLenis = lenis;
  }

  document.addEventListener('click', function (e) {
    if (!lenis || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || (a.target && a.target !== '_self')) return;
    var u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname !== location.pathname || u.search !== location.search || u.hash.length < 2) return;
    var t = document.getElementById(decodeURIComponent(u.hash.slice(1)));
    if (!t) return;
    e.preventDefault();
    if (location.hash !== u.hash) history.pushState(null, '', u.hash);
    go(t, function () { focusTarget(t); });
  });

  var s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.3.27/dist/lenis.min.js';
  s.async = true;
  s.onload = init;
  document.head.appendChild(s);
})();
