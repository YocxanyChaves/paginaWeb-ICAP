/* Las diez líneas de trabajo y las cuatro etapas de "Generación de capacidades"
   de icap.ac.cr/asistencia-tecnica. Las descripciones son texto propuesto para
   que la Unidad de Asistencia Técnica lo revise. `etiquetas` conecta cada línea
   con las áreas de los proyectos. */
window.ICAP = window.ICAP || {};

ICAP.SERVICIOS = [
  { nombre: 'Emprendimiento', ic: 'rocket', etiquetas: ['mipymes'],
    desc: 'Diseño y fortalecimiento de programas públicos de apoyo al emprendimiento, desde el diagnóstico del ecosistema hasta la medición de su impacto.',
    incluye: ['Mapeo de ecosistemas emprendedores', 'Programas de incubación y aceleración', 'Indicadores de impacto'] },
  { nombre: 'Evaluación de programas y políticas', ic: 'clipboard-check', etiquetas: ['politica'],
    desc: 'Evaluaciones de diseño, proceso, resultados e impacto para rendir cuentas y decidir con evidencia.',
    incluye: ['Evaluaciones de diseño y resultados', 'Teorías de cambio y marcos lógicos', 'Sistemas de seguimiento'] },
  { nombre: 'Financiamiento y acceso a crédito', ic: 'piggy-bank', etiquetas: ['economia', 'mipymes'],
    desc: 'Análisis y diseño de instrumentos financieros para que más personas y empresas accedan a crédito en buenas condiciones.',
    incluye: ['Estudios de oferta y demanda de crédito', 'Diseño de fondos y garantías', 'Evaluación de banca para el desarrollo'] },
  { nombre: 'Cadenas productivas y valor agregado', ic: 'link', etiquetas: ['economia', 'alimentaria'],
    desc: 'Identificamos cuellos de botella y oportunidades para agregar valor y encadenar a productores locales.',
    incluye: ['Diagnósticos de cadenas de valor', 'Estrategias de encadenamiento', 'Estudios socioeconómicos territoriales'] },
  { nombre: 'Política pública y segmentación empresarial', ic: 'layers', etiquetas: ['politica', 'mipymes'],
    desc: 'Segmentamos el tejido empresarial para que cada instrumento público llegue a quien lo necesita.',
    incluye: ['Tipologías empresariales', 'Políticas sectoriales', 'Focalización de instrumentos'] },
  { nombre: 'Capacitación y fortalecimiento institucional', ic: 'graduation-cap', etiquetas: ['transformacion'],
    desc: 'Formación a la medida y procesos de mejora organizacional que dejan capacidades instaladas en los equipos.',
    incluye: ['Cursos y programas a la medida', 'Diagnósticos organizacionales', 'Rediseño de procesos'] },
  { nombre: 'Planificación económica y estratégica', ic: 'target', etiquetas: ['transformacion', 'economia'],
    desc: 'Acompañamos la construcción de planes estratégicos e institucionales alineados con resultados medibles.',
    incluye: ['Planes estratégicos institucionales', 'Pronósticos y modelos económicos', 'Gestión para resultados'] },
  { nombre: 'Desarrollo rural e inclusión productiva', ic: 'sprout', etiquetas: ['alimentaria', 'genero'],
    desc: 'Estrategias para territorios rurales que integran a mujeres, juventudes y pequeños productores a la economía.',
    incluye: ['Desarrollo territorial', 'Seguridad alimentaria y nutricional', 'Inclusión con enfoque de género'] },
  { nombre: 'Salud y seguridad social', ic: 'heart-pulse', etiquetas: ['salud'],
    desc: 'Apoyo técnico a sistemas de salud y protección social para mejorar su gestión, cobertura y sostenibilidad.',
    incluye: ['Gestión de servicios de salud', 'Sistemas de protección social', 'Planificación sanitaria'] },
  { nombre: 'Ambiente y energía', ic: 'leaf', etiquetas: ['ambiente', 'energia'],
    desc: 'Regulación, compras públicas sostenibles y políticas de energía y cambio climático.',
    incluye: ['Regulación energética', 'Compras públicas sostenibles', 'Evaluación de proyectos ambientales'] }
];

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
