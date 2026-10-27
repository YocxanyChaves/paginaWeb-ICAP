/* Las diez líneas de trabajo como cápsulas; al elegir una se muestra su ficha
   a la par (en celular, justo debajo de la cápsula, como acordeón). */
ICAP.servicios = (() => {
  let activo = 0;
  const angosto = matchMedia('(max-width: 900px)');

  function pintarLista() {
    const lista = ICAP.$('#listaServicios');
    lista.innerHTML = ICAP.SERVICIOS.map((s, i) => `
      <button type="button" class="capsula" data-i="${i}" aria-expanded="false">
        <span class="num">${String(i + 1).padStart(2, '0')}</span>
        <i data-lucide="${s.ic}"></i>
        <span class="texto">${s.nombre}</span>
      </button>`).join('');
    lista.addEventListener('click', (e) => {
      const capsula = e.target.closest('.capsula');
      if (capsula) elegir(+capsula.dataset.i, true);
    });
    ICAP.luzEnCapsulas(lista);
  }

  function fichaHtml(s, i) {
    const relacionados = ICAP.proyectosDeEtiquetas(s.etiquetas).length;
    return `
      <div class="ficha-fondo" aria-hidden="true"><i data-lucide="${s.ic}"></i></div>
      <div class="ficha-contenido">
        <span class="ficha-numero">Línea ${String(i + 1).padStart(2, '0')} de ${ICAP.SERVICIOS.length}</span>
        <h3>${s.nombre}</h3>
        <span class="luz"></span>
        <p class="desc">${s.desc}</p>
        <h4>Qué incluye</h4>
        <ul class="incluye">${s.incluye.map((x) => `<li><i data-lucide="check-circle-2"></i>${x}</li>`).join('')}</ul>
        <h4>Áreas relacionadas</h4>
        <div class="chips">${s.etiquetas.map((id) => {
          const e = ICAP.etiqueta(id);
          return `<span class="chip" style="--c:${e.color}"><i></i>${e.nombre}</span>`;
        }).join('')}</div>
        <button type="button" class="ver-proyectos"><b>${relacionados}</b> proyectos relacionados <i data-lucide="arrow-right"></i></button>
      </div>`;
  }

  function elegir(i, porUsuario) {
    activo = i;
    const s = ICAP.SERVICIOS[i];
    document.querySelectorAll('#listaServicios .capsula').forEach((c) => {
      const es = +c.dataset.i === i;
      c.classList.toggle('activa', es);
      c.setAttribute('aria-expanded', es);
    });

    const ficha = ICAP.$('#fichaServicio');
    ficha.innerHTML = fichaHtml(s, i);
    const capsula = ICAP.$(`#listaServicios .capsula[data-i="${i}"]`);
    if (angosto.matches) capsula.after(ficha);
    else ICAP.$('.servicios').appendChild(ficha);

    ficha.querySelector('.ver-proyectos').onclick = () => {
      ICAP.proyectos.filtrar({ etiquetas: s.etiquetas });
      ICAP.$('#proyectos').scrollIntoView({ behavior: 'smooth' });
    };
    ICAP.iconos();
    if (porUsuario && angosto.matches) capsula.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function iniciar() {
    pintarLista();
    elegir(0, false);
    angosto.addEventListener('change', () => elegir(activo, false));
  }

  return { iniciar };
})();
