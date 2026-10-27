/* Tira de organizaciones: avanza sola y se puede arrastrar (mouse o dedo),
   con inercia al soltar. Tocar un logo lo pinta a color y abre una nota con
   sus proyectos; cada proyecto lleva al explorador ya filtrado. */
ICAP.aliados = (() => {
  const VELOCIDAD = -0.035; // px por milisegundo
  const UMBRAL_ARRASTRE = 6;

  let desplazamiento = 0;
  let inercia = 0;
  let mitad = 0;
  let arrastre = null;
  let elegido = null;

  function pintar() {
    const tarjetas = ICAP.ALIADOS.map((a, i) => {
      const n = ICAP.proyectosDeAliado(a).length;
      return `
        <button type="button" class="logo-aliado" data-i="${i}" title="${a.nombre}">
          <img src="assets/logos/${a.logo}.png" alt="${a.sigla}" loading="lazy" draggable="false">
          <span class="sigla">${a.sigla}</span>
          ${n ? `<span class="cuantos">${n}</span>` : ''}
        </button>`;
    }).join('');
    // Dos copias seguidas: al pasar la mitad se vuelve al inicio sin que se note.
    ICAP.$('#pistaAliados').innerHTML = tarjetas + tarjetas.replace(/<button /g, '<button tabindex="-1" aria-hidden="true" ');
  }

  function animar(ahora, antes) {
    const dt = Math.min(ahora - antes, 50);
    if (!arrastre) {
      inercia *= 0.94;
      if (Math.abs(inercia) < 0.01) inercia = 0;
      desplazamiento += (elegido === null ? VELOCIDAD : 0) * dt + inercia * dt;
    }
    mitad = ICAP.$('#pistaAliados').scrollWidth / 2;
    if (mitad) {
      if (desplazamiento <= -mitad) desplazamiento += mitad;
      if (desplazamiento > 0) desplazamiento -= mitad;
    }
    ICAP.$('#pistaAliados').style.transform = `translateX(${desplazamiento}px)`;
    requestAnimationFrame((t) => animar(t, ahora));
  }

  function escucharArrastre() {
    const tira = ICAP.$('#tira');
    tira.addEventListener('pointerdown', (e) => {
      arrastre = { x: e.clientX, inicio: desplazamiento, ultimoX: e.clientX, ultimoT: e.timeStamp, movio: false, logo: e.target.closest('.logo-aliado') };
      inercia = 0;
    });
    tira.addEventListener('pointermove', (e) => {
      if (!arrastre) return;
      const dx = e.clientX - arrastre.x;
      if (!arrastre.movio && Math.abs(dx) > UMBRAL_ARRASTRE) {
        arrastre.movio = true;
        tira.setPointerCapture(e.pointerId);
        tira.classList.add('arrastrando');
      }
      if (!arrastre.movio) return;
      desplazamiento = arrastre.inicio + dx;
      const dt = e.timeStamp - arrastre.ultimoT;
      if (dt > 0) inercia = (e.clientX - arrastre.ultimoX) / dt;
      arrastre.ultimoX = e.clientX;
      arrastre.ultimoT = e.timeStamp;
    });
    const terminar = () => {
      if (!arrastre) return;
      if (!arrastre.movio && arrastre.logo) abrir(+arrastre.logo.dataset.i, arrastre.logo);
      tira.classList.remove('arrastrando');
      arrastre = null;
    };
    tira.addEventListener('pointerup', terminar);
    tira.addEventListener('pointercancel', () => { arrastre = null; tira.classList.remove('arrastrando'); });
    // Con teclado: Enter/Espacio sobre un logo también abre la nota.
    tira.addEventListener('keydown', (e) => {
      const logo = e.target.closest('.logo-aliado');
      if (logo && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); abrir(+logo.dataset.i, logo); }
    });
  }

  function notaHtml(a) {
    const proyectos = ICAP.proyectosDeAliado(a);
    const lista = proyectos.map((p) => `
      <button type="button" class="nota-proyecto" data-id="${p.id}">
        <span class="puntos">${p.etiquetas.map((id) => `<i style="--c:${ICAP.etiqueta(id).color}"></i>`).join('')}</span>
        <span>${p.titulo}</span><i data-lucide="chevron-right"></i>
      </button>`).join('');
    return `
      <div class="nota-cabeza">
        <img src="assets/logos/${a.logo}.png" alt="">
        <div><small>Organización aliada · ${a.sigla}</small><h4>${a.nombre}</h4></div>
        <button type="button" class="nota-cerrar" aria-label="Cerrar"><i data-lucide="x"></i></button>
      </div>
      <div class="nota-cuerpo">
        ${proyectos.length
          ? `<span class="nota-titulo">Proyectos relacionados · ${proyectos.length}</span>${lista}
             <button type="button" class="boton ver-todos">Ver ${proyectos.length === 1 ? 'el proyecto' : `los ${proyectos.length} proyectos`} en el explorador <i data-lucide="arrow-right"></i></button>`
          : '<p>Organización con la que el ICAP colabora. Todavía no hay proyectos suyos en la clasificación de la última década.</p>'}
      </div>`;
  }

  function abrir(i, logo) {
    const a = ICAP.ALIADOS[i];
    elegido = i;
    document.querySelectorAll('.logo-aliado').forEach((l) => l.classList.toggle('elegido', +l.dataset.i === i));

    const nota = ICAP.$('#notaAliado');
    nota.innerHTML = notaHtml(a);
    nota.hidden = false;
    const r = logo.getBoundingClientRect();
    const ancho = 360;
    nota.style.left = `${Math.max(16, Math.min(r.left + r.width / 2 - ancho / 2, innerWidth - ancho - 16))}px`;
    const abajo = innerHeight - r.bottom > 320;
    nota.style.top = abajo ? `${r.bottom + 12}px` : 'auto';
    nota.style.bottom = abajo ? 'auto' : `${innerHeight - r.top + 12}px`;
    if (innerWidth <= 640) document.body.insertAdjacentHTML('beforeend', '<div class="velo" id="velo"></div>');
    ICAP.iconos();

    nota.querySelector('.nota-cerrar').onclick = cerrar;
    nota.querySelectorAll('.nota-proyecto').forEach((b) => {
      b.onclick = () => irA({ proyecto: ICAP.PROYECTOS.find((p) => p.id === +b.dataset.id) });
    });
    const todos = nota.querySelector('.ver-todos');
    if (todos) todos.onclick = () => irA({ aliado: a });
  }

  function irA(filtro) {
    cerrar();
    ICAP.proyectos.filtrar(filtro);
    ICAP.$('#proyectos').scrollIntoView({ behavior: 'smooth' });
  }

  function cerrar() {
    if (elegido === null) return;
    elegido = null;
    ICAP.$('#notaAliado').hidden = true;
    ICAP.$('#velo')?.remove();
    document.querySelectorAll('.logo-aliado.elegido').forEach((l) => l.classList.remove('elegido'));
  }

  function iniciar() {
    pintar();
    escucharArrastre();
    requestAnimationFrame((t) => animar(t, t));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrar(); });
    document.addEventListener('pointerdown', (e) => {
      if (elegido !== null && !e.target.closest('#notaAliado, .logo-aliado')) cerrar();
    });
    addEventListener('scroll', () => { if (innerWidth > 640) cerrar(); }, { passive: true });
  }

  return { iniciar };
})();
