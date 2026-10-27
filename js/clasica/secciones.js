/* Versión clásica: pinta servicios, áreas, etapas y logos a partir de los
   mismos datos de la versión interactiva (js/datos), sin animaciones. */
ICAP.clasica = {};

ICAP.clasica.servicios = () => {
  ICAP.$('#cServicios').innerHTML = ICAP.SERVICIOS.map((s) => `
    <li><h3>${s.nombre}</h3><p>${s.desc}</p></li>`).join('');
};

ICAP.clasica.areas = () => {
  ICAP.$('#cAreas').innerHTML = ICAP.ETIQUETAS.map((a) => {
    const n = ICAP.proyectosDeEtiquetas([a.id]).length;
    return `
      <li style="--c:${a.color}">
        <div class="c-area-cabeza"><i data-lucide="${a.ic}"></i><h3>${a.nombre}</h3></div>
        <p>${a.desc}</p>
        <small>${n} ${n === 1 ? 'proyecto' : 'proyectos'}</small>
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

ICAP.clasica.logos = () => {
  ICAP.$('#cLogos').innerHTML = ICAP.ALIADOS.map((a) => `
    <li title="${a.nombre}"><img src="assets/logos/${a.logo}.png" alt="${a.sigla} — ${a.nombre}" loading="lazy"></li>`).join('');
};
