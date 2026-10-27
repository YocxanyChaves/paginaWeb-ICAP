/* Versión clásica: pinta servicios, áreas, etapas y logos a partir de los
   mismos datos de la versión interactiva (js/datos), sin animaciones. */
ICAP.clasica = {};

// Tarjetas que dan vuelta al pasar el mouse, como las de "Modelo educativo"
// en icap.ac.cr. En pantallas táctiles dan vuelta al tocarlas.
ICAP.clasica.servicios = () => {
  const lista = ICAP.$('#cServicios');
  lista.innerHTML = ICAP.SERVICIOS.map((s, i) => `
    <li class="c-tarjeta" tabindex="0">
      <div class="c-tarjeta-giro">
        <div class="c-tarjeta-frente">
          <span class="c-tarjeta-num">${String(i + 1).padStart(2, '0')}</span>
          <i data-lucide="${s.ic}"></i>
          <h3>${s.nombre}</h3>
        </div>
        <div class="c-tarjeta-dorso">
          <p>${s.desc}</p>
          <ul>${s.incluye.map((x) => `<li>${x}</li>`).join('')}</ul>
        </div>
      </div>
    </li>`).join('');
  lista.addEventListener('touchstart', (e) => {
    const tarjeta = e.target.closest('.c-tarjeta');
    if (tarjeta) tarjeta.classList.toggle('volteada');
  }, { passive: true });
};

// Áreas como bloques de texto a todo el ancho, una debajo de la otra.
ICAP.clasica.areas = () => {
  ICAP.$('#cAreas').innerHTML = ICAP.ETIQUETAS.map((a) => {
    const n = ICAP.proyectosDeEtiquetas([a.id]).length;
    return `
      <li style="--c:${a.color}">
        <h3>${a.nombre}</h3>
        <p>${a.desc}</p>
        <div class="c-area-cifra"><strong>${n}</strong>${n === 1 ? 'proyecto ejecutado' : 'proyectos ejecutados'}</div>
      </li>`;
  }).join('');
};

// El diagrama de la página oficial: cuatro círculos con arcos grises en zigzag.
ICAP.clasica.etapas = () => {
  const R = 60;
  const CENTROS = [70, 190, 310, 430];
  const zigzag = `M${CENTROS[0] - R} 100 ` + CENTROS.map((c, i) => `A${R} ${R} 0 0 ${i % 2} ${c + R} 100`).join(' ');
  ICAP.$('#cDiagrama').innerHTML = `
    <svg viewBox="0 0 500 200" aria-hidden="true"><path d="${zigzag}" /></svg>` +
    ICAP.ETAPAS.map((e, i) => `
      <span class="c-bolita" style="--c:${e.color};left:${(CENTROS[i] / 500) * 100}%" aria-hidden="true"><i data-lucide="${e.ic}"></i></span>`).join('');

  ICAP.$('#cEtapas').innerHTML = ICAP.ETAPAS.map((e, i) => `
    <li style="--c:${e.color}">
      <small>Etapa ${i + 1}</small>
      <h3>${e.nombre}</h3>
      <p>${e.desc}</p>
      <ul>${e.entrega.map((x) => `<li>${x}</li>`).join('')}</ul>
    </li>`).join('');
};

// Tira continua de logos a color. Va dos veces seguida para que, al correrse
// la mitad, empalme sin que se note el salto.
ICAP.clasica.logos = () => {
  const logos = ICAP.ALIADOS.map((a) => `
    <li title="${a.nombre}"><img src="assets/logos/${a.logo}.png" alt="${a.sigla} — ${a.nombre}"></li>`).join('');
  ICAP.$('#cLogos').innerHTML = logos + logos.replace(/<li /g, '<li aria-hidden="true" ');
};
