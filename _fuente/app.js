/* Star Alarm demo · interacciones (vanilla, sin librerías) */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Nav: fondo sólido al hacer scroll */
  var nav = document.querySelector('.nav');
  function onScroll() { if (nav) nav.classList.toggle('nav--scroll', scrollY > 24); }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Hero: luz que sigue el cursor */
  var spot = document.querySelector('[data-spot]');
  if (spot && !reduce) {
    spot.addEventListener('pointermove', function (e) {
      var r = spot.getBoundingClientRect();
      spot.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      spot.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* Simulador del plano */
  var plano = document.querySelector('.plano[data-armado]');
  if (plano) {
    var INFO = {
      entrada: ['Puerta principal', 'Sensor magnético: avisa si la puerta se abre con el sistema armado.', 'Puerta principal abierta', 'Entrada'],
      sala: ['Sala', 'Detector de movimiento: cubre el paso entre la entrada y las habitaciones.', 'Movimiento detectado', 'Sala'],
      balcon: ['Balcón', 'Sensor de ventana: avisa si alguien abre la puerta del balcón.', 'Ventana del balcón abierta', 'Balcón'],
      parqueo: ['Parqueo', 'Cámara con alertas de actividad: te avisa cuando hay movimiento en la zona.', 'Persona detectada por cámara', 'Parqueo']
    };
    var tip = plano.querySelector('[data-tip]'), lienzo = plano.querySelector('.plano__lienzo');
    var sw = plano.querySelector('[data-switch]'), swTxt = plano.querySelector('[data-switch-txt]');
    var notif = plano.querySelector('[data-notif]'), sim = plano.querySelector('[data-simular]');
    var nT = plano.querySelector('[data-notif-t]'), nS = plano.querySelector('[data-notif-s]');
    var orden = ['sala', 'entrada', 'balcon', 'parqueo'], idx = 0, timer;

    function armado() { return plano.dataset.armado === 'true'; }
    function limpiar() {
      plano.classList.remove('plano--alerta');
      plano.querySelectorAll('.is-alerta').forEach(function (n) { n.classList.remove('is-alerta'); });
      notif.classList.remove('is-on');
    }
    function mostrarTip(g) {
      var k = g.dataset.p, c = g.querySelector('.n'), rl = lienzo.getBoundingClientRect(), rc = c.getBoundingClientRect();
      tip.innerHTML = '<strong>' + INFO[k][0] + '</strong>' + INFO[k][1];
      tip.hidden = false;
      var x = rc.left - rl.left + rc.width / 2, y = rc.top - rl.top;
      tip.style.left = Math.min(Math.max(x, 110), rl.width - 110) + 'px';
      tip.style.top = y + 'px';
      plano.querySelectorAll('.punto').forEach(function (p) { p.classList.toggle('is-sel', p === g); });
    }
    plano.querySelectorAll('.punto').forEach(function (g) {
      g.addEventListener('click', function (e) { e.stopPropagation(); mostrarTip(g); });
      g.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); mostrarTip(g); } });
    });
    document.addEventListener('click', function (e) { if (!plano.contains(e.target)) { tip.hidden = true; plano.querySelectorAll('.is-sel').forEach(function (p) { p.classList.remove('is-sel'); }); } });

    sw.addEventListener('click', function () {
      var on = !armado();
      plano.dataset.armado = String(on);
      sw.setAttribute('aria-pressed', String(on));
      swTxt.textContent = on ? 'Armado' : 'Desarmado';
      limpiar();
    });

    sim.addEventListener('click', function () {
      clearTimeout(timer); limpiar(); tip.hidden = true;
      if (!armado()) {
        nT.textContent = 'Tu sistema está desarmado';
        nS.textContent = 'Ármalo para recibir alertas';
        requestAnimationFrame(function () { notif.classList.add('is-on'); });
        timer = setTimeout(limpiar, 3200);
        return;
      }
      var k = orden[idx++ % orden.length];
      plano.classList.add('plano--alerta');
      plano.querySelector('.punto[data-p="' + k + '"]').classList.add('is-alerta');
      plano.querySelector('.zona-alerta[data-zona="' + k + '"]').classList.add('is-alerta');
      nT.textContent = INFO[k][2];
      nS.textContent = INFO[k][3] + ' · 3:02 a. m. · la central ya recibió la alerta';
      requestAnimationFrame(function () { notif.classList.add('is-on'); });
      timer = setTimeout(limpiar, 5200);
    });
  }

  /* Línea de tiempo de las 3 a. m. */
  var pasos = document.querySelector('[data-pasos]');
  if (pasos) {
    var prog = pasos.querySelector('.pasos__prog'), items = pasos.querySelectorAll('.paso');
    function tl() {
      var r = pasos.getBoundingClientRect(), vh = innerHeight;
      var f = Math.min(1, Math.max(0, (vh * 0.8 - r.top) / (r.height + vh * 0.25)));
      if (reduce) f = 1;
      prog.style.transform = 'scaleX(' + f + ')';
      prog.style.setProperty('--f', f);
      items.forEach(function (it, i) { it.classList.toggle('on', f >= (i + 0.35) / items.length); });
    }
    addEventListener('scroll', tl, { passive: true }); addEventListener('resize', tl); tl();
  }

  /* Contadores */
  var nums = document.querySelectorAll('[data-cuenta]');
  if (nums.length && 'IntersectionObserver' in window) {
    var fmt = function (n) { return n.toLocaleString('en-US'); };
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        var el = e.target, fin = +el.dataset.cuenta, t0 = performance.now(), d = 1400;
        if (reduce) { el.textContent = fmt(fin); return; }
        (function paso(t) {
          var k = Math.min(1, (t - t0) / d), v = Math.round(fin * (1 - Math.pow(1 - k, 3)));
          el.textContent = fmt(v);
          if (k < 1) requestAnimationFrame(paso);
        })(t0);
      });
    }, { threshold: .6 });
    nums.forEach(function (n) { n.textContent = '0'; io.observe(n); });
  }

  /* Servicios: resaltar la sección visible en el subnav */
  var spy = document.querySelector('[data-spy]');
  if (spy && 'IntersectionObserver' in window) {
    var links = spy.querySelectorAll('a');
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) links.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    document.querySelectorAll('.ficha[id]').forEach(function (s) { io2.observe(s); });
  }
})();
