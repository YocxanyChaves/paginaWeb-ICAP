/* Hero de la tercera versión. Toma del brochure el degradado, el resplandor
   y el círculo blanco con su órbita punteada, pero la composición es otra: el
   texto a la izquierda y, a la derecha, una órbita grande con las cuatro
   etapas de Generación de capacidades. El mismo rayito de luz de la página le
   da la vuelta y cada etapa se ilumina cuando pasa.
   - En el círculo blanco las cifras aparecen con un destello y se turnan
     solas; tocarlas pasa a la siguiente.
   - Tocar una etapa pone su nombre debajo de la órbita; tocarla otra vez
     vuelve al texto de siempre.
   Al cargar, el texto sube suave y la órbita se arma de a poco: los
   anillos, el círculo, las etapas y el rayo (CSS). */
ICAP.portada = (() => {
  const CIFRAS = [
    { valor: 124, nombre: 'Proyectos ejecutados' },
    { valor: 47, nombre: 'Clientes institucionales' },
    { valor: 18, nombre: 'Países atendidos' }
  ];
  const TURNO = 4200; // ms que se queda cada cifra en el centro
  const PRIMERA = 1500; // ms: la primera cifra aparece cuando el círculo ya llegó
  const VUELTA = 10; // segundos por vuelta del rayo
  const R = 150; // radio de la órbita, en un viewBox de 400×400
  const PIE = 'Del diagnóstico a la implementación';
  const SALIDA = 300; // ms, igual que la transición de .po-cifra.saliendo

  // El rayo: la misma tira de pedacitos de la versión interactiva sobre un
  // círculo que arranca arriba y gira en el sentido del reloj.
  const COLORES = ['#ffffff', '#e0f3ff', '#bfe6ff', '#9fd8ff', '#7dd3fc', '#4FB2F2', '#2a9be0', '#0090DD', '#0077C8', 'rgba(0, 119, 200, .5)'];
  const CIRCULO = `M200 ${200 - R} A${R} ${R} 0 1 1 199.99 ${200 - R}`;
  const pedazos = COLORES.map((color, k) =>
    `<path class="po-rayo" d="${CIRCULO}" pathLength="1000" stroke="${color}"
       style="stroke-width:${(3.6 - k * 0.24).toFixed(2)};animation-delay:${(-VUELTA + k * VUELTA * 5 / 1000).toFixed(3)}s" />`
  ).reverse().join('');

  // Las etapas, en diagonal sobre la órbita y en orden del reloj desde arriba
  // a la izquierda. `vuelta` es la fracción de la vuelta en que el rayo pasa.
  const ANGULOS = [225, 315, 45, 135];

  let cifra = 0;
  let reloj = null;
  let etapa = -1;

  function pintar() {
    const etapas = ICAP.ETAPAS.map((e, i) => {
      const rad = (ANGULOS[i] * Math.PI) / 180;
      const x = 50 + (R / 400) * 100 * Math.cos(rad);
      const y = 50 + (R / 400) * 100 * Math.sin(rad);
      const vuelta = ((ANGULOS[i] + 90) % 360) / 360;
      return `
        <button type="button" class="po-etapa" data-i="${i}" aria-pressed="false" aria-label="${e.nombre}"
          style="--c:${e.color};--k:${i};left:${x}%;top:${y}%;animation-delay:${1150 + i * 140}ms, ${(vuelta * VUELTA - VUELTA).toFixed(2)}s">
          <i data-lucide="${e.ic}"></i>
        </button>`;
    }).join('');
    ICAP.$('#orbita').innerHTML = `
      <svg viewBox="0 0 400 400" aria-hidden="true">
        <g class="po-anillos">
          <circle class="po-guia" cx="200" cy="200" r="${R}" />
          <circle class="po-puntitos" cx="200" cy="200" r="${R - 20}" />
        </g>
        <g class="po-luz" style="--vuelta:${VUELTA}s">${pedazos}</g>
      </svg>
      ${etapas}
      <div class="po-centro">
        <button type="button" class="po-cifra" title="Ver otra cifra" aria-live="polite">
          <strong id="poNumero"></strong>
          <span id="poNombre"></span>
        </button>
      </div>
      <span class="po-pie" id="poPie" aria-live="polite">${PIE}</span>`;
  }

  // Vuelve a correr la animación de aparecer, aunque el elemento ya la tenga.
  function magia(el, clase = 'magia') {
    el.classList.remove(clase);
    void el.offsetWidth;
    el.classList.add(clase);
  }

  // La cifra que estaba se desvanece primero y luego aparece la nueva.
  function mostrarCifra(i) {
    cifra = i;
    const caja = ICAP.$('.po-cifra');
    const primera = !caja.classList.contains('magia');
    caja.classList.add('saliendo');
    setTimeout(() => {
      ICAP.$('#poNumero').textContent = CIFRAS[i].valor;
      ICAP.$('#poNombre').textContent = CIFRAS[i].nombre;
      caja.classList.remove('saliendo');
      magia(caja);
      magia(ICAP.$('.po-centro'), 'destello');
    }, primera || ICAP.sinMovimiento ? 0 : SALIDA);
    // Elegir a mano reinicia la cuenta, para que no cambie apenas se toca.
    clearTimeout(reloj);
    reloj = setTimeout(() => mostrarCifra((cifra + 1) % CIFRAS.length), TURNO);
  }

  function elegirEtapa(i) {
    etapa = etapa === i ? -1 : i;
    document.querySelectorAll('.po-etapa').forEach((b) => {
      b.classList.toggle('elegida', +b.dataset.i === etapa);
      b.setAttribute('aria-pressed', +b.dataset.i === etapa);
    });
    const pie = ICAP.$('#poPie');
    pie.textContent = etapa === -1 ? PIE : ICAP.ETAPAS[etapa].nombre;
    pie.style.setProperty('--c', etapa === -1 ? '' : ICAP.ETAPAS[etapa].color);
    pie.classList.toggle('con-etapa', etapa !== -1);
    magia(pie);
  }

  function escuchar() {
    ICAP.$('#orbita').addEventListener('click', (e) => {
      if (e.target.closest('.po-cifra')) return mostrarCifra((cifra + 1) % CIFRAS.length);
      const boton = e.target.closest('.po-etapa');
      if (boton) elegirEtapa(+boton.dataset.i);
    });
  }

  function iniciar() {
    pintar();
    escuchar();
    setTimeout(() => mostrarCifra(0), ICAP.sinMovimiento ? 0 : PRIMERA);
  }

  return { iniciar };
})();
