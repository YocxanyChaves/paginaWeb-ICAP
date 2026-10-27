/* Generación de capacidades. Las bolitas van unidas por arcos en zigzag (como
   el diagrama oficial) y un rayito de luz da la vuelta completa alrededor de
   cada una antes de pasar a la siguiente, sin parar (CSS, ver .rayo en
   etapas.css). Cada cierto tiempo avanza la etapa: su bolita se agranda y su
   tarjeta entra en el carrusel. */
ICAP.etapas = (() => {
  const INTERVALO = 5000;
  // Geometría dentro del viewBox 500×200: radio de los arcos y centros de las bolitas.
  const ANCHO = 500;
  const R = 60;
  const Y = 100;
  const CENTROS = [70, 190, 310, 430];

  // Medio círculo desde la izquierda o la derecha de una bolita hasta el lado opuesto.
  // `giro` 0 pasa por debajo yendo a la derecha; 1 pasa por arriba.
  const medio = (hastaX, giro) => `A${R} ${R} 0 0 ${giro} ${hastaX} ${Y}`;

  // Recorrido del rayo (no se dibuja, sólo lo sigue la luz): de ida da vuelta y
  // media en cada bolita; de regreso pasa por el lado contrario de cada una y
  // llega al punto de partida, así que es un circuito cerrado sin saltos.
  const IDA = CENTROS.map((c, i) => [medio(c + R, i % 2), medio(c - R, i % 2), medio(c + R, i % 2)].join(' '));
  const REGRESO = [...CENTROS].reverse().map((c, j) => medio(c - R, (CENTROS.length - 1 - j) % 2));
  const CIRCUITO = `M${CENTROS[0] - R} ${Y} ${IDA.join(' ')} ${REGRESO.join(' ')}`;

  // El rayo es una tira de pedacitos que se siguen, como el del portafolio:
  // punta blanca y cola que se apaga hacia el azul ICAP.
  const COLORES = ['#ffffff', '#e0f3ff', '#bfe6ff', '#9fd8ff', '#7dd3fc', '#4FB2F2', '#2a9be0', '#0090DD', '#0077C8', 'rgba(0, 119, 200, .5)'];
  const VUELTA = 14; // segundos por circuito
  const SEPARACION = 4; // de 1000 unidades del recorrido
  const pedazos = COLORES.map((color, k) =>
    `<path class="rayo" d="${CIRCUITO}" pathLength="1000" stroke="${color}"
       style="stroke-width:${(3.4 - k * 0.22).toFixed(2)};animation-delay:${(-VUELTA + k * VUELTA * SEPARACION / 1000).toFixed(3)}s" />`
  ).reverse().join(''); // la punta se dibuja de última, encima de la cola

  let actual = 0;
  let reloj = null;
  let visible = false;

  function pintarRuta() {
    const bolitas = ICAP.ETAPAS.map((e, i) => `
      <button type="button" class="bolita${i === 3 ? ' navy' : ''}" data-i="${i}" aria-label="${e.nombre}"
        style="--c:${e.color};left:${(CENTROS[i] / ANCHO) * 100}%">
        <i data-lucide="${e.ic}"></i>
      </button>`).join('');
    ICAP.$('#ruta').innerHTML = `
      <svg class="arcos" viewBox="0 0 ${ANCHO} 200" aria-hidden="true">
        <g class="rayo-luz" style="--vuelta:${VUELTA}s">${pedazos}</g>
      </svg>${bolitas}`;
    ICAP.$('#ruta').addEventListener('click', (e) => {
      const bolita = e.target.closest('.bolita');
      if (bolita) ir(+bolita.dataset.i);
    });
  }

  function pintarCarrusel() {
    const tarjetas = ICAP.ETAPAS.map((e, i) => `
      <article class="tarjeta-etapa" style="--c:${e.color}" aria-hidden="${i !== 0}">
        <div class="ficha-fondo" aria-hidden="true"><i data-lucide="${e.ic}"></i></div>
        <div class="tarjeta-etapa-cabeza">
          <span class="tarjeta-etapa-icono"><i data-lucide="${e.ic}"></i></span>
          <div><span class="paso">Etapa ${i + 1} de ${ICAP.ETAPAS.length}</span><h3>${e.nombre}</h3></div>
        </div>
        <span class="luz"></span>
        <p>${e.desc}</p>
        <h4>Qué se entrega</h4>
        <ul class="entrega">${e.entrega.map((x) => `<li><i data-lucide="check"></i>${x}</li>`).join('')}</ul>
      </article>`).join('');
    const puntos = ICAP.ETAPAS.map((e, i) => `<button type="button" data-i="${i}" aria-label="${e.nombre}"></button>`).join('');
    ICAP.$('#carruselEtapas').innerHTML = `<div class="pista-etapas">${tarjetas}</div><div class="puntos-etapas">${puntos}</div>`;
    ICAP.$('.puntos-etapas').addEventListener('click', (e) => {
      const punto = e.target.closest('button');
      if (punto) ir(+punto.dataset.i);
    });
  }

  function mostrar(i) {
    actual = i;
    document.querySelectorAll('.bolita').forEach((b, j) => b.classList.toggle('activa', j === i));
    document.querySelectorAll('.puntos-etapas button').forEach((p, j) => p.classList.toggle('activo', j === i));
    document.querySelectorAll('.tarjeta-etapa').forEach((t, j) => t.setAttribute('aria-hidden', j !== i));
    ICAP.$('.pista-etapas').style.transform = `translateX(-${i * 100}%)`;
  }

  // Elegir a mano reinicia la cuenta, para que no cambie apenas se toca.
  function ir(i) {
    mostrar(i);
    programar();
  }

  function programar() {
    clearInterval(reloj);
    if (visible) reloj = setInterval(() => mostrar((actual + 1) % ICAP.ETAPAS.length), INTERVALO);
  }

  function iniciar() {
    pintarRuta();
    pintarCarrusel();
    mostrar(0);
    ICAP.alVerse(ICAP.$('#etapas'), (v) => { visible = v; programar(); }, 0.3);
  }

  return { iniciar };
})();
