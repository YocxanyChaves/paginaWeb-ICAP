/* Conozca más, versión Biblioteca: un brochure tríptico que se despliega como
   uno de verdad. Tiene tres paneles: el del centro queda fijo, el derecho se
   dobla sobre él y el izquierdo se dobla encima de todo (su cara de afuera es
   la portada).
   - Primer toque: el panel izquierdo se abre hacia la izquierda; se ven las
     primeras secciones y, todavía doblado, el derecho (un panel de marca).
   - Segundo toque: el derecho se abre hacia la derecha; quedan las secciones
     y, en el último panel, sólo el enlace al brochure completo.
   Un tercer toque (o "Volver a doblar") lo cierra en el orden contrario. La portada y los paneles
   de marca usan elementos del brochure en línea (degradado, ondas, cápsula y
   el emblema con su órbita punteada). Las pestañas cambian de departamento:
   color, secciones y enlace. */
ICAP.folleto = (() => {
  const PLIEGUE = 1400; // ms, igual que las animaciones .gira-abre y .gira-cierra
  const LOGO = 'assets/img/icap-logo-mark.png';
  const ESCUDO = 'assets/img/icap-escudo.svg';
  const DEPARTAMENTOS = [
    {
      nombre: 'Asistencia técnica', color: '#0B5A96', ic: 'handshake',
      url: 'https://yocxanychaves.github.io/ICAP-vCard/',
      desc: 'Acompañamiento a instituciones públicas de la región, de la mano de una red de especialistas.',
      secciones: [
        ['compass', 'Misión'], ['sparkles', 'Valores'], ['layout-grid', 'Áreas de especialización'],
        ['map-pinned', 'Presencia en la región'], ['folder-kanban', 'Proyectos'], ['users', 'Autoridades'], ['phone', 'Contacto']
      ]
    },
    {
      nombre: 'Académico', color: '#3F7F2A', ic: 'graduation-cap',
      url: 'https://yocxanychaves.github.io/ICAP-vCard/docencia/',
      desc: 'Formación de posgrado, investigación y publicaciones para la gestión pública centroamericana.',
      secciones: [
        ['graduation-cap', 'Formación'], ['lightbulb', 'Impacto'], ['flask-conical', 'Investigación'],
        ['book-marked', 'Publicaciones'], ['orbit', 'Áreas académicas'], ['users', 'Autoridades'], ['phone', 'Contacto']
      ]
    }
  ];
  let actual = 0;
  let paso = 0; // 0 cerrado · 1 abierto el izquierdo · 2 abierto del todo
  let ocupado = false;

  const ondas = `
    <svg class="fp-ondas" viewBox="0 0 100 200" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 150 C 20 140, 40 165, 60 152 S 90 140, 100 147" />
      <path d="M0 170 C 25 160, 45 182, 66 171 S 90 162, 100 167" opacity=".6" />
      <path d="M0 34 C 26 25, 50 46, 72 35 S 92 30, 100 33" opacity=".5" />
    </svg>`;
  const lista = (secciones) => `<ol class="fp-secciones">${secciones.map(([ic, nombre]) => `
    <li><span><i data-lucide="${ic}"></i></span>${nombre}</li>`).join('')}</ol>`;

  function folletoHtml(d) {
    const mitad = 4;
    const portada = `
      ${ondas}
      <span class="fp-pildora">Brochure</span>
      <span class="fp-emblema"><img src="${LOGO}" alt="" draggable="false"></span>
      <strong>${d.nombre}</strong>
      <small>Instituto Centroamericano de Administración Pública</small>
      <span class="fp-pasar">Abrir<i data-lucide="arrow-left"></i></span>`;
    const marca = `
      ${ondas}
      <img class="fp-escudo-blanco" src="${ESCUDO}" alt="" draggable="false">
      <strong>Dos departamentos, un mismo instituto</strong>
      <span class="fp-pasar">Desplegar<i data-lucide="arrow-right"></i></span>`;
    const izquierda = `
      <span class="fp-kicker">Contenido</span>
      <h4>Lo que encontrará</h4>
      ${lista(d.secciones.slice(0, mitad))}`;
    const centro = `
      <img class="fp-agua" src="${ESCUDO}" alt="" draggable="false">
      <span class="fp-kicker">Y además</span>
      ${lista(d.secciones.slice(mitad))}
      <span class="fp-firma">ICAP · ${d.nombre}</span>`;
    const derecha = `
      <img class="fp-agua centro" src="${ESCUDO}" alt="" draggable="false">
      <span class="fp-kicker">Brochure completo</span>
      <h4>Véalo completo en línea</h4>
      <a class="fp-boton" href="${d.url}" target="_blank" rel="noopener">Abrir<i data-lucide="arrow-up-right"></i></a>
      <button type="button" class="fp-volver"><i data-lucide="rotate-ccw"></i>Volver a doblar</button>`;
    return `
      <div class="panel-f centro"><div class="cara adentro fp-papel">${centro}</div></div>
      <div class="panel-f derecho pliegue">
        <div class="cara adentro fp-papel fp-final">${derecha}</div>
        <div class="cara afuera fp-color fp-marca">${marca}</div>
      </div>
      <div class="panel-f izquierdo pliegue">
        <div class="cara adentro fp-papel">${izquierda}</div>
        <div class="cara afuera fp-color fp-portada">${portada}</div>
      </div>`;
  }

  function pintarPestanas() {
    ICAP.$('#folletoPestanas').innerHTML = DEPARTAMENTOS.map((d, i) => `
      <button type="button" role="tab" class="tomo-pestana" data-i="${i}" style="--c:${d.color}">
        <i data-lucide="${d.ic}"></i>${d.nombre}
      </button>`).join('');
    ICAP.$('#folletoPestanas').addEventListener('click', (e) => {
      const p = e.target.closest('.tomo-pestana');
      if (p && +p.dataset.i !== actual) mostrar(+p.dataset.i);
    });
  }

  function panelHtml(d) {
    return `
      <small class="tomo-kicker">Departamento</small>
      <h3>${d.nombre}</h3>
      <p>${d.desc}</p>
      <p class="folleto-pista"><i data-lucide="hand"></i>Despliegue el brochure: tóquelo para abrir cada pliegue.</p>
      <a class="tomo-ir" href="${d.url}" target="_blank" rel="noopener">Ir directo al brochure<i data-lucide="arrow-up-right"></i></a>`;
  }

  // Cambia de paso. Si se pide, el pliegue que se mueve lleva la animación de
  // giro (.gira-abre / .gira-cierra) mientras dura.
  function marcarPaso(n, animar = true) {
    const antes = paso;
    paso = n;
    const folleto = ICAP.$('#folleto');
    folleto.classList.toggle('paso-1', n >= 1);
    folleto.classList.toggle('paso-2', n >= 2);
    if (!animar || antes === n || ICAP.sinMovimiento) return;
    const pliegue = ICAP.$(Math.max(antes, n) === 1 ? '#folleto .izquierdo' : '#folleto .derecho');
    const clase = n > antes ? 'gira-abre' : 'gira-cierra';
    pliegue.classList.remove('gira-abre', 'gira-cierra');
    // Si la portada estaba levantada por el mouse, el giro arranca desde ahí.
    pliegue.style.setProperty('--desde', antes === 0 && folleto.matches(':hover') ? '136deg' : '180deg');
    void pliegue.offsetWidth;
    pliegue.classList.add(clase);
    setTimeout(() => pliegue.classList.remove(clase), PLIEGUE);
  }

  function mostrar(i) {
    actual = i;
    const d = DEPARTAMENTOS[i];
    document.querySelectorAll('#folletoPestanas .tomo-pestana').forEach((p, j) => p.setAttribute('aria-selected', j === i));
    ICAP.$('#folletos').style.setProperty('--c', d.color);
    const folleto = ICAP.$('#folleto');
    folleto.innerHTML = folletoHtml(d);
    paso = 0;
    marcarPaso(0, false);
    folleto.classList.remove('entra');
    void folleto.offsetWidth;
    folleto.classList.add('entra');
    ICAP.$('#folletoPanel').innerHTML = panelHtml(d);
    ICAP.iconos();
  }

  // Abre el pliegue que sigue; mientras se mueve no acepta otro toque.
  function desplegar() {
    if (ocupado || paso >= 2) return;
    ocupado = true;
    marcarPaso(paso + 1);
    setTimeout(() => { ocupado = false; }, ICAP.sinMovimiento ? 0 : PLIEGUE * 0.7);
  }

  // Vuelve a doblar: primero el derecho y después el izquierdo.
  function doblar() {
    if (ocupado) return;
    ocupado = true;
    marcarPaso(1);
    setTimeout(() => {
      marcarPaso(0);
      setTimeout(() => { ocupado = false; }, ICAP.sinMovimiento ? 0 : PLIEGUE);
    }, ICAP.sinMovimiento ? 0 : PLIEGUE * 0.6);
  }

  function escuchar() {
    ICAP.$('#folleto').addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      if (e.target.closest('.fp-volver') || paso >= 2) return doblar();
      desplegar();
    });
  }

  function iniciar() {
    pintarPestanas();
    escuchar();
    mostrar(0);
  }

  return { iniciar };
})();
