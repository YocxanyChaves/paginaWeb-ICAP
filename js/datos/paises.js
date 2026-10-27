/* Países del filtro de banderas y qué países cubre cada región de los
   proyectos (igual que REGION_PAISES del brochure). */
window.ICAP = window.ICAP || {};

ICAP.PAISES = {
  CR: 'Costa Rica', GT: 'Guatemala', SV: 'El Salvador', HN: 'Honduras', NI: 'Nicaragua',
  PA: 'Panamá', BZ: 'Belice', DO: 'República Dominicana', CO: 'Colombia', MX: 'México'
};

const CENTROAMERICA = ['GT', 'BZ', 'SV', 'HN', 'NI', 'CR', 'PA'];

ICAP.REGION_PAISES = {
  'Costa Rica': ['CR'],
  Guatemala: ['GT'],
  'Centroamérica': CENTROAMERICA,
  'Centroamérica y Rep. Dominicana': [...CENTROAMERICA, 'DO'],
  'Centroamérica y Caribe': [...CENTROAMERICA, 'DO'],
  'Costa Rica, Colombia y México': ['CR', 'CO', 'MX'],
  'Internacional (Unión Europea)': []
};

ICAP.paisesDe = (proyecto) => ICAP.REGION_PAISES[proyecto.region] || [];
