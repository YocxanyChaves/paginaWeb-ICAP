/* Áreas de especialización como un librero: cada área es un libro del color
   del área y el grosor del lomo es su cantidad de proyectos; entre ellos hay
   libros de relleno, sin nombre, con el logo del ICAP. Hay dos formas de ver:
   - Ficha: al tocar un libro, éste sube un poco y su vista previa aparece al
     lado del librero, sin abrir nada.
   - Libro: el libro sale del librero y se abre encima; a la izquierda la
     portadilla, a la derecha la descripción, las cifras y las áreas con que
     más se trabaja. Para pasar a otro libro se da vuelta una hoja. */
ICAP.libros = (() => {
  const areas = ICAP.ETIQUETAS;
  const ABRIR = 1100; // ms, igual que la transición de .libro3d y .tapa
  const HOJA = 1000; // ms, igual que la animación de .hoja
  const angosto = matchMedia('(max-width: 700px)');
  const apilado = matchMedia('(max-width: 980px)');
  const LOGO = 'assets/img/icap-logo-mark.png';

  const cuantos = areas.map((a) => ICAP.proyectosDeEtiquetas([a.id]).length);
  const maxCuantos = Math.max(...cuantos);
  let modo = 'ficha';
  let elegido = -1;
  let abierto = -1;
  let pasando = false;
  let timer = null;

  // Alturas fijas pero desparejas, como en un estante de verdad.
  const desparejo = (n) => Math.sin(n * 12.9898) * 0.5 + 0.5;
  const alto = (i) => 178 + Math.round(desparejo(i) * 50);
  const ancho = (i) => 40 + Math.round((cuantos[i] / maxCuantos) * 34);
  // Sobre los colores claros (amarillos) el texto va oscuro para que se lea.
  const tinta = (hex) => {
    const [r, g, b] = [1, 3, 5].map((k) => parseInt(hex.slice(k, k + 2), 16));
    return 0.299 * r + 0.587 * g + 0.114 * b > 165 ? '#2B1A00' : '#fff';
  };
  const colores = (a) => `--c:${a.color};--tinta:${tinta(a.color)}`;

  // Los de relleno van en tonos navy y celeste del ICAP, más angostos que los
  // de las áreas, para que no compitan con ellos.
  const RELLENO = ['#003366', '#5E87AE', '#0B4F8A', '#9FC6E8', '#1D4D7A', '#7FA6C9'];

  // El librero: tres niveles de tres nichos. Cada nicho dice hacia qué lado se
  // acomodan sus libros y cuáles lleva: las áreas ('l' y su número) y los de
  // relleno ('r'). En el del centro va la placa del ICAP.
  const NICHOS = [
    { lado: 'inicio', cosas: ['l0', 'l1', 'r'] },
    { lado: 'centro', cosas: ['r', 'l2', 'l3'] },
    { lado: 'fin', cosas: ['r', 'l4', 'l5'] },
    { lado: 'inicio', cosas: ['l6', 'r', 'r'] },
    { lado: 'centro', cosas: ['placa'] },
    { lado: 'fin', cosas: ['r', 'l7', 'l8'] },
    { lado: 'inicio', cosas: ['l9', 'l10', 'r'] },
    { lado: 'centro', cosas: ['l11', 'r', 'l12'] },
    { lado: 'fin', cosas: ['r', 'r', 'l13'] },
  ];

  function libroHtmlEstante(i) {
    const a = areas[i];
    return `
      <button type="button" class="libro" data-i="${i}" style="${colores(a)};--ancho:${ancho(i)}px;--alto:${alto(i)}px"
        aria-label="${a.nombre}, ${cuantos[i]} proyectos">
        <span class="lomo">
          <span class="lomo-banda"></span>
          <span class="lomo-titulo">${a.nombre}</span>
          <i data-lucide="${a.ic}"></i>
          <span class="lomo-banda"></span>
        </span>
      </button>`;
  }

  function rellenoHtml(n) {
    const color = RELLENO[n % RELLENO.length];
    const claro = tinta(color) !== '#fff';
    return `
      <span class="relleno${claro ? ' claro' : ''}" aria-hidden="true"
        style="--c:${color};--tinta:${tinta(color)};--ancho:${26 + Math.round(desparejo(n + 40) * 10)}px;--alto:${170 + Math.round(desparejo(n + 7) * 58)}px">
        <span class="lomo">
          <span class="lomo-banda"></span>
          <img src="${LOGO}" alt="" draggable="false">
          <span class="lomo-banda"></span>
        </span>
      </span>`;
  }

  // La placa del centro es un botón: muestra dónde están las áreas.
  const placaHtml = `
    <button type="button" class="placa" aria-label="Resaltar los ${areas.length} libros de las áreas">
      <img src="${LOGO}" alt="" draggable="false">
      <span>Asistencia técnica</span>
      <small>${areas.length} áreas</small>
    </button>`;

  // Un libro de área salta (la animación .saltando de libros.css); los de
  // relleno siempre se quedan quietos. Si ya está saltando, termina su salto:
  // así al pasar el mouse rápido por encima de varios queda una estela de
  // libros saltando uno detrás del otro.
  const SALTO = 750; // ms, igual que la animación salto
  function saltar(lomo, demora = 0) {
    if (lomo.classList.contains('saltando') || ICAP.sinMovimiento) return;
    lomo.style.setProperty('--demora', `${demora}ms`);
    lomo.classList.add('saltando');
    setTimeout(() => lomo.classList.remove('saltando'), demora + SALTO);
  }

  // Tocar la placa: los de relleno se apagan y las áreas saltan una por una,
  // en orden, para que se vea dónde está cada una.
  const PASO = 90;
  let resaltando = null;
  function resaltar() {
    const librero = ICAP.$('#estante');
    clearTimeout(resaltando);
    librero.classList.add('resaltando');
    document.querySelectorAll('.libro').forEach((l) => saltar(l, +l.dataset.i * PASO));
    resaltando = setTimeout(() => librero.classList.remove('resaltando'), areas.length * PASO + SALTO + 400);
  }

  // Vista previa sin libro elegido: dice qué hacer según la forma de ver.
  const introHtml = () => `
    <div class="vp-cuerpo vp-intro">
      <small class="vp-kicker">Biblioteca de áreas</small>
      <h3>${modo === 'ficha' ? 'Elija un libro' : 'Abra un libro'}</h3>
      <span class="vp-filete"></span>
      <p>${modo === 'ficha'
        ? 'Toque cualquier libro con nombre y aquí verá de qué trata el área, sus cifras y con qué otras áreas se trabaja.'
        : 'Toque cualquier libro con nombre para sacarlo del librero y leerlo completo. Con las flechas pasa de un libro a otro.'}</p>
      <dl class="vp-cifras">
        <div><dt>Áreas</dt><dd>${areas.length}</dd></div>
        <div><dt>Proyectos</dt><dd>${ICAP.PROYECTOS.length}</dd></div>
      </dl>
    </div>`;

  // La vista previa: lo esencial del área, sin abrir el libro.
  function fichaHtml(i) {
    const a = areas[i];
    const proyectos = ICAP.proyectosDeEtiquetas([a.id]);
    const clientes = new Set(proyectos.map((p) => p.cliente)).size;
    const enCurso = proyectos.filter(ICAP.enCurso).length;
    const cifra = (nombre, n) => `<div><dt>${nombre}</dt><dd>${n}</dd></div>`;
    const relacionados = vecinos(i).map((v) =>
      `<button type="button" class="vp-vecino" data-ver="${v.j}" style="--c:${areas[v.j].color}">${areas[v.j].nombre}</button>`).join('');
    return `
      <div class="vp-cuerpo" style="${colores(a)}">
        <span class="vp-icono-fondo" aria-hidden="true"><i data-lucide="${a.ic}"></i></span>
        <small class="vp-kicker">Área de especialización</small>
        <h3>${a.nombre}</h3>
        <span class="vp-filete"></span>
        <p>${a.desc}</p>
        <dl class="vp-cifras">${cifra('Proyectos', proyectos.length)}${cifra('Clientes', clientes)}${cifra('En curso', enCurso)}</dl>
        ${relacionados ? `<h4>Se trabaja junto a</h4><div class="vp-vecinos">${relacionados}</div>` : ''}
        <button type="button" class="vp-abrir" data-abrir="${i}">Abrir el libro<i data-lucide="arrow-right"></i></button>
      </div>`;
  }

  function pintarVista(i = -1) {
    ICAP.$('#vistaPrevia').innerHTML = i === -1 ? introHtml() : fichaHtml(i);
    ICAP.iconos();
  }

  // En modo ficha, tocar un libro lo sube y muestra su vista previa; tocarlo
  // otra vez lo devuelve a su lugar.
  function elegir(i, desdeVecino = false) {
    elegido = elegido === i && !desdeVecino ? -1 : i;
    document.querySelectorAll('.libro').forEach((l) => {
      l.classList.toggle('elegido', +l.dataset.i === elegido);
      if (modo === 'ficha') l.setAttribute('aria-pressed', +l.dataset.i === elegido);
    });
    pintarVista(elegido);
    // Cuando la vista previa queda debajo del librero, se acerca para que se vea.
    if (elegido !== -1 && apilado.matches) {
      ICAP.$('#vistaPrevia').scrollIntoView({ block: 'nearest', behavior: ICAP.sinMovimiento ? 'auto' : 'smooth' });
    }
  }

  function cambiarModo(nuevo) {
    if (nuevo === modo) return;
    modo = nuevo;
    document.querySelectorAll('.vista-boton').forEach((b) => b.setAttribute('aria-checked', b.dataset.modo === modo));
    if (elegido !== -1) elegir(elegido);
    else pintarVista();
    document.querySelectorAll('.libro').forEach((l) => {
      if (modo === 'ficha') l.setAttribute('aria-pressed', false);
      else l.removeAttribute('aria-pressed');
    });
  }

  function pintarEstante() {
    let rellenos = 0;
    const cosaHtml = (cosa) => {
      if (cosa === 'r') return rellenoHtml(rellenos++);
      if (cosa === 'placa') return placaHtml;
      return libroHtmlEstante(+cosa.slice(1));
    };
    ICAP.$('#estante').innerHTML = NICHOS.map((n) => `
      <div class="nicho ${n.lado}${n.cosas.includes('placa') ? ' con-placa' : ''}">${n.cosas.map(cosaHtml).join('')}</div>`).join('');
    pintarVista();
    document.querySelectorAll('.libro').forEach((l) => l.setAttribute('aria-pressed', false));
    ICAP.$('#estante').addEventListener('mouseover', (e) => {
      // Sólo al entrar al libro, no al moverse entre sus partes.
      const lomo = e.target.closest('.libro');
      if (lomo && !lomo.contains(e.relatedTarget)) saltar(lomo);
    });
    ICAP.$('#estante').addEventListener('click', (e) => {
      if (e.target.closest('.placa')) return resaltar();
      const libro = e.target.closest('.libro');
      if (!libro) return;
      if (modo === 'ficha') elegir(+libro.dataset.i);
      else abrir(+libro.dataset.i);
    });
    ICAP.$('#vistaPrevia').addEventListener('click', (e) => {
      const abrirla = e.target.closest('[data-abrir]');
      if (abrirla) return abrir(+abrirla.dataset.abrir);
      const vecino = e.target.closest('[data-ver]');
      if (vecino) elegir(+vecino.dataset.ver, true);
    });
    ICAP.$('#vistas').addEventListener('click', (e) => {
      const boton = e.target.closest('.vista-boton');
      if (boton) cambiarModo(boton.dataset.modo);
    });
  }

  function vecinos(i) {
    const id = areas[i].id;
    return areas
      .map((b, j) => ({ j, n: j === i ? 0 : ICAP.PROYECTOS.filter((p) => p.etiquetas.includes(id) && p.etiquetas.includes(b.id)).length }))
      .filter((v) => v.n)
      .sort((x, y) => y.n - x.n)
      .slice(0, 3);
  }

  // Página izquierda: la portadilla.
  function izquierdaHtml(i) {
    const a = areas[i];
    return `
      <img class="agua" src="assets/img/icap-logo-mark.png" alt="" draggable="false">
      <small>Área de especialización</small>
      <span class="filete"></span>
      <strong>${a.nombre}</strong>
      <i data-lucide="${a.ic}"></i>
      <em>Instituto Centroamericano<br>de Administración Pública</em>`;
  }

  // Página derecha: el texto del área.
  function derechaHtml(i) {
    const a = areas[i];
    const proyectos = ICAP.proyectosDeEtiquetas([a.id]);
    const clientes = new Set(proyectos.map((p) => p.cliente)).size;
    const enCurso = proyectos.filter(ICAP.enCurso).length;
    const fila = (nombre, valor) => `<tr><th scope="row">${nombre}</th><td>${valor}</td></tr>`;
    const relacionados = vecinos(i).map((v) => `
      <li><button type="button" class="ir-libro" data-i="${v.j}">${areas[v.j].nombre}</button>
        <span>${v.n} ${v.n === 1 ? 'proyecto' : 'proyectos'} en común</span></li>`).join('');
    return `
      <span class="cabecera">Asistencia técnica · ICAP</span>
      <h3>${a.nombre}</h3>
      <p class="capitular">${a.desc}</p>
      <table class="cifras-libro">
        <caption>En cifras</caption>
        ${fila('Proyectos de la última década', proyectos.length)}
        ${fila('Clientes institucionales', clientes)}
        ${fila('Proyectos en curso', enCurso)}
      </table>
      ${relacionados ? `<h4>Se trabaja junto a</h4><ul class="relacionados">${relacionados}</ul>` : ''}`;
  }

  function libroHtml(i) {
    const a = areas[i];
    return `
      <button type="button" class="lectura-boton cerrar" data-cerrar aria-label="Cerrar libro"><i data-lucide="x"></i></button>
      <button type="button" class="lectura-boton anterior" data-paso="-1" aria-label="Libro anterior"><i data-lucide="chevron-left"></i></button>
      <button type="button" class="lectura-boton siguiente" data-paso="1" aria-label="Libro siguiente"><i data-lucide="chevron-right"></i></button>
      <div class="libro3d" style="${colores(a)}">
        <div class="pagina-der cara-der" aria-labelledby="libroTitulo">${derechaHtml(i).replace('<h3>', '<h3 id="libroTitulo">')}</div>
        <span class="cinta" aria-hidden="true"></span>
        <div class="tapa">
          <div class="tapa-frente">
            <span class="tapa-marco"></span>
            <strong>${a.nombre}</strong>
            <span class="tapa-filete"></span>
            <img src="assets/img/icap-logo-mark.png" alt="" draggable="false">
          </div>
          <div class="tapa-dorso cara-izq">${izquierdaHtml(i)}</div>
        </div>
      </div>`;
  }

  function marcarLomo(i) {
    document.querySelectorAll('.libro').forEach((l) => l.classList.toggle('afuera', +l.dataset.i === i));
  }

  function abrir(i) {
    clearTimeout(timer);
    abierto = i;
    marcarLomo(i);
    const libro = ICAP.$('#libroAbierto');
    libro.innerHTML = libroHtml(i);
    ICAP.iconos();
    ICAP.$('#lectura').hidden = false;
    const l3d = libro.querySelector('.libro3d');
    l3d.classList.add('cerrado');
    // Dos cuadros: el navegador pinta el libro cerrado y luego anima la apertura.
    requestAnimationFrame(() => requestAnimationFrame(() => l3d.classList.remove('cerrado')));
    libro.querySelector('.cerrar').focus({ preventScroll: true });
    // El lector se abre sobre el librero, no a pantalla completa: se acomoda la
    // vista para que quede entero.
    libro.scrollIntoView({ block: 'center', behavior: ICAP.sinMovimiento ? 'auto' : 'smooth' });
  }

  // Pasar a otro libro con el lector abierto: se cambia el contenido de abajo
  // y encima se da vuelta una hoja con la página vieja de un lado y la nueva
  // del otro. Hacia adelante gira la hoja derecha; hacia atrás, la izquierda.
  function pasar(destino, adelante) {
    if (pasando || destino === abierto) return;
    const l3d = ICAP.$('#libroAbierto .libro3d');
    const antes = { izq: l3d.querySelector('.cara-izq').innerHTML, der: l3d.querySelector('.cara-der').innerHTML.replace(' id="libroTitulo"', '') };
    const colorAntes = l3d.getAttribute('style');
    const a = areas[destino];

    abierto = destino;
    marcarLomo(destino);
    l3d.setAttribute('style', colores(a));
    l3d.querySelector('.cara-izq').innerHTML = izquierdaHtml(destino);
    l3d.querySelector('.cara-der').innerHTML = derechaHtml(destino).replace('<h3>', '<h3 id="libroTitulo">');
    l3d.querySelector('.tapa-frente strong').textContent = a.nombre;
    l3d.querySelector('.cara-der').scrollTop = 0;

    if (angosto.matches || ICAP.sinMovimiento) {
      l3d.querySelector('.cara-der').classList.remove('aparece');
      void l3d.offsetWidth;
      l3d.querySelector('.cara-der').classList.add('aparece');
      ICAP.iconos();
      return;
    }

    pasando = true;
    const nueva = { izq: izquierdaHtml(destino), der: derechaHtml(destino) };
    // La hoja que gira y, debajo de ella, la página vieja del lado que todavía no se tapa.
    const hoja = adelante
      ? `<div class="hoja-fija cara-izq" style="${colorAntes}">${antes.izq}</div>
         <div class="hoja adelante">
           <div class="hoja-frente cara-der" style="${colorAntes}">${antes.der}</div>
           <div class="hoja-dorso cara-izq" style="${colores(a)}">${nueva.izq}</div>
         </div>`
      : `<div class="hoja-fija cara-der" style="${colorAntes}">${antes.der}</div>
         <div class="hoja atras">
           <div class="hoja-frente cara-izq" style="${colorAntes}">${antes.izq}</div>
           <div class="hoja-dorso cara-der" style="${colores(a)}">${nueva.der}</div>
         </div>`;
    l3d.insertAdjacentHTML('beforeend', hoja);
    ICAP.iconos();
    timer = setTimeout(() => {
      l3d.querySelectorAll('.hoja, .hoja-fija').forEach((h) => h.remove());
      pasando = false;
    }, HOJA);
  }

  const paso = (n) => pasar((abierto + n + areas.length) % areas.length, n > 0);

  function cerrar() {
    if (abierto === -1) return;
    const i = abierto;
    abierto = -1;
    pasando = false;
    clearTimeout(timer);
    const l3d = ICAP.$('#libroAbierto .libro3d');
    l3d.querySelectorAll('.hoja, .hoja-fija').forEach((h) => h.remove());
    l3d.classList.add('cerrado', 'saliendo');
    timer = setTimeout(() => {
      ICAP.$('#lectura').hidden = true;
      const lomo = ICAP.$(`.libro[data-i="${i}"]`);
      lomo.classList.remove('afuera');
      lomo.focus({ preventScroll: true });
    }, ICAP.sinMovimiento ? 0 : ABRIR * 0.7);
  }

  function escucharLectura() {
    ICAP.$('#lectura').addEventListener('click', (e) => {
      if (e.target.closest('[data-cerrar]')) return cerrar();
      const boton = e.target.closest('[data-paso]');
      if (boton) return paso(+boton.dataset.paso);
      const ir = e.target.closest('.ir-libro');
      if (ir) pasar(+ir.dataset.i, +ir.dataset.i > abierto);
    });
    document.addEventListener('keydown', (e) => {
      if (abierto === -1) return;
      if (e.key === 'Escape') cerrar();
      if (e.key === 'ArrowRight') paso(1);
      if (e.key === 'ArrowLeft') paso(-1);
    });
  }

  function iniciar() {
    pintarEstante();
    escucharLectura();
  }

  return { iniciar };
})();
