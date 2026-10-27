/* Proyectos en la versión clásica: un formulario de filtros (texto, área,
   estado y países) y una lista de a 4. Con varios países marcados salen sólo
   los proyectos que los abarcan a todos, igual que en la versión interactiva. */
ICAP.clasica.proyectos = (() => {
  const PAGINA = 4;
  let limite = PAGINA;
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
    ICAP.$('#cConteo').innerHTML = `<strong>${resultado.length}</strong> de ${ICAP.PROYECTOS.length} proyectos`;
    ICAP.$('#cProyectos').innerHTML = resultado.length
      ? resultado.slice(0, limite).map(fila).join('')
      : '<li class="c-vacio">No hay proyectos con esa combinación de filtros.</li>';
    ICAP.$('#cVerMas').hidden = resultado.length <= limite;
    ICAP.$('#cVerMenos').hidden = limite <= PAGINA;
  }

  function iniciar() {
    pintarFiltros();
    form().addEventListener('input', () => { limite = PAGINA; pintar(); });
    ICAP.$('#cVerMas').addEventListener('click', () => { limite += PAGINA; pintar(); });
    ICAP.$('#cVerMenos').addEventListener('click', () => {
      limite = PAGINA;
      pintar();
      ICAP.$('#proyectos').scrollIntoView();
    });
    pintar();
  }

  return { iniciar };
})();

ICAP.clasica.servicios();
ICAP.clasica.areas();
ICAP.clasica.etapas();
ICAP.clasica.logos();
ICAP.clasica.proyectos.iniciar();
ICAP.iconos();
