/* Generación de capacidades, tercera versión. Arriba una línea de tiempo con
   las cuatro etapas; abajo las bolitas del diagrama oficial y la tarjeta de la
   etapa. El rayito es el mismo de la versión interactiva y sigue los mismos
   arcos en zigzag (sin dibujarlos), pero se queda dando vueltas alrededor de la etapa
   elegida. Si se cambia de etapa, sigue su camino por los arcos hasta llegar a
   la nueva; si se cambia otra vez antes de que llegue, sólo cambia de rumbo.
   La etapa avanza sola cada cierto tiempo mientras la sección está en pantalla:
   la línea de tiempo se va llenando hacia la etapa siguiente y, al llegar,
   ésta se activa. */
ICAP.etapas3 = (() => {
  const INTERVALO = 6000;
  const ANCHO = 500;
  const R = 60;
  const Y = 100;
  const CENTROS = [70, 190, 310, 430];
  const etapas = ICAP.ETAPAS;

  // La misma tira de pedacitos del rayo de la versión interactiva: punta blanca
  // y cola que se apaga hacia el azul ICAP, a la misma velocidad.
  const COLORES = ['#ffffff', '#e0f3ff', '#bfe6ff', '#9fd8ff', '#7dd3fc', '#4FB2F2', '#2a9be0', '#0090DD', '#0077C8', 'rgba(0, 119, 200, .5)'];
  const VELOCIDAD = 215; // unidades del viewBox por segundo, como el circuito de 14 s
  const PEDAZO = 18; // largo de cada pedacito
  const SEPARACION = 12; // distancia entre un pedacito y el siguiente
  const pedazos = COLORES.map((color, k) =>
    `<path class="rayo3" stroke="${color}" style="stroke-width:${(3.4 - k * 0.22).toFixed(2)}" />`
  ).reverse().join(''); // la punta se dibuja de última, encima de la cola

  // El rayo va siempre sobre el círculo de alguna bolita. Los círculos vecinos
  // se tocan (los centros están a 2R), así que para pasar a la bolita de al
  // lado sigue girando hasta el punto donde se tocan y ahí cambia de círculo.
  // Cada círculo gira al revés que su vecino para que el paso no tenga quiebre:
  // es el mismo recorrido en ocho de los arcos del diagrama.
  const sentido = (k) => (k % 2 ? -1 : 1);
  const DOS_PI = Math.PI * 2;
  const rayo = { k: 0, angulo: Math.PI / 2, rastro: [] };

  let actual = 0;
  let reloj = null;
  let visible = false;
  let cuadro = null;
  let antes = 0;
  let ritmo = 1;
  let tramo = null;

  const punto = () => ({ x: CENTROS[rayo.k] + R * Math.cos(rayo.angulo), y: Y + R * Math.sin(rayo.angulo) });

  // Avanza el rayo una distancia: si la etapa elegida es otra, al llegar al
  // punto donde se toca con el círculo vecino (en esa dirección) se pasa a él.
  function avanzar(distancia) {
    let giro = distancia / R;
    while (giro > 0) {
      const destino = actual === rayo.k ? null : actual > rayo.k ? 1 : -1;
      if (destino === null) { rayo.angulo += sentido(rayo.k) * giro; break; }
      const salida = destino === 1 ? 0 : Math.PI;
      const falta = (((salida - rayo.angulo) * sentido(rayo.k)) % DOS_PI + DOS_PI) % DOS_PI;
      if (giro < falta) { rayo.angulo += sentido(rayo.k) * giro; break; }
      giro -= falta;
      rayo.k += destino;
      rayo.angulo = destino === 1 ? Math.PI : 0;
    }
    rayo.angulo %= DOS_PI;
    const p = punto();
    const ultimo = rayo.rastro[rayo.rastro.length - 1];
    p.s = ultimo ? ultimo.s + distancia : 0;
    rayo.rastro.push(p);
    // Sólo se guarda lo que ocupa la cola.
    const largo = COLORES.length * SEPARACION + PEDAZO;
    while (rayo.rastro.length > 2 && p.s - rayo.rastro[1].s > largo) rayo.rastro.shift();
  }

  // Punto del rastro a cierta distancia por detrás de la punta.
  function atras(d) {
    const r = rayo.rastro;
    const s = r[r.length - 1].s - d;
    let i = r.length - 1;
    while (i > 0 && r[i - 1].s > s) i--;
    if (i === 0) return r[0];
    const a = r[i - 1];
    const b = r[i];
    const t = (s - a.s) / (b.s - a.s || 1);
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  function dibujarRayo() {
    const caminos = [...document.querySelectorAll('.rayo3')].reverse();
    caminos.forEach((c, k) => {
      const desde = k * SEPARACION;
      const puntos = [0, 1, 2, 3].map((n) => atras(desde + (PEDAZO * n) / 3));
      c.setAttribute('d', 'M' + puntos.map((q) => `${q.x.toFixed(2)} ${q.y.toFixed(2)}`).join(' L'));
    });
  }

  function animar(ahora) {
    const dt = Math.min((ahora - antes) / 1000, 0.05);
    antes = ahora;
    // De camino a otra etapa va un poco más ligero; al llegar vuelve, sin tirones, a su paso de siempre.
    const meta = rayo.k === actual ? 1 : 1.7;
    ritmo += (meta - ritmo) * Math.min(dt * 3, 1);
    avanzar(VELOCIDAD * ritmo * dt);
    dibujarRayo();
    cuadro = requestAnimationFrame(animar);
  }

  // Sólo se anima mientras la sección está en pantalla. Con movimiento
  // reducido el rayo queda quieto en la bolita elegida.
  function moverRayo(encendido) {
    cancelAnimationFrame(cuadro);
    if (ICAP.sinMovimiento) {
      rayo.k = actual;
      rayo.rastro = [];
      for (let n = 0; n < 40; n++) avanzar(4);
      dibujarRayo();
      return;
    }
    if (!encendido) return;
    antes = performance.now();
    cuadro = requestAnimationFrame(animar);
  }

  function pintar() {
    ICAP.$('#submenuEtapas').innerHTML = `
      <div class="lt-riel" aria-hidden="true"><span class="lt-avance"></span></div>` + etapas.map((e, i) => `
      <button type="button" role="tab" class="hito" data-i="${i}" style="--c:${e.color}">
        <span class="hito-punto"></span>
        <span class="hito-num">Etapa 0${i + 1}</span>
        <span class="hito-nombre">${e.nombre}</span>
      </button>`).join('');

    const bolitas = etapas.map((e, i) => `
      <button type="button" class="bolita3" data-i="${i}" aria-label="${e.nombre}"
        style="--c:${e.color};left:${(CENTROS[i] / ANCHO) * 100}%">
        <i data-lucide="${e.ic}"></i>
      </button>`).join('');
    ICAP.$('#ruta3').innerHTML = `
      <svg viewBox="0 0 ${ANCHO} 200" aria-hidden="true">
        <g class="rayo3-luz">${pedazos}</g>
      </svg>${bolitas}`;

    const elegir = (e) => {
      const b = e.target.closest('[data-i]');
      if (b) ir(+b.dataset.i);
    };
    ICAP.$('#submenuEtapas').addEventListener('click', elegir);
    ICAP.$('#ruta3').addEventListener('click', elegir);
  }

  function tarjetaHtml(e, i) {
    const siguiente = etapas[(i + 1) % etapas.length];
    return `
      <article class="tarjeta3" style="--c:${e.color}">
        <img class="t3-agua" src="assets/img/icap-escudo.svg" alt="" aria-hidden="true" draggable="false">
        <header class="t3-cabeza">
          <span class="t3-numero" aria-hidden="true">0${i + 1}</span>
          <div>
            <span class="t3-paso">Etapa ${i + 1} de ${etapas.length}</span>
            <h3>${e.nombre}</h3>
          </div>
          <span class="t3-icono" aria-hidden="true"><i data-lucide="${e.ic}"></i></span>
        </header>
        <p>${e.desc}</p>
        <h4>Qué se entrega</h4>
        <ol class="t3-entrega">${e.entrega.map((x) => `<li>${x}</li>`).join('')}</ol>
        <button type="button" class="t3-siguiente" data-i="${(i + 1) % etapas.length}">
          ${i === etapas.length - 1 ? 'Volver al inicio' : 'Siguiente'}: <b>${siguiente.nombre}</b><i data-lucide="arrow-right"></i>
        </button>
      </article>`;
  }

  // La línea de tiempo: apenas se elige una etapa corre hasta ella y después
  // se va llenando, parejo, hacia la siguiente durante el intervalo.
  const LLEGAR = 350;
  function avanceHasta(fraccion, ms, curva) {
    const avance = ICAP.$('.lt-avance');
    avance.style.transition = ms ? `clip-path ${ms}ms ${curva}` : 'none';
    avance.style.clipPath = `inset(0 ${(100 - fraccion * 100).toFixed(3)}% 0 0)`;
  }
  function moverLinea(i) {
    clearTimeout(tramo);
    const ultima = etapas.length - 1;
    avanceHasta(i / ultima, ICAP.sinMovimiento ? 0 : LLEGAR, 'cubic-bezier(.2, .7, .3, 1)');
    if (!visible || i === ultima || ICAP.sinMovimiento) return;
    tramo = setTimeout(() => avanceHasta((i + 1) / ultima, INTERVALO - LLEGAR, 'linear'), LLEGAR);
  }

  function mostrar(i) {
    actual = i;
    document.querySelectorAll('.hito').forEach((h, j) => {
      h.classList.toggle('activa', j === i);
      h.classList.toggle('pasada', j < i);
      h.setAttribute('aria-selected', j === i);
    });
    document.querySelectorAll('.bolita3').forEach((b, j) => {
      b.classList.toggle('activa', j === i);
      b.classList.toggle('pasada', j < i);
    });
    if (ICAP.sinMovimiento) moverRayo(false);

    const hueco = ICAP.$('#tarjeta3');
    hueco.innerHTML = tarjetaHtml(etapas[i], i);
    hueco.querySelector('.t3-siguiente').onclick = (e) => ir(+e.currentTarget.dataset.i);
    moverLinea(i);
    ICAP.iconos();
  }

  // Elegir a mano reinicia la cuenta, para que no cambie apenas se toca.
  function ir(i) {
    mostrar(i);
    programar();
  }

  function programar() {
    clearInterval(reloj);
    if (visible) reloj = setInterval(() => mostrar((actual + 1) % etapas.length), INTERVALO);
  }

  function iniciar() {
    pintar();
    // Arranca con un pedacito de rastro para que la cola ya se vea.
    for (let n = 0; n < 40; n++) avanzar(4);
    mostrar(0);
    dibujarRayo();
    ICAP.alVerse(ICAP.$('#etapas'), (v) => {
      if (v === visible) return;
      visible = v;
      mostrar(actual);
      programar();
      moverRayo(v);
    }, 0.3);
  }

  return { iniciar };
})();
