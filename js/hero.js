/* Cifras del hero: una lista de tres filas, cada una con su número grande y
   una línea fina que se llena mientras el número cuenta de 0 al total. La
   cuenta se hace una sola vez, al verse por primera vez. */
ICAP.hero = (() => {
  const CIFRAS = [
    { valor: 124, nombre: 'Proyectos ejecutados' },
    { valor: 47, nombre: 'Clientes institucionales' },
    { valor: 18, nombre: 'Países atendidos' }
  ];
  const DURACION = 2200;
  const DESFASE = 220; // cada fila arranca un poco después de la anterior

  function pintar() {
    ICAP.$('#cifras').innerHTML = CIFRAS.map((c) => `
      <div class="cifra">
        <strong class="cifra-numero">0</strong>
        <span class="cifra-nombre">${c.nombre}</span>
        <span class="cifra-linea" aria-hidden="true"></span>
      </div>`).join('') +
      '<span class="cifras-nota">Cifras oficiales · Resumen Estratégico ICAP</span>';
  }

  function contar() {
    const filas = document.querySelectorAll('.cifra');
    const inicio = performance.now();
    const paso = (ahora) => {
      let falta = false;
      filas.forEach((f, i) => {
        const p = Math.min(Math.max((ahora - inicio - i * DESFASE) / DURACION, 0), 1);
        const suave = 1 - Math.pow(1 - p, 3);
        f.querySelector('.cifra-numero').textContent = Math.round(CIFRAS[i].valor * suave);
        f.querySelector('.cifra-linea').style.transform = `scaleX(${suave})`;
        if (p < 1) falta = true;
      });
      if (falta) requestAnimationFrame(paso);
    };
    requestAnimationFrame(paso);
  }

  function iniciar() {
    pintar();
    let yaConto = false;
    ICAP.alVerse(ICAP.$('#cifras'), (visible) => {
      if (!visible || yaConto) return;
      yaConto = true;
      setTimeout(contar, 300);
    }, 0.35);
  }

  return { iniciar };
})();
