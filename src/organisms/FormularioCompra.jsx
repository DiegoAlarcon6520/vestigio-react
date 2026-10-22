/* ==========================================================
   VESTIGIO — Formulario de pedido con validación
   ==========================================================
   Port del archivo js/validarformulario.js del sitio original.
   Se mantienen los mismos requisitos pedidos en clase:
     - Validar formato de RUT
     - Correos de dominios permitidos (gmail, outlook, duocuc, etc.)
     - Teléfono con prefijo +56
     - Mayor de 18 años
     - Debe ofrecer productos del propio e-commerce

   Y se agregan los campos propios de la temática de la tienda:
     - Dirección y comuna de despacho
     - Tipo de investigación en que se usarán los equipos
     - Nivel de experiencia del comprador
     - Aceptación de las condiciones de uso

   Los controles son de React Bootstrap. El resto del sitio conserva su
   CSS original: Bootstrap se usa solo acá, que es la parte compleja.
   ========================================================== */

import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import CampoFormulario from '../molecules/CampoFormulario';
import { productos } from '../data/productos';
import { formatearPrecio } from '../utils/formato';


/* ===== EXPRESIONES REGULARES ===== */
/* Se definen fuera del componente para que no se vuelvan a crear en
   cada render. Son exactamente las del proyecto original. */

/* Solo letras (con tildes y ñ) y espacios. El + significa "uno o más". */
const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;

/* 7 u 8 dígitos, un guion, y un dígito verificador que puede ser número
   o K. {7,8} = entre 7 y 8 repeticiones. */
const regexRut = /^[0-9]{7,8}-[0-9kK]{1}$/;

/* Cualquier usuario válido, seguido de @ y uno de los dominios
   permitidos. El | dentro del paréntesis funciona como "o". El \.
   escapa el punto, porque un punto suelto en regex significa
   "cualquier carácter". */
const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|duocuc\.cl|duoc\.cl|profesor\.duoc\.cl)$/;

/* Prefijo +56 obligatorio seguido de exactamente 9 dígitos.
   El \+ escapa el signo +, que en regex significa "uno o más". */
const regexFono = /^\+56[0-9]{9}$/;


/* ===== LISTAS DE OPCIONES ===== */
/* Las comunas de despacho. En un proyecto real vendrían de una API;
   acá alcanza con una lista fija. */
const comunas = [
  'Puente Alto', 'La Florida', 'Santiago Centro', 'Providencia',
  'Ñuñoa', 'Maipú', 'San Bernardo', 'Las Condes', 'Recoleta', 'La Pintana'
].map((c) => ({ valor: c, texto: c }));

/* Campo de contexto propio de la tienda: dónde se usarán los equipos. */
const tiposInvestigacion = [
  { valor: 'Residencial', texto: 'Residencial (casa o departamento)' },
  { valor: 'Cementerio', texto: 'Cementerio o camposanto' },
  { valor: 'Exterior', texto: 'Exterior (bosque, cerro, ruta)' },
  { valor: 'Abandonado', texto: 'Edificio o recinto abandonado' },
  { valor: 'Patrimonial', texto: 'Inmueble patrimonial o histórico' },
  { valor: 'Otro', texto: 'Otro' }
];

/* El catálogo alimenta el select de productos, así que los precios del
   formulario nunca se desincronizan de los del catálogo. */
const opcionesProducto = productos.map((p) => ({
  valor: p.nombre,
  texto: p.nombre + ' — ' + p.precio
}));


/* ===== FUNCIÓN AUXILIAR: CALCULAR EDAD ===== */
/* La edad no se puede validar con una expresión regular porque depende
   de la fecha de hoy, así que se calcula aparte.

   El input type="date" entrega el valor como "AAAA-MM-DD". Se separa
   con split("-") en lugar de usar new Date(), porque new Date()
   interpreta ese texto como hora UTC y en Chile puede restar un día.

   Se exporta para poder probarla sola con Vitest en la Fase 4. */
