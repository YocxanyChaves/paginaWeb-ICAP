/* Organizaciones con las que colabora el ICAP: los logos de la página oficial
   más BCIE, AECID, CEPAL y OEA del brochure. `patron` busca a la organización
   dentro del cliente de cada proyecto; sin patrón no tiene proyectos
   registrados en la clasificación. */
window.ICAP = window.ICAP || {};

ICAP.ALIADOS = [
  { logo: 'sica', sigla: 'SICA', nombre: 'Sistema de la Integración Centroamericana', patron: /SICA/ },
  { logo: 'bid', sigla: 'BID', nombre: 'Banco Interamericano de Desarrollo', patron: /\(BID\)/ },
  { logo: 'bcie', sigla: 'BCIE', nombre: 'Banco Centroamericano de Integración Económica', patron: /BCIE/ },
  { logo: 'ops', sigla: 'OPS', nombre: 'Organización Panamericana de la Salud', patron: /\(OPS\)/ },
  { logo: 'naciones-unidas', sigla: 'ONU', nombre: 'Naciones Unidas', patron: /Naciones Unidas/ },
  { logo: 'aecid', sigla: 'AECID', nombre: 'Agencia Española de Cooperación Internacional', patron: /Agencia Española/ },
  { logo: 'cepal', sigla: 'CEPAL', nombre: 'Comisión Económica para América Latina y el Caribe' },
  { logo: 'oea', sigla: 'OEA', nombre: 'Organización de los Estados Americanos' },
  { logo: 'flacso', sigla: 'FLACSO', nombre: 'Facultad Latinoamericana de Ciencias Sociales', patron: /FLACSO/ },
  { logo: 'csuca', sigla: 'CSUCA', nombre: 'Consejo Superior Universitario Centroamericano' },
  { logo: 'mideplan', sigla: 'MIDEPLAN', nombre: 'Ministerio de Planificación Nacional y Política Económica', patron: /MIDEPLAN/ },
  { logo: 'ministerio-de-hacienda', sigla: 'Hacienda', nombre: 'Ministerio de Hacienda de Costa Rica', patron: /Ministerio de Hacienda/ },
  { logo: 'ministerio-de-salud', sigla: 'Salud', nombre: 'Ministerio de Salud de Costa Rica', patron: /Ministerio de Salud/ },
  { logo: 'ministerio-de-cultura-y-juventud', sigla: 'MCJ', nombre: 'Ministerio de Cultura y Juventud', patron: /Ministerio de Cultura y Juventud/ },
  { logo: 'mep', sigla: 'MEP', nombre: 'Ministerio de Educación Pública', patron: /\(MEP\)/ },
  { logo: 'idp', sigla: 'IDP', nombre: 'Instituto de Desarrollo Profesional Uladislao Gámez Solano', patron: /\(IDP\)/ },
  { logo: 'mopt', sigla: 'MOPT', nombre: 'Ministerio de Obras Públicas y Transportes' },
  { logo: 'ctp', sigla: 'CTP', nombre: 'Consejo de Transporte Público', patron: /\(CTP\)/ },
  { logo: 'cosevi', sigla: 'COSEVI', nombre: 'Consejo de Seguridad Vial', patron: /COSEVI/ },
  { logo: 'ice', sigla: 'ICE', nombre: 'Instituto Costarricense de Electricidad', patron: /\(ICE\)/ },
  { logo: 'aya', sigla: 'AyA', nombre: 'Instituto Costarricense de Acueductos y Alcantarillados' },
  { logo: 'cne', sigla: 'CNE', nombre: 'Comisión Nacional de Prevención de Riesgos y Atención de Emergencias', patron: /\(CNE\)/ },
  { logo: 'ict', sigla: 'ICT', nombre: 'Instituto Costarricense de Turismo', patron: /\(ICT\)/ },
  { logo: 'ifam', sigla: 'IFAM', nombre: 'Instituto de Fomento y Asesoría Municipal', patron: /IFAM/ },
  { logo: 'imas', sigla: 'IMAS', nombre: 'Instituto Mixto de Ayuda Social', patron: /IMAS/ },
  { logo: 'iafa', sigla: 'IAFA', nombre: 'Instituto sobre Alcoholismo y Farmacodependencia' },
  { logo: 'sbd', sigla: 'SBD', nombre: 'Sistema de Banca para el Desarrollo', patron: /\(SBD\)/ },
  { logo: 'una-costa-rica', sigla: 'UNA', nombre: 'Universidad Nacional de Costa Rica' },
  { logo: 'escuela-de-gobierno', sigla: 'EdG', nombre: 'Escuela de Gobierno' },
  { logo: 'segeplan', sigla: 'SEGEPLAN', nombre: 'Secretaría de Planificación y Programación de la Presidencia de Guatemala' },
  { logo: 'unah-honduras', sigla: 'UNAH', nombre: 'Universidad Nacional Autónoma de Honduras' },
  { logo: 'poder-judicial-honduras', sigla: 'Poder Judicial', nombre: 'Poder Judicial de Honduras' },
  { logo: 'ufg-el-salvador', sigla: 'UFG', nombre: 'Universidad Francisco Gavidia, El Salvador' },
  { logo: 'map', sigla: 'MAP', nombre: 'Ministerio de Administración Pública, República Dominicana' },
  { logo: 'mepyd-republica-dominicana', sigla: 'MEPyD', nombre: 'Ministerio de Economía, Planificación y Desarrollo, República Dominicana' },
  { logo: 'intec', sigla: 'INTEC', nombre: 'Instituto Tecnológico de Santo Domingo' },
  { logo: 'cosesna', sigla: 'COSESNA', nombre: 'Corporación Centroamericana de Servicios de Navegación Aérea' },
  { logo: 'prevjuve', sigla: 'PREVJUVE', nombre: 'Programa Regional de Prevención de la Violencia Juvenil' }
];

ICAP.proyectosDeAliado = (aliado) =>
  aliado.patron ? ICAP.PROYECTOS.filter((p) => aliado.patron.test(p.cliente)) : [];
