/* Áreas de especialización con la física orbital de ValuesWheel del brochure:
   cada área tiene un lugar fijo en la órbita (nunca se cruzan) con un vaivén
   pequeño propio. En ciclo, una viaja al centro, el logo destella, se queda un
   momento y vuelve a su órbita; tocar una la llama de inmediato. */
ICAP.areas = (() => {
  const ATRAER = 1100;
  const QUEDARSE = 2600;
  const SOLTAR = 1200;
  const PAUSA = 450;
  const CURVA_IDA = 'cubic-bezier(0.16, 1, 0.3, 1)';
  const CURVA_VUELTA = 'cubic-bezier(0.4, 0, 0.2, 1)';
  const VELOCIDAD = 0.012; // grados por milisegundo

  const areas = ICAP.ETIQUETAS;
  let tamano = 400;
  let giro = 0;
  let activo = 0;
  let fase = 'orbita'; // 'orbita' | 'atraer' | 'quedarse' | 'soltar'
  let timers = [];
  let planetas = [];
  let corriendo = false;

  // Semillas fijas (no Math.random) para que el vaivén sea siempre el mismo.
  const orbitas = areas.map((_, i) => {
    const r1 = Math.sin(i * 91.7) * 0.5 + 0.5;
    const r2 = Math.sin(i * 91.7 * 1.9 + 3.1) * 0.5 + 0.5;
    const r3 = Math.sin(i * 91.7 * 2.7 + 1.3) * 0.5 + 0.5;
    return {
      radio: 0.94 + r1 * 0.1,
      fase: (i / areas.length) * 2 * Math.PI,
      vaivenAngulo: 0.03 + r2 * 0.03,
      velAngulo: 0.005 + r2 * 0.003,
      vaivenRadio: 3 + r1 * 4,
      velRadio: 0.004 + r2 * 0.003,
      desfase: r3 * Math.PI * 2
    };
  });

  function posicion(i, g) {
    const o = orbitas[i];
    const angulo = o.fase + (g * Math.PI) / 180 + Math.sin(g * o.velAngulo + o.desfase) * o.vaivenAngulo;
    const radio = tamano * 0.4 * o.radio + Math.sin(g * o.velRadio + o.desfase) * o.vaivenRadio;
    return { x: tamano / 2 + Math.cos(angulo) * radio, y: tamano / 2 + Math.sin(angulo) * radio };
  }

  function pintar() {
    const galaxia = ICAP.$('#galaxia');
    galaxia.insertAdjacentHTML('beforeend', areas.map((a, i) => `
      <button type="button" class="planeta" data-i="${i}" aria-label="${a.nombre}" style="--c:${a.color}">
        <span class="planeta-bola"><i data-lucide="${a.ic}"></i></span>
        <span class="planeta-nombre">${a.nombre}</span>
      </button>`).join(''));
    planetas = [...galaxia.querySelectorAll('.planeta')];
    galaxia.addEventListener('click', (e) => {
      const p = e.target.closest('.planeta');
      if (p) ciclo(+p.dataset.i);
    });
    new ResizeObserver(([r]) => { tamano = r.contentRect.width || tamano; }).observe(galaxia);

    ICAP.$('#estrellas').innerHTML = Array.from({ length: 26 }, (_, i) => {
      const s = i * 137.5;
      return `<span style="top:${(Math.sin(s) * 0.5 + 0.5) * 100}%;left:${(Math.cos(s * 1.7) * 0.5 + 0.5) * 100}%;` +
        `width:${1 + (i * 7) % 3}px;height:${1 + (i * 7) % 3}px;animation-delay:${(i % 6) * 0.4}s"></span>`;
    }).join('');
  }

  function ficha(i) {
    const a = areas[i];
    const proyectos = ICAP.proyectosDeEtiquetas([a.id]);
    const clientes = new Set(proyectos.map((p) => p.cliente)).size;
    const enCurso = proyectos.filter(ICAP.enCurso).length;
    ICAP.$('#fichaArea').innerHTML = `
      <div class="ficha-area" style="--c:${a.color}">
        <div class="ficha-area-cabeza">
          <span class="ficha-area-icono"><i data-lucide="${a.ic}"></i></span>
          <div><small>Área de especialización</small><h3>${a.nombre}</h3></div>
        </div>
        <p>${a.desc}</p>
        <div class="ficha-area-cifras">
          <div><strong>${proyectos.length}</strong><span>Proyectos</span></div>
          <div><strong>${clientes}</strong><span>Clientes</span></div>
          <div><strong>${enCurso}</strong><span>En curso</span></div>
        </div>
        <button type="button" class="ver-proyectos">Ver proyectos <i data-lucide="arrow-right"></i></button>
      </div>`;
    ICAP.$('#fichaArea .ver-proyectos').onclick = () => {
      ICAP.proyectos.filtrar({ etiquetas: [a.id] });
      ICAP.$('#proyectos').scrollIntoView({ behavior: 'smooth' });
    };
    ICAP.iconos();
  }

  function mover(planeta, x, y, transicion) {
    planeta.style.transition = transicion;
    planeta.style.left = `${x}px`;
    planeta.style.top = `${y}px`;
  }

  // Cada cuadro: todos orbitan salvo el activo mientras viaja o está en el centro.
  function cuadro(ahora, antes) {
    if (!corriendo) return;
    giro += (ahora - antes) * VELOCIDAD;
    planetas.forEach((p, i) => {
      if (i === activo && fase !== 'orbita') return;
      const { x, y } = posicion(i, giro);
      mover(p, x, y, 'none');
    });
    requestAnimationFrame((t) => cuadro(t, ahora));
  }

  const esperar = (ms, fn) => timers.push(setTimeout(fn, ms));

  function ciclo(i) {
    timers.forEach(clearTimeout);
    timers = [];
    planetas.forEach((p) => p.classList.remove('activo', 'en-centro'));
    activo = i;
    fase = 'atraer';
    const p = planetas[i];
    p.classList.add('activo', 'en-centro');
    mover(p, tamano / 2, tamano / 2, `left ${ATRAER}ms ${CURVA_IDA}, top ${ATRAER}ms ${CURVA_IDA}`);
    ficha(i);
    esperar(ATRAER, llegar);
  }

  function llegar() {
    fase = 'quedarse';
    const nucleo = ICAP.$('#nucleo');
    nucleo.classList.add('pulso');
    nucleo.querySelector('.nucleo-destello')?.remove();
    nucleo.insertAdjacentHTML('beforeend', '<span class="nucleo-destello"></span>');
    esperar(380, () => nucleo.classList.remove('pulso'));
    esperar(QUEDARSE, soltar);
  }

  function soltar() {
    fase = 'soltar';
    const p = planetas[activo];
    p.classList.remove('en-centro');
    // Apunta a donde va a estar su lugar en la órbita cuando termine de volver.
    const destino = posicion(activo, giro + VELOCIDAD * SOLTAR);
    mover(p, destino.x, destino.y, `left ${SOLTAR}ms ${CURVA_VUELTA}, top ${SOLTAR}ms ${CURVA_VUELTA}`);
    esperar(SOLTAR, () => {
      fase = 'orbita';
      p.querySelector('.planeta-bola').classList.add('boop');
      esperar(500, () => p.querySelector('.planeta-bola').classList.remove('boop'));
      esperar(PAUSA, () => ciclo((activo + 1) % areas.length));
    });
  }

  function iniciar() {
    pintar();
    ciclo(0);
    // Sólo se anima mientras la sección está en pantalla.
    ICAP.alVerse(ICAP.$('#areas'), (visible) => {
      if (visible === corriendo) return;
      corriendo = visible;
      if (visible) requestAnimationFrame((t) => cuadro(t, t));
    }, 0.05);
  }

  return { iniciar };
})();
