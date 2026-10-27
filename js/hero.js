/* Cifras del hero, igual que "ICAP en Cifras" del brochure: la primera vez
   cuentan de 0 al total (anillo y barritas acompañan) y terminan con un
   "boop"; cada vez que se vuelven a ver sólo repiten el boop. */
ICAP.hero = (() => {
  const CIFRAS = [
    { valor: 124, nombre: 'Proyectos', sub: 'ejecutados', ic: 'briefcase' },
    { valor: 47, nombre: 'Clientes', sub: 'institucionales', ic: 'building-2' },
    { valor: 18, nombre: 'Países', sub: 'atendidos', ic: 'globe-2' }
  ];
  const DURACION = 2900;
  const RADIO = 17;
  const CIRCUNFERENCIA = 2 * Math.PI * RADIO;
  const BARRAS = [34, 50, 64, 80, 100];

  function pintar() {
    ICAP.$('#cifras').innerHTML = CIFRAS.map((c) => `
      <div class="cifra">
        <div class="cifra-anillo">
          <svg viewBox="0 0 40 40" aria-hidden="true">
            <circle class="pista" cx="20" cy="20" r="${RADIO}" />
            <circle class="avance" cx="20" cy="20" r="${RADIO}" style="stroke-dasharray:${CIRCUNFERENCIA};stroke-dashoffset:${CIRCUNFERENCIA}" />
          </svg>
          <span class="cifra-icono"><i data-lucide="${c.ic}"></i></span>
        </div>
        <strong class="cifra-numero">0</strong>
        <span class="cifra-nombre">${c.nombre}</span>
        <span class="cifra-sub">${c.sub}</span>
        <div class="cifra-barras" aria-hidden="true">${BARRAS.map(() => '<span></span>').join('')}</div>
      </div>`).join('') +
      '<span class="cifras-nota">Cifras oficiales · Resumen Estratégico ICAP</span>';
  }

  function contar() {
    const tarjetas = document.querySelectorAll('.cifra');
    const inicio = performance.now();
    const tramo = (DURACION - 500) / BARRAS.length;

    tarjetas.forEach((t) => t.querySelectorAll('.cifra-barras span').forEach((barra, i) => {
      barra.style.transitionDuration = `${tramo}ms`;
      barra.style.transitionDelay = `${i * tramo}ms`;
      barra.style.height = `${BARRAS[i]}%`;
      barra.style.opacity = 0.3 + (BARRAS[i] / 100) * 0.55;
    }));

    const paso = (ahora) => {
      const p = Math.min((ahora - inicio) / DURACION, 1);
      const suave = 1 - Math.pow(1 - p, 3);
      tarjetas.forEach((t, i) => {
        t.querySelector('.cifra-numero').textContent = Math.round(CIFRAS[i].valor * suave);
        t.querySelector('.avance').style.strokeDashoffset = CIRCUNFERENCIA * (1 - suave);
      });
      if (p < 1) requestAnimationFrame(paso);
      else boop();
    };
    requestAnimationFrame(paso);
  }

  function boop() {
    document.querySelectorAll('.cifra-numero').forEach((n) => {
      n.classList.remove('boop');
      void n.offsetWidth; // reinicia la animación aunque la clase ya estuviera
      n.classList.add('boop');
    });
  }

  function iniciar() {
    pintar();
    let yaConto = false;
    ICAP.alVerse(ICAP.$('#cifras'), (visible) => {
      if (!visible) return;
      if (yaConto) return boop();
      yaConto = true;
      setTimeout(contar, 400);
    }, 0.35);
  }

  return { iniciar };
})();
