/* Arranque de la tercera versión: cada sección se pinta sola y los bloques
   .revelar aparecen al hacer scroll. */
ICAP.portada.iniciar();
ICAP.libros.iniciar();
ICAP.etapas3.iniciar();
ICAP.folleto.iniciar();
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
