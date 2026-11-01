/* Las cuatro etapas de "Generación de capacidades" de
   icap.ac.cr/asistencia-tecnica. Las descripciones son texto propuesto para
   que la Unidad de Asistencia Técnica lo revise. */
window.ICAP = window.ICAP || {};

// Colores e íconos como en el diagrama de la página oficial.
ICAP.ETAPAS = [
  { nombre: 'Diagnósticos y análisis de datos', ic: 'chart-column', color: '#6DB33F',
    desc: 'Partimos de entender a fondo la institución y su contexto: levantamos información, analizamos datos y escuchamos a los actores clave.',
    entrega: ['Levantamiento y análisis de información', 'Consultas a actores clave', 'Informe de diagnóstico'] },
  { nombre: 'Construcción de modelos', ic: 'grip', color: '#0080C6',
    desc: 'Con la evidencia en mano diseñamos el modelo de solución: estructuras, procesos, instrumentos o políticas a la medida de cada país.',
    entrega: ['Modelos conceptuales y de gestión', 'Propuestas de política o instrumento', 'Validación con la contraparte'] },
  { nombre: 'Planes de acción', ic: 'copy', color: '#F47B20',
    desc: 'Traducimos el modelo en una hoja de ruta concreta, con responsables, plazos, recursos e indicadores.',
    entrega: ['Hoja de ruta y cronograma', 'Matriz de indicadores', 'Estimación de recursos'] },
  { nombre: 'Adopción e implementación', ic: 'check', color: '#002B5C',
    desc: 'Acompañamos la puesta en marcha y formamos a los equipos para que el cambio se sostenga después de la asistencia.',
    entrega: ['Acompañamiento en la implementación', 'Formación de equipos', 'Seguimiento y ajuste'] }
];