export function calcularEdad(fechaTexto) {

  let partes = fechaTexto.split('-');   // ["2005", "03", "14"]
  let anioNac = parseInt(partes[0]);
  let mesNac = parseInt(partes[1]);
  let diaNac = parseInt(partes[2]);

  let hoy = new Date();
  let anioHoy = hoy.getFullYear();
  let mesHoy = hoy.getMonth() + 1;      // getMonth() devuelve 0 a 11
  let diaHoy = hoy.getDate();

  let edad = anioHoy - anioNac;

  /* Si todavía no llega su cumpleaños este año, se le resta 1 */
  if (mesHoy < mesNac || (mesHoy === mesNac && diaHoy < diaNac)) {
    edad = edad - 1;
  }

  return edad;
}


/* ===== ESTADO INICIAL ===== */
/* Un solo objeto con todos los campos, en vez de un useState por campo.
   Cada clave coincide con el id del control correspondiente. */
const datosVacios = {
  nombre: '',
  rut: '',
  email: '',
  fono: '',
  fenac: '',
  producto: '',
  cantidad: '1',
  fdpago: '',
  direccion: '',
  comuna: '',
  investigacion: '',
  experiencia: '',
  condiciones: false
};


function FormularioCompra({ tema, resumenCarrito, alConfirmar }) {

  const [datos, setDatos] = useState(datosVacios);

  /* Un solo manejador para todos los campos de texto y select: usa el
     id del control como nombre de la propiedad que hay que actualizar.
     Los tres puntos copian el objeto anterior y la clave entre
     corchetes reemplaza solo la que cambió. */
  const manejarCambio = (evento) => {
    const { id, value } = evento.target;
    setDatos({ ...datos, [id]: value });
  };

  /* Los radio comparten el atributo name, así que se guardan por su
     value y no por su id. */
  const manejarPago = (evento) => {
    setDatos({ ...datos, fdpago: evento.target.value });
  };

  const manejarExperiencia = (evento) => {
    setDatos({ ...datos, experiencia: evento.target.value });
  };

  /* En un checkbox el dato útil es checked, no value. */
  const manejarCondiciones = (evento) => {
    setDatos({ ...datos, condiciones: evento.target.checked });
  };

  const limpiar = () => setDatos(datosVacios);


  /* ===== VALIDACIÓN AL ENVIAR ===== */
  /* preventDefault() evita que la página se recargue, así alcanzamos a
     revisar los datos antes de que el navegador haga lo suyo. */
  const manejarEnvio = (evento) => {

    evento.preventDefault();

    /* elements permite hacer foco en el campo que falló, igual que el
       nombre.focus() del archivo original. */
    const campos = evento.target.elements;


    /* ----- VALIDACIONES DE LA PRIMERA ENTREGA ----- */

    /* --- NOMBRE --- */
    if (!regexNombre.test(datos.nombre)) {
      alert('El nombre solo debe contener letras y espacios.');
      campos.nombre.focus();
      return;
    }

    /* --- RUT --- */
    if (!regexRut.test(datos.rut)) {
      alert('El RUT debe tener el formato 12345678-9 (sin puntos).');
      campos.rut.focus();
      return;
    }

    /* --- CORREO --- */
    if (!regexEmail.test(datos.email)) {
      alert('El correo debe pertenecer a un dominio permitido: gmail.com, outlook.com, hotmail.com, duocuc.cl o duoc.cl');
      campos.email.focus();
      return;
    }

    /* --- TELÉFONO --- */
    if (!regexFono.test(datos.fono)) {
      alert('El teléfono debe empezar con +56 y tener 9 dígitos después. Ejemplo: +56912345678');
      campos.fono.focus();
      return;
    }

    /* --- FECHA DE NACIMIENTO / MAYOR DE 18 --- */
    if (datos.fenac === '') {
      alert('Debes ingresar tu fecha de nacimiento.');
      campos.fenac.focus();
      return;
    }

    let edad = calcularEdad(datos.fenac);

    if (edad < 18) {
      alert('Debes ser mayor de 18 años para comprar en Vestigio. Edad registrada: ' + edad + ' años.');
      campos.fenac.focus();
      return;
    }

    /* --- PRODUCTO --- */
    if (datos.producto === '') {
      alert('Debes seleccionar un producto del catálogo.');
      campos.producto.focus();
      return;
    }

    /* --- CANTIDAD --- */
    /* parseInt convierte el texto a número, porque .value siempre
       entrega texto aunque el input sea type="number". */
    if (datos.cantidad === '' || parseInt(datos.cantidad) < 1 || parseInt(datos.cantidad) > 99) {
      alert('La cantidad debe ser un número entre 1 y 99.');
      campos.cantidad.focus();
      return;
    }

    /* --- FORMA DE PAGO --- */
    if (datos.fdpago === '') {
      alert('Debes seleccionar una forma de pago.');
      campos.debito.focus();
      return;
    }


    /* ----- CAMPOS DE CONTEXTO DE LA TIENDA ----- */

    /* --- DIRECCIÓN DE DESPACHO --- */
    /* trim() quita los espacios de los extremos, para que una dirección
       hecha solo de espacios no pase como válida. */
    if (datos.direccion.trim().length < 5) {
      alert('Ingresa una dirección de despacho válida (calle y número).');
      campos.direccion.focus();
      return;
    }

    /* --- COMUNA --- */
    if (datos.comuna === '') {
      alert('Debes seleccionar la comuna de despacho.');
      campos.comuna.focus();
      return;
    }

    /* --- TIPO DE INVESTIGACIÓN --- */
    if (datos.investigacion === '') {
      alert('Cuéntanos en qué tipo de investigación usarás los equipos.');
      campos.investigacion.focus();
      return;
    }

    /* --- NIVEL DE EXPERIENCIA --- */
    if (datos.experiencia === '') {
      alert('Debes indicar tu nivel de experiencia en investigación.');
      campos.principiante.focus();
      return;
    }

    /* --- CONDICIONES DE USO --- */
    if (!datos.condiciones) {
      alert('Debes aceptar las condiciones de uso de los equipos.');
      campos.condiciones.focus();
      return;
    }


    /* ----- TODO CORRECTO ----- */
    alert(
      'Compra registrada con éxito\n\n' +
      'Cliente: ' + datos.nombre + '\n' +
      'RUT: ' + datos.rut + '\n' +
      'Producto: ' + datos.producto + '\n' +
      'Cantidad: ' + datos.cantidad + '\n' +
      'Forma de pago: ' + datos.fdpago + '\n' +
      'Despacho: ' + datos.direccion + ', ' + datos.comuna + '\n' +
      'Investigación: ' + datos.investigacion + '\n' +
      'Experiencia: ' + datos.experiencia +
      /* Si además hay productos en el carro, se agregan al resumen. */
      (resumenCarrito && resumenCarrito.totalUnidades > 0
        ? '\n\nCarro: ' + resumenCarrito.totalUnidades +
          ' artículos por ' + formatearPrecio(resumenCarrito.totalPrecio)
        : '')
    );

    /* alConfirmar lo entrega la página Carrito y sirve para vaciar el
       carro después de una compra exitosa. */
    if (alConfirmar) alConfirmar();

    limpiar();
  };


  return (
    /* Nota: los campos de correo y teléfono son type="text" a propósito.
       Si fueran type="email" y type="tel", el navegador aplicaría su
       propia validación antes de que corra nuestro código, y no se
       vería funcionar la expresión regular.

       data-bs-theme le dice a Bootstrap si pintar los controles en
       oscuro o en claro, siguiendo el tema elegido en el menú. */
    <Form
      name="formulario-compra"
      id="formulario-compra"
      data-bs-theme={tema === 'claro' ? 'light' : 'dark'}
      onSubmit={manejarEnvio}
      onReset={limpiar}
    >

      <fieldset>

        <legend>Formulario de compra</legend>

        <CampoFormulario
          id="nombre"
          etiqueta="Nombre completo"
          marcador="Ingrese su nombre"
          valor={datos.nombre}
          alCambiar={manejarCambio}
        />

        <CampoFormulario
          id="rut"
          etiqueta="RUT"
          marcador="Formato 12345678-9"
          valor={datos.rut}
          alCambiar={manejarCambio}
        />

        <CampoFormulario
          id="email"
          etiqueta="Correo electrónico"
          marcador="nombre@duocuc.cl"
          valor={datos.email}
          alCambiar={manejarCambio}
        />

        <CampoFormulario
          id="fono"
          etiqueta="Teléfono"
          marcador="+56912345678"
          valor={datos.fono}
          alCambiar={manejarCambio}
        />

        <CampoFormulario
          id="fenac"
          etiqueta="Fecha de nacimiento"
          tipo="date"
          valor={datos.fenac}
          alCambiar={manejarCambio}
        />

        <CampoFormulario
          id="producto"
          etiqueta="Seleccione producto"
          valor={datos.producto}
          alCambiar={manejarCambio}
          opciones={opcionesProducto}
          textoVacio="-- SELECCIONE PRODUCTO --"
        />

        <CampoFormulario
          id="cantidad"
          etiqueta="Cantidad"
          tipo="number"
          min="1"
          max="99"
          valor={datos.cantidad}
          alCambiar={manejarCambio}
        />

        {/* ----- DATOS DE DESPACHO (campos de contexto) ----- */}

        <CampoFormulario
          id="direccion"
          etiqueta="Dirección de despacho"
          marcador="Calle y número"
          valor={datos.direccion}
          alCambiar={manejarCambio}
        />

        <CampoFormulario
          id="comuna"
          etiqueta="Comuna"
          valor={datos.comuna}
          alCambiar={manejarCambio}
          opciones={comunas}
          textoVacio="-- SELECCIONE COMUNA --"
        />

        {/* ----- CONTEXTO DE LA INVESTIGACIÓN ----- */}

        <CampoFormulario
          id="investigacion"
          etiqueta="¿En qué tipo de investigación usarás los equipos?"
          valor={datos.investigacion}
          alCambiar={manejarCambio}
          opciones={tiposInvestigacion}
          textoVacio="-- SELECCIONE TIPO --"
        />

        <Form.Group className="mb-3">
          <Form.Label>Nivel de experiencia</Form.Label>

          <div className="opciones-pago">
            <Form.Check
              inline type="radio" name="experiencia" id="principiante"
              value="Principiante" label="Principiante"
              checked={datos.experiencia === 'Principiante'}
              onChange={manejarExperiencia}
            />
            <Form.Check
              inline type="radio" name="experiencia" id="intermedio"
              value="Intermedio" label="Intermedio"
              checked={datos.experiencia === 'Intermedio'}
              onChange={manejarExperiencia}
            />
            <Form.Check
              inline type="radio" name="experiencia" id="avanzado"
              value="Avanzado" label="Avanzado"
              checked={datos.experiencia === 'Avanzado'}
              onChange={manejarExperiencia}
            />
          </div>
        </Form.Group>

        {/* ----- FORMA DE PAGO ----- */}

        <Form.Group className="mb-3">
          <Form.Label>Forma de pago</Form.Label>

          <div className="opciones-pago">
            <Form.Check
              inline type="radio" name="fdpago" id="debito"
              value="Débito" label="Débito"
              checked={datos.fdpago === 'Débito'}
              onChange={manejarPago}
            />
            <Form.Check
              inline type="radio" name="fdpago" id="credito"
              value="Crédito" label="Crédito"
              checked={datos.fdpago === 'Crédito'}
              onChange={manejarPago}
            />
            <Form.Check
              inline type="radio" name="fdpago" id="efectivo"
              value="Efectivo" label="Efectivo"
              checked={datos.fdpago === 'Efectivo'}
              onChange={manejarPago}
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="condiciones"
            label="Acepto que los equipos son de uso investigativo y no garantizan resultados."
            checked={datos.condiciones}
            onChange={manejarCondiciones}
          />
        </Form.Group>

        {/* ----- BOTONES ----- */}
        {/* Son <Button> de React Bootstrap pero conservan las clases del
            sitio, para mantener los colores de Vestigio. */}
        <div className="botones">
          <Button type="submit" variant="danger" className="btn-comprar">
            Comprar
          </Button>
          <Button type="reset" variant="secondary" className="btn-limpiar">
            Limpiar
          </Button>
        </div>

      </fieldset>

    </Form>
  );
}

export default FormularioCompra;
