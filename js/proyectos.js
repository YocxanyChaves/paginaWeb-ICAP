/* Explorador de proyectos: buscador, estado, cápsulas de áreas y banderas.
   Muestra de a 3 tarjetas con "Ver más" / "Ver menos". Otras secciones lo
   abren ya filtrado con ICAP.proyectos.filtrar(). */
ICAP.proyectos = (() => {
  const PAGINA = 3;
  const filtros = { texto: '', estado: 'todos', etiquetas: new Set(), paises: new Set(), especial: null, limite: PAGINA };

  function pintarFiltros() {
    ICAP.$('#filtroAreas').innerHTML = ICAP.ETIQUETAS.map((e) => `
      <button type="button" class="capsula" data-id="${e.id}" title="${e.nombre}">
        <i data-lucide="${e.ic}"></i><span class="texto">${e.nombre}</span>
      </button>`).join('');
    ICAP.luzEnCapsulas(ICAP.$('#filtroAreas'));

    const conProyectos = Object.keys(ICAP.PAISES).filter((c) => ICAP.PROYECTOS.some((p) => ICAP.paisesDe(p).includes(c)));
    ICAP.$('#filtroPaises').innerHTML = `
      <button type="button" class="bandera todos" data-pais="" title="Todos los países" aria-label="Todos los países">
        <span class="bandera-anillo"></span><span class="bandera-circulo"><i data-lucide="globe-2"></i></span>
      </button>` + conProyectos.map((c) => `
      <button type="button" class="bandera" data-pais="${c}" title="${ICAP.PAISES[c]}" aria-label="${ICAP.PAISES[c]}">
        <span class="bandera-anillo"></span>
        <span class="bandera-circulo"><img src="assets/banderas/${c.toLowerCase()}.svg" alt="" draggable="false"></span>
      </button>`).join('');
  }

  function escuchar() {
    ICAP.$('#filtroAreas').addEventListener('click', (e) => {
      const c = e.target.closest('.capsula');
      if (!c) return;
      filtros.etiquetas.has(c.dataset.id) ? filtros.etiquetas.delete(c.dataset.id) : filtros.etiquetas.add(c.dataset.id);
      actualizar();
    });
    ICAP.$('#filtroPaises').addEventListener('click', (e) => {
      const b = e.target.closest('.bandera');
      if (!b) return;
      // Se pueden elegir varios países; el globo los quita todos.
      const c = b.dataset.pais;
      if (!c) filtros.paises.clear();
      else filtros.paises.has(c) ? filtros.paises.delete(c) : filtros.paises.add(c);
      actualizar();
    });
    ICAP.$('#estado').addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (b) { filtros.estado = b.dataset.v; actualizar(); }
    });
    ICAP.$('#buscar').addEventListener('input', (e) => { filtros.texto = e.target.value; actualizar(); });
    ICAP.$('#verMas').addEventListener('click', () => { filtros.limite += PAGINA; pintar(); });
    ICAP.$('#verMenos').addEventListener('click', () => {
      filtros.limite = PAGINA;
      pintar();
      ICAP.$('#proyectos').scrollIntoView({ behavior: 'smooth' });
    });
    ICAP.$('#limpiar').addEventListener('click', () => filtrar({}));
    ICAP.$('#filtroEspecial').addEventListener('click', (e) => {
      if (e.target.closest('.filtro-especial')) { filtros.especial = null; actualizar(); }
    });
  }

  function lista() {
    const q = ICAP.normalizar(filtros.texto.trim());
    const esp = filtros.especial;
    return ICAP.PROYECTOS
      .filter((p) => !esp || (esp.tipo === 'proyecto' ? p.id === esp.id : esp.aliado.patron?.test(p.cliente)))
      .filter((p) => !filtros.etiquetas.size || p.etiquetas.some((e) => filtros.etiquetas.has(e)))
      // Con varios países, sólo los proyectos que los abarcan a todos.
      .filter((p) => [...filtros.paises].every((c) => ICAP.paisesDe(p).includes(c)))
      .filter((p) => filtros.estado === 'todos' || (filtros.estado === 'curso') === ICAP.enCurso(p))
      .filter((p) => !q || ICAP.normalizar(`${p.titulo} ${p.cliente}`).includes(q))
      .sort((a, b) => b.desde.localeCompare(a.desde));
  }

  function tarjeta(p, i) {
    const etqs = p.etiquetas.map(ICAP.etiqueta);
    const curso = ICAP.enCurso(p);
    const resaltado = filtros.especial?.tipo === 'proyecto' ? ' resaltado' : '';
    return `
      <article class="proyecto${resaltado}" style="animation-delay:${(i % PAGINA) * 70}ms">
        <div class="barra">${etqs.map((e) => `<i style="--c:${e.color}"></i>`).join('')}</div>
        <div class="meta">
          <span class="estado${curso ? ' en-curso' : ''}">${curso ? '● En curso' : 'Finalizado'}</span>
          <span class="fechas">${ICAP.fecha(p.desde)} – ${ICAP.fecha(p.hasta)}</span>
        </div>
        <h3>${p.titulo}</h3>
        <div class="dato"><i data-lucide="building"></i>${p.cliente}</div>
        <div class="dato"><i data-lucide="map-pin"></i>${p.region}</div>
        <div class="pie">${etqs.map((e) => `<span style="--c:${e.color}">${e.nombre}</span>`).join('')}</div>
      </article>`;
  }

  function pintar() {
    const resultado = lista();
    document.querySelectorAll('#filtroAreas .capsula').forEach((c) => c.classList.toggle('activa', filtros.etiquetas.has(c.dataset.id)));
    document.querySelectorAll('#filtroPaises .bandera').forEach((b) => b.classList.toggle('activa', b.dataset.pais ? filtros.paises.has(b.dataset.pais) : !filtros.paises.size));
    ICAP.$('#filtroPaises').classList.toggle('filtrando', filtros.paises.size > 0);
    document.querySelectorAll('#estado button').forEach((b) => b.setAttribute('aria-pressed', b.dataset.v === filtros.estado));

    const esp = filtros.especial;
    ICAP.$('#filtroEspecial').innerHTML = esp
      ? `<button type="button" class="filtro-especial" title="Quitar">${esp.nombre}<i data-lucide="x"></i></button>` : '';
    ICAP.$('#limpiar').hidden = !(filtros.texto || filtros.estado !== 'todos' || filtros.etiquetas.size || filtros.paises.size || esp);
    ICAP.$('#conteo').innerHTML = `<strong>${resultado.length}</strong> de ${ICAP.PROYECTOS.length} proyectos`;

    const visibles = resultado.slice(0, filtros.limite);
    ICAP.$('#grilla').innerHTML = visibles.length
      ? visibles.map(tarjeta).join('')
      : '<p class="vacio">No hay proyectos con esa combinación de filtros. Pruebe quitando alguno.</p>';
    ICAP.$('#verMas').hidden = resultado.length <= filtros.limite;
    ICAP.$('#verMenos').hidden = filtros.limite <= PAGINA;
    ICAP.iconos();
  }

  function actualizar() {
    filtros.limite = PAGINA;
    pintar();
  }

  // Reinicia los filtros y aplica los que se pidan: { etiquetas, aliado, proyecto }.
  function filtrar({ etiquetas = [], aliado = null, proyecto = null }) {
    Object.assign(filtros, { texto: '', estado: 'todos', etiquetas: new Set(etiquetas), paises: new Set(), especial: null });
    if (aliado) filtros.especial = { tipo: 'aliado', aliado, nombre: aliado.sigla };
    if (proyecto) filtros.especial = { tipo: 'proyecto', id: proyecto.id, nombre: 'Proyecto seleccionado' };
    ICAP.$('#buscar').value = '';
    actualizar();
  }

  function iniciar() {
    pintarFiltros();
    escuchar();
    pintar();
  }

  return { iniciar, filtrar };
})();
