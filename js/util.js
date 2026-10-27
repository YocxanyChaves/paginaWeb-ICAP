/* Utilidades compartidas por todas las secciones. */
window.ICAP = window.ICAP || {};

ICAP.$ = (selector) => document.querySelector(selector);

// Lucide reemplaza cada <i data-lucide="..."> por su SVG.
ICAP.iconos = () => window.lucide && lucide.createIcons();

ICAP.normalizar = (texto) => texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const MESES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
ICAP.fecha = (aaaaMm) => {
  const [anio, mes] = aaaaMm.split('-');
  return mes ? `${MESES[+mes - 1]} ${anio}` : anio;
};

const MES_ACTUAL = new Date().toISOString().slice(0, 7);
ICAP.enCurso = (proyecto) => proyecto.hasta >= MES_ACTUAL;

ICAP.proyectosDeEtiquetas = (ids) => ICAP.PROYECTOS.filter((p) => p.etiquetas.some((e) => ids.includes(e)));

ICAP.sinMovimiento = matchMedia('(prefers-reduced-motion: reduce)').matches;

// Avisa cada vez que el elemento entra o sale de pantalla.
ICAP.alVerse = (elemento, callback, umbral = 0.3) => {
  new IntersectionObserver(([entrada]) => callback(entrada.isIntersecting), { threshold: umbral }).observe(elemento);
};

// Luz que sigue al puntero dentro de las cápsulas (variables --luz-x / --luz-y).
ICAP.luzEnCapsulas = (contenedor) => {
  contenedor.addEventListener('pointermove', (e) => {
    const capsula = e.target.closest('.capsula');
    if (!capsula) return;
    const r = capsula.getBoundingClientRect();
    capsula.style.setProperty('--luz-x', `${e.clientX - r.left}px`);
    capsula.style.setProperty('--luz-y', `${e.clientY - r.top}px`);
  });
};
