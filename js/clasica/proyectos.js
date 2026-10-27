/* Proyectos en la versión clásica: un formulario de filtros (texto, área,
   estado y países) y una lista que muestra 2; "Ver más" despliega todos. Con varios países marcados salen sólo
   los proyectos que los abarcan a todos, igual que en la versión interactiva.
   Desde la nota de una organización llega ya filtrado por ella o por un proyecto. */
ICAP.clasica.proyectos = (() => {
  const PAGINA = 2;
  let limite = PAGINA;
  let especial = null;
  const form = () => ICAP.$('#cFiltros');

  function pintarFiltros() {
    form().area.insertAdjacentHTML('beforeend',
      ICAP.ETIQUETAS.map((e) => `<option value="${e.id}">${e.nombre}</option>`).join(''));
    const conProyectos = Object.keys(ICAP.PAISES).filter((c) => ICAP.PROYECTOS.some((p) => ICAP.paisesDe(p).includes(c)));
    ICAP.$('#cPaises').insertAdjacentHTML('beforeend', conProyectos.map((c) => `
      <label><input type="checkbox" name="pais" value="${c}">${ICAP.PAISES[c]}</label>`).join(''));
  }

  function lista() {
    const f = form();
    const q = ICAP.normalizar(f.texto.value.trim());
    const paises = [...f.querySelectorAll('[name="pais"]:checked')].map((c) => c.value);
    return ICAP.PROYECTOS
      .filter((p) => !especial || (especial.proyecto ? p.id === especial.proyecto.id : especial.aliado.patron?.test(p.cliente)))
      .filter((p) => !f.area.value || p.etiquetas.includes(f.area.value))
      .filter((p) => f.estado.value === 'todos' || (f.estado.value === 'curso') === ICAP.enCurso(p))
      .filter((p) => paises.every((c) => ICAP.paisesDe(p).includes(c)))
      .filter((p) => !q || ICAP.normalizar(`${p.titulo} ${p.cliente}`).includes(q))
      .sort((a, b) => b.desde.localeCompare(a.desde));
  }

  function fila(p) {
    const curso = ICAP.enCurso(p);
    const etiquetas = p.etiquetas.map(ICAP.etiqueta)
      .map((e) => `<span><i style="--c:${e.color}"></i>${e.nombre}</span>`).join('');
    return `
      <li>
        <h3>${p.titulo}</h3>
        <span class="c-periodo">${ICAP.fecha(p.desde)} – ${ICAP.fecha(p.hasta)}<b class="${curso ? 'en-curso' : ''}">${curso ? 'En curso' : 'Finalizado'}</b></span>
        <p>${p.cliente} · ${p.region}</p>
        <div class="c-etiquetas">${etiquetas}</div>
      </li>`;
  }

  function pintar() {
    const resultado = lista();
    const de = especial && (especial.proyecto ? 'proyecto elegido' : especial.aliado.sigla);
    ICAP.$('#cConteo').innerHTML = `<strong>${resultado.length}</strong> de ${ICAP.PROYECTOS.length} proyectos` +
      (de ? ` · ${de} <button type="button" class="c-quitar">Quitar filtro</button>` : '');
    ICAP.$('#cProyectos').innerHTML = resultado.length
      ? resultado.slice(0, limite).map(fila).join('')
      : '<li class="c-vacio">No hay proyectos con esa combinación de filtros.</li>';
    ICAP.$('#cVerMas').hidden = resultado.length <= limite;
    ICAP.$('#cVerMas').textContent = `Ver los ${resultado.length} proyectos`;
    ICAP.$('#cVerMenos').hidden = limite <= PAGINA || resultado.length <= PAGINA;
  }

  // Lo usa la tira de organizaciones: { aliado } o { proyecto }.
  function filtrar(filtro) {
    form().reset();
    especial = filtro.aliado || filtro.proyecto ? filtro : null;
    limite = PAGINA;
    pintar();
  }

  function iniciar() {
    pintarFiltros();
    ICAP.$('#cConteo').addEventListener('click', (e) => {
      if (e.target.closest('.c-quitar')) { especial = null; pintar(); }
    });
    form().addEventListener('input', () => { limite = PAGINA; pintar(); });
    ICAP.$('#cVerMas').addEventListener('click', () => { limite = Infinity; pintar(); });
    ICAP.$('#cVerMenos').addEventListener('click', () => {
      limite = PAGINA;
      pintar();
      ICAP.$('#proyectos').scrollIntoView();
    });
    pintar();
  }

  return { iniciar, filtrar };
})();

ICAP.clasica.servicios();
ICAP.clasica.areas();
ICAP.clasica.etapas();
ICAP.clasica.proyectos.iniciar();
ICAP.aliados.iniciar({ filtrar: ICAP.clasica.proyectos.filtrar });
ICAP.iconos();
