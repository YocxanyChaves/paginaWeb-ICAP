/* Organizaciones con las que colabora el ICAP: los logos de la página oficial
   más BCIE, AECID, CEPAL y OEA del brochure. `patron` busca a la organización
   dentro del cliente de cada proyecto; sin patrón no tiene proyectos
   registrados en la clasificación. `web` es el sitio oficial, cuando lo tiene. */
window.ICAP = window.ICAP || {};

ICAP.ALIADOS = [
  { logo: 'sica', sigla: 'SICA', nombre: 'Sistema de la Integración Centroamericana', patron: /SICA/, web: 'https://www.sica.int' },
  { logo: 'bid', sigla: 'BID', nombre: 'Banco Interamericano de Desarrollo', patron: /\(BID\)/, web: 'https://www.iadb.org' },
  { logo: 'bcie', sigla: 'BCIE', nombre: 'Banco Centroamericano de Integración Económica', patron: /BCIE/, web: 'https://www.bcie.org' },
  { logo: 'ops', sigla: 'OPS', nombre: 'Organización Panamericana de la Salud', patron: /\(OPS\)/, web: 'https://www.paho.org' },
  { logo: 'naciones-unidas', sigla: 'ONU', nombre: 'Naciones Unidas', patron: /Naciones Unidas/, web: 'https://www.un.org/es' },
  { logo: 'aecid', sigla: 'AECID', nombre: 'Agencia Española de Cooperación Internacional', patron: /Agencia Española/, web: 'https://www.aecid.es' },
  { logo: 'cepal', sigla: 'CEPAL', nombre: 'Comisión Económica para América Latina y el Caribe', web: 'https://www.cepal.org' },
  { logo: 'oea', sigla: 'OEA', nombre: 'Organización de los Estados Americanos', web: 'https://www.oas.org' },
  { logo: 'flacso', sigla: 'FLACSO', nombre: 'Facultad Latinoamericana de Ciencias Sociales', patron: /FLACSO/, web: 'https://www.flacso.org' },
  { logo: 'csuca', sigla: 'CSUCA', nombre: 'Consejo Superior Universitario Centroamericano', web: 'https://www.csuca.org' },
  { logo: 'mideplan', sigla: 'MIDEPLAN', nombre: 'Ministerio de Planificación Nacional y Política Económica', patron: /MIDEPLAN/, web: 'https://www.mideplan.go.cr' },
  { logo: 'ministerio-de-hacienda', sigla: 'Hacienda', nombre: 'Ministerio de Hacienda de Costa Rica', patron: /Ministerio de Hacienda/, web: 'https://www.hacienda.go.cr' },
  { logo: 'ministerio-de-salud', sigla: 'Salud', nombre: 'Ministerio de Salud de Costa Rica', patron: /Ministerio de Salud/, web: 'https://www.ministeriodesalud.go.cr' },
  { logo: 'ministerio-de-cultura-y-juventud', sigla: 'MCJ', nombre: 'Ministerio de Cultura y Juventud', patron: /Ministerio de Cultura y Juventud/, web: 'https://www.mcj.go.cr' },
  { logo: 'mep', sigla: 'MEP', nombre: 'Ministerio de Educación Pública', patron: /\(MEP\)/, web: 'https://www.mep.go.cr' },
  { logo: 'idp', sigla: 'IDP', nombre: 'Instituto de Desarrollo Profesional Uladislao Gámez Solano', patron: /\(IDP\)/, web: 'https://idp.mep.go.cr' },
  { logo: 'mopt', sigla: 'MOPT', nombre: 'Ministerio de Obras Públicas y Transportes', web: 'https://www.mopt.go.cr' },
  { logo: 'ctp', sigla: 'CTP', nombre: 'Consejo de Transporte Público', patron: /\(CTP\)/, web: 'https://www.ctp.go.cr' },
  { logo: 'cosevi', sigla: 'COSEVI', nombre: 'Consejo de Seguridad Vial', patron: /COSEVI/, web: 'https://www.csv.go.cr' },
  { logo: 'ice', sigla: 'ICE', nombre: 'Instituto Costarricense de Electricidad', patron: /\(ICE\)/, web: 'https://www.grupoice.com' },
  { logo: 'aya', sigla: 'AyA', nombre: 'Instituto Costarricense de Acueductos y Alcantarillados', web: 'https://www.aya.go.cr' },
  { logo: 'cne', sigla: 'CNE', nombre: 'Comisión Nacional de Prevención de Riesgos y Atención de Emergencias', patron: /\(CNE\)/, web: 'https://www.cne.go.cr' },
  { logo: 'ict', sigla: 'ICT', nombre: 'Instituto Costarricense de Turismo', patron: /\(ICT\)/, web: 'https://www.ict.go.cr' },
  { logo: 'ifam', sigla: 'IFAM', nombre: 'Instituto de Fomento y Asesoría Municipal', patron: /IFAM/, web: 'https://www.ifam.go.cr' },
  { logo: 'imas', sigla: 'IMAS', nombre: 'Instituto Mixto de Ayuda Social', patron: /IMAS/, web: 'https://www.imas.go.cr' },
  { logo: 'iafa', sigla: 'IAFA', nombre: 'Instituto sobre Alcoholismo y Farmacodependencia', web: 'https://www.iafa.go.cr' },
  { logo: 'sbd', sigla: 'SBD', nombre: 'Sistema de Banca para el Desarrollo', patron: /\(SBD\)/, web: 'https://www.sbdcr.com' },
  { logo: 'una-costa-rica', sigla: 'UNA', nombre: 'Universidad Nacional de Costa Rica', web: 'https://www.una.ac.cr' },
  { logo: 'escuela-de-gobierno', sigla: 'EdG', nombre: 'Escuela de Gobierno' },
  { logo: 'segeplan', sigla: 'SEGEPLAN', nombre: 'Secretaría de Planificación y Programación de la Presidencia de Guatemala', web: 'https://www.segeplan.gob.gt' },
  { logo: 'unah-honduras', sigla: 'UNAH', nombre: 'Universidad Nacional Autónoma de Honduras', web: 'https://www.unah.edu.hn' },
  { logo: 'poder-judicial-honduras', sigla: 'Poder Judicial', nombre: 'Poder Judicial de Honduras', web: 'https://www.poderjudicial.gob.hn' },
  { logo: 'ufg-el-salvador', sigla: 'UFG', nombre: 'Universidad Francisco Gavidia, El Salvador', web: 'https://www.ufg.edu.sv' },
  { logo: 'map', sigla: 'MAP', nombre: 'Ministerio de Administración Pública, República Dominicana', web: 'https://map.gob.do' },
  { logo: 'mepyd-republica-dominicana', sigla: 'MEPyD', nombre: 'Ministerio de Economía, Planificación y Desarrollo, República Dominicana', web: 'https://mepyd.gob.do' },
  { logo: 'intec', sigla: 'INTEC', nombre: 'Instituto Tecnológico de Santo Domingo', web: 'https://www.intec.edu.do' },
  { logo: 'cosesna', sigla: 'COCESNA', nombre: 'Corporación Centroamericana de Servicios de Navegación Aérea', web: 'https://www.cocesna.org' },
  { logo: 'prevjuve', sigla: 'PREVJUVE', nombre: 'Programa Regional de Prevención de la Violencia Juvenil' }
];

ICAP.proyectosDeAliado = (aliado) =>
  aliado.patron ? ICAP.PROYECTOS.filter((p) => aliado.patron.test(p.cliente)) : [];
