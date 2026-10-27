/* Switch de versión (interactiva / clásica). Las dos páginas tienen las mismas
   secciones con los mismos ids, así que al cambiar se llega a la sección que
   se estaba viendo. */
(() => {
  const switchVersion = document.querySelector('.cambio-version');
  if (!switchVersion) return;

  // La pastilla azul se ajusta al ancho del enlace de la página actual.
  const actual = switchVersion.querySelector('[aria-current="page"]');
  const ubicar = () => {
    switchVersion.style.setProperty('--x', `${actual.offsetLeft}px`);
    switchVersion.style.setProperty('--ancho', `${actual.offsetWidth}px`);
  };
  ubicar();
  document.fonts?.ready.then(ubicar);

  const seccionVisible = () => {
    const centro = innerHeight / 2;
    const seccion = [...document.querySelectorAll('section[id]')]
      .find((s) => { const r = s.getBoundingClientRect(); return r.top <= centro && r.bottom > centro; });
    return seccion && seccion.id !== 'inicio' ? `#${seccion.id}` : '';
  };

  switchVersion.addEventListener('click', (e) => {
    const enlace = e.target.closest('a');
    if (!enlace || enlace === actual) return;
    e.preventDefault();
    location.href = enlace.getAttribute('href') + seccionVisible();
  });
})();
