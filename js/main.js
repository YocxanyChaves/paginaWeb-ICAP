/* Arranque: cada sección se pinta sola y los bloques .revelar aparecen al
   hacer scroll. */
ICAP.hero.iniciar();
ICAP.servicios.iniciar();
ICAP.etapas.iniciar();
ICAP.proyectos.iniciar();
ICAP.areas.iniciar();
ICAP.aliados.iniciar();
ICAP.iconos();

const revelador = new IntersectionObserver((entradas) => {
  entradas.forEach((entrada) => {
    if (!entrada.isIntersecting) return;
    entrada.target.classList.add('visto');
    revelador.unobserve(entrada.target);
  });
}, { threshold: 0.12 });
document.querySelectorAll('.revelar').forEach((el) => revelador.observe(el));
