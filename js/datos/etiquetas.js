/* Las 14 áreas de especialización con que se clasifican los proyectos de
   Asistencia Técnica (mismas del brochure: etiquetas.js). `ic` es el nombre
   del ícono de Lucide y `desc` el texto de la ficha en la esfera de áreas. */
window.ICAP = window.ICAP || {};

ICAP.ETIQUETAS = [
  { id: 'mipymes', nombre: 'MiPYMES', color: '#F59E0B', ic: 'store',
    desc: 'Programas, fondos e instrumentos para que las micro, pequeñas y medianas empresas crezcan y se formalicen.' },
  { id: 'infraestructura', nombre: 'Infraestructura', color: '#EA7A3B', ic: 'building-2',
    desc: 'Estudios y evaluación de obras públicas, puertos y servicios que sostienen el desarrollo de los territorios.' },
  { id: 'economia', nombre: 'Economía y comercio', color: '#0E8C8A', ic: 'trending-up',
    desc: 'Análisis económicos, pronósticos y cadenas de valor para decisiones públicas mejor informadas.' },
  { id: 'politica', nombre: 'Política pública', color: '#2563EB', ic: 'landmark',
    desc: 'Diseño, regulación y evaluación de políticas públicas basadas en evidencia.' },
  { id: 'genero', nombre: 'Equidad de género', color: '#C64FB8', ic: 'scale',
    desc: 'Enfoque de igualdad en las instituciones, las políticas y los programas que llegan a la ciudadanía.' },
  { id: 'energia', nombre: 'Energía', color: '#EAB308', ic: 'zap',
    desc: 'Regulación, planificación y políticas del sector energético para una transición responsable.' },
  { id: 'transformacion', nombre: 'Transformación organizacional', color: '#16337A', ic: 'users',
    desc: 'Planes estratégicos, rediseño de procesos y formación que dejan capacidades instaladas en las instituciones.' },
  { id: 'ambiente', nombre: 'Ambiente y cambio climático', color: '#2FA84F', ic: 'leaf',
    desc: 'Compras públicas sostenibles, gestión del riesgo y acción climática desde lo público.' },
  { id: 'transporte', nombre: 'Transporte y movilidad', color: '#7C3AED', ic: 'bus',
    desc: 'Modelos tarifarios, seguridad vial y planificación de la movilidad.' },
  { id: 'alimentaria', nombre: 'Seguridad alimentaria', color: '#A0612A', ic: 'wheat',
    desc: 'Desarrollo rural, nutrición y encadenamientos productivos para territorios más resilientes.' },
  { id: 'salud', nombre: 'Salud', color: '#0EA5E9', ic: 'stethoscope',
    desc: 'Gestión de servicios de salud, planificación sanitaria y protección social.' },
  { id: 'tecnologia', nombre: 'Tecnología', color: '#0F5D78', ic: 'cpu',
    desc: 'Herramientas digitales y de visualización de datos para gestionar mejor lo público.' },
  { id: 'derechos', nombre: 'Derechos humanos', color: '#E11D48', ic: 'heart-handshake',
    desc: 'Niñez, adolescencia y poblaciones vulnerables en el centro de la acción institucional.' },
  { id: 'cooperacion', nombre: 'Cooperación internacional', color: '#0070C0', ic: 'globe',
    desc: 'Proyectos con organismos internacionales y de integración regional.' }
];

ICAP.etiqueta = (id) => ICAP.ETIQUETAS.find((e) => e.id === id);
