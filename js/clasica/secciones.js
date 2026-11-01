/* Versión clásica: pinta áreas y etapas a partir de los mismos datos de la
   versión interactiva (js/datos). Casi sin animaciones: sólo las tarjetas de
   las áreas, que dan vuelta. */
ICAP.clasica = {};

// Áreas en tarjetas que dan vuelta con un clic, como las de "Modelo
// educativo" de icap.ac.cr: al frente, celeste clarito con el ícono del área
// en su color y el nombre; atrás, del color del área, la descripción y la
// cantidad de proyectos.
ICAP.clasica.areas = () => {
  const lista = ICAP.$('#cAreas');
  lista.innerHTML = ICAP.ETIQUETAS.map((a) => {
    const n = ICAP.proyectosDeEtiquetas([a.id]).length;
    return `
      <li class="c-tarjeta" tabindex="0" role="button" aria-pressed="false" style="--c:${a.color}">
        <div class="c-tarjeta-giro">
          <div class="c-tarjeta-frente">
            <span class="c-tarjeta-icono"><i data-lucide="${a.ic}"></i></span>
            <h3>${a.nombre}</h3>
          </div>
          <div class="c-tarjeta-dorso">
            <h4><i data-lucide="${a.ic}"></i>${a.nombre}</h4>
            <p>${a.desc}</p>
            <div class="c-area-cifra"><strong>${n}</strong>${n === 1 ? 'proyecto ejecutado' : 'proyectos ejecutados'}</div>
          </div>
        </div>
      </li>`;
  }).join('');
  // Se dan vuelta sólo con un clic (o Enter/Espacio con el teclado).
  const voltear = (tarjeta) => {
    tarjeta.classList.toggle('volteada');
    tarjeta.setAttribute('aria-pressed', tarjeta.classList.contains('volteada'));
  };
  lista.addEventListener('click', (e) => {
    const tarjeta = e.target.closest('.c-tarjeta');
    if (tarjeta) voltear(tarjeta);
  });
  lista.addEventListener('keydown', (e) => {
    const tarjeta = e.target.closest('.c-tarjeta');
    if (tarjeta && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); voltear(tarjeta); }
  });
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

ICAP.clasica.areas();
ICAP.clasica.etapas();
ICAP.aliados.iniciar();
ICAP.iconos();
