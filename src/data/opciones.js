/* ==========================================================
   VESTIGIO — Listas de opciones de los formularios
   ==========================================================
   Acá viven las listas desplegables que comparten el registro de
   usuarios y el formulario de compra.

   Antes estaban escritas dentro de cada formulario, y eso significaba
   mantener dos copias de las mismas comunas. Al moverlas a un archivo
   propio, agregar una comuna se hace en un solo lugar.

   Cada opción tiene "valor" (lo que se guarda) y "texto" (lo que lee
   el usuario). En varias coinciden, pero se mantiene la forma para que
   todas las listas se usen igual.
   ========================================================== */

/* Comunas de despacho. En un proyecto real vendrían de una API. */
export const comunas = [
  'Puente Alto', 'La Florida', 'Santiago Centro', 'Providencia',
  'Ñuñoa', 'Maipú', 'San Bernardo', 'Las Condes', 'Recoleta', 'La Pintana'
].map((c) => ({ valor: c, texto: c }));

/* Dónde se usarán los equipos. Es propio del rubro: una tienda de
   ropa no preguntaría esto. */
export const tiposInvestigacion = [
  { valor: 'Residencial', texto: 'Residencial (casa o departamento)' },
  { valor: 'Cementerio', texto: 'Cementerio o camposanto' },
  { valor: 'Exterior', texto: 'Exterior (bosque, cerro, ruta)' },
  { valor: 'Abandonado', texto: 'Edificio o recinto abandonado' },
  { valor: 'Patrimonial', texto: 'Inmueble patrimonial o histórico' },
  { valor: 'Otro', texto: 'Otro' }
];

/* Qué tan experimentado es el comprador. Sirve para que la tienda
   sepa si debe acompañar la venta con instrucciones. */
export const nivelesExperiencia = [
  { valor: 'Principiante', texto: 'Principiante — primera investigación' },
  { valor: 'Intermedio', texto: 'Intermedio — algunas salidas de campo' },
  { valor: 'Avanzado', texto: 'Avanzado — investigo con regularidad' }
];

/* En calidad de qué compra. */
export const perfilesInvestigador = [
  { valor: 'Aficionado', texto: 'Aficionado / curioso' },
  { valor: 'Investigador', texto: 'Investigador independiente' },
  { valor: 'Equipo', texto: 'Integrante de un equipo de investigación' },
  { valor: 'Medio', texto: 'Medio de comunicación o documentalista' },
  { valor: 'Academico', texto: 'Investigación académica o universitaria' }
];

/* Qué fenómeno le interesa registrar. Permite a la tienda recomendar
   equipos y es el dato más propio de Vestigio de todo el registro. */
export const fenomenosInteres = [
  { valor: 'Psicofonias', texto: 'Psicofonías y voces electrónicas (EVP)' },
  { valor: 'Apariciones', texto: 'Apariciones y sombras' },
  { valor: 'Poltergeist', texto: 'Actividad poltergeist y objetos en movimiento' },
  { valor: 'Electromagnetico', texto: 'Anomalías electromagnéticas' },
  { valor: 'Termico', texto: 'Variaciones térmicas inexplicables' },
  { valor: 'Lugares', texto: 'Lugares con historial de actividad' }
];

/* Si ya tiene equipamiento. Determina si conviene ofrecerle kits
   completos o accesorios sueltos. */
export const equipamientoPrevio = [
  { valor: 'Ninguno', texto: 'No tengo equipamiento todavía' },
  { valor: 'Basico', texto: 'Tengo lo básico (linterna, grabadora)' },
  { valor: 'Intermedio', texto: 'Tengo varios instrumentos' },
  { valor: 'Completo', texto: 'Tengo un equipo completo, busco repuestos' }
];

/* Horario en que prefiere recibir el despacho. Las investigaciones
   suelen ser nocturnas, así que la tienda ofrece entrega vespertina. */
export const horariosDespacho = [
  { valor: 'Manana', texto: 'Mañana (09:00 a 13:00)' },
  { valor: 'Tarde', texto: 'Tarde (13:00 a 18:00)' },
  { valor: 'Vespertino', texto: 'Vespertino (18:00 a 21:00)' }
];
