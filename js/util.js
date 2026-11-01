/* Utilidades compartidas por todas las secciones. */
window.ICAP = window.ICAP || {};

ICAP.$ = (selector) => document.querySelector(selector);

// Lucide reemplaza cada <i data-lucide="..."> por su SVG.
ICAP.iconos = () => window.lucide && lucide.createIcons();

const MES_ACTUAL = new Date().toISOString().slice(0, 7);
ICAP.enCurso = (proyecto) => proyecto.hasta >= MES_ACTUAL;

ICAP.proyectosDeEtiquetas = (ids) => ICAP.PROYECTOS.filter((p) => p.etiquetas.some((e) => ids.includes(e)));

ICAP.sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Avisa cada vez que el elemento entra o sale de pantalla.
ICAP.alVerse = (elemento, callback, umbral = 0.3) => {
  new IntersectionObserver(([entrada]) => callback(entrada.isIntersecting), { threshold: umbral }).observe(elemento);
};
