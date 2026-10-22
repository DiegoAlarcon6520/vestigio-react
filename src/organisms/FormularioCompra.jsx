/* ==========================================================
   VESTIGIO — Formulario de pedido con validación
   ==========================================================
   Port del archivo js/validarformulario.js del sitio original, con dos
   cambios de fondo introducidos en la Fase 5:

   1. Ya no pregunta QUÉ se compra ni CUÁNTO.
      Eso lo decide el carro, que el usuario armó recorriendo el
      catálogo. Preguntarlo otra vez acá era pedir dos veces el mismo
      dato y abría la puerta a que no coincidieran. La validación
      "debes seleccionar un producto" se traslada a "el carro no puede
      estar vacío", y el rango de 1 a 99 unidades lo impone ahora el
      propio carro (MAX_POR_LINEA en useCarrito).

   2. Tiene dos modos según quién compra.
      - INVITADO: sin sesión. Escribe todos sus datos, igual que antes.
      - CLIENTE: con sesión. Sus datos ya quedaron guardados y
        validados al registrarse, así que solo completa lo propio de
        este pedido.

   El administrador no compra: esa restricción se resuelve antes, en la
   página Carrito, que ni siquiera monta este formulario.

   Validaciones heredadas de la primera entrega que se conservan:
     - Formato de RUT
     - Correos de dominios permitidos
     - Teléfono con prefijo +56
     - Mayor de 18 años
     - Productos del propio e-commerce (ahora, vía carro)
   ========================================================== */

import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import CampoFormulario from '../molecules/CampoFormulario';
import { formatearPrecio } from '../utils/formato';
import {
  comunas,
  tiposInvestigacion,
  nivelesExperiencia,
  horariosDespacho
} from '../data/opciones';


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


/* ===== FUNCIÓN AUXILIAR: CALCULAR EDAD ===== */
/* La edad no se puede validar con una expresión regular porque depende
   de la fecha de hoy, así que se calcula aparte.

   El input type="date" entrega el valor como "AAAA-MM-DD". Se separa
   con split("-") en lugar de usar new Date(), porque new Date()
   interpreta ese texto como hora UTC y en Chile puede restar un día.

   Se exporta para poder probarla sola con Vitest y para que el
   formulario de registro use exactamente la misma regla. */
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


/* ===== ESTADO INICIAL =====
   Un solo objeto con todos los campos. Cada clave coincide con el id
   del control correspondiente, lo que permite un único manejador. */
const datosVacios = {
  nombre: '',
  rut: '',
  email: '',
  fono: '',
  fenac: '',
  direccion: '',
  comuna: '',
  investigacion: '',
  experiencia: '',
  horario: '',
  fdpago: '',
  condiciones: false
};


function FormularioCompra({ tema, usuario, resumenCarrito, alConfirmar }) {

  /* usuario llega con valor cuando hay sesión de cliente, y en null
     cuando compra un invitado. De ahí sale todo lo demás. */
  const esCliente = !!usuario;

  const [datos, setDatos] = useState(datosVacios);

  /* Un solo manejador para los campos de texto y los select: usa el id
     del control como nombre de la propiedad que hay que actualizar.
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

  /* En un checkbox el dato útil es checked, no value. */
  const manejarCondiciones = (evento) => {
    setDatos({ ...datos, condiciones: evento.target.checked });
  };

  const limpiar = () => setDatos(datosVacios);


  /* ===== VALIDACIÓN AL ENVIAR =====
     preventDefault() evita que la página se recargue, así alcanzamos a
     revisar los datos antes de que el navegador haga lo suyo. */
  const manejarEnvio = (evento) => {

    evento.preventDefault();

    /* elements permite hacer foco en el campo que falló, igual que el
       nombre.focus() del archivo original. */
    const campos = evento.target.elements;


    /* --- EL CARRO NO PUEDE ESTAR VACÍO ---
       Reemplaza a la antigua validación "debes seleccionar un producto
       del catálogo": ahora lo que se compra viene del carro. */
    if (!resumenCarrito || resumenCarrito.totalUnidades === 0) {
      alert('Debes agregar al menos un equipo al carro antes de comprar.');
      return;
    }


    /* --- DATOS PERSONALES ---
       Solo se revisan cuando compra un invitado. Para un cliente con
       sesión estos mismos datos ya pasaron por las mismas reglas al
       crear su cuenta, así que volver a pedirlos sería redundante. */
    if (!esCliente) {

      if (!regexNombre.test(datos.nombre)) {
        alert('El nombre solo debe contener letras y espacios.');
        campos.nombre.focus();
        return;
      }

      if (!regexRut.test(datos.rut)) {
        alert('El RUT debe tener el formato 12345678-9 (sin puntos).');
        campos.rut.focus();
        return;
      }

      if (!regexEmail.test(datos.email)) {
        alert('El correo debe pertenecer a un dominio permitido: gmail.com, outlook.com, hotmail.com, duocuc.cl o duoc.cl');
        campos.email.focus();
        return;
      }

      if (!regexFono.test(datos.fono)) {
        alert('El teléfono debe empezar con +56 y tener 9 dígitos después. Ejemplo: +56912345678');
        campos.fono.focus();
        return;
      }

      if (datos.fenac === '') {
        alert('Debes ingresar tu fecha de nacimiento.');
        campos.fenac.focus();
        return;
      }

      const edad = calcularEdad(datos.fenac);

      if (edad < 18) {
        alert('Debes ser mayor de 18 años para comprar en Vestigio. Edad registrada: ' + edad + ' años.');
        campos.fenac.focus();
        return;
      }

      if (datos.direccion.trim().length < 5) {
        alert('Ingresa una dirección de despacho válida (calle y número).');
        campos.direccion.focus();
        return;
      }

      if (datos.comuna === '') {
        alert('Debes seleccionar la comuna de despacho.');
        campos.comuna.focus();
        return;
      }

      if (datos.experiencia === '') {
        alert('Debes indicar tu nivel de experiencia en investigación.');
        campos.experiencia.focus();
        return;
      }
    }


    /* --- DATOS DEL PEDIDO ---
       Estos los completan los dos tipos de comprador, porque cambian
       de un pedido a otro. */

    if (datos.investigacion === '') {
      alert('Cuéntanos en qué tipo de investigación usarás los equipos.');
      campos.investigacion.focus();
      return;
    }

    if (datos.horario === '') {
      alert('Debes seleccionar un horario de despacho.');
      campos.horario.focus();
      return;
    }

    if (datos.fdpago === '') {
      alert('Debes seleccionar una forma de pago.');
      campos.debito.focus();
      return;
    }

    if (!datos.condiciones) {
      alert('Debes aceptar las condiciones de uso de los equipos.');
      campos.condiciones.focus();
      return;
    }


    /* ----- TODO CORRECTO -----
       El comprador puede venir del formulario o de la cuenta, así que
       primero se arma un único objeto con los datos finales. */
    const comprador = esCliente
      ? {
          nombre: usuario.nombre,
          rut: usuario.rut,
          direccion: usuario.direccion,
          comuna: usuario.comuna,
          experiencia: usuario.experiencia
        }
      : {
          nombre: datos.nombre,
          rut: datos.rut,
          direccion: datos.direccion,
          comuna: datos.comuna,
          experiencia: datos.experiencia
        };

    /* El detalle de lo comprado sale del carro, no del formulario. */
    const detalle = resumenCarrito.items
      .map((item) => '  - ' + item.producto.nombre + ' x' + item.cantidad)
      .join('\n');

    alert(
      'Compra registrada con éxito\n\n' +
      'Cliente: ' + comprador.nombre + '\n' +
      'RUT: ' + comprador.rut + '\n' +
      'Despacho: ' + comprador.direccion + ', ' + comprador.comuna + '\n' +
      'Horario: ' + datos.horario + '\n' +
      'Investigación: ' + datos.investigacion + '\n' +
      'Experiencia: ' + comprador.experiencia + '\n' +
      'Forma de pago: ' + datos.fdpago + '\n\n' +
      'Equipos:\n' + detalle + '\n\n' +
      'Total: ' + formatearPrecio(resumenCarrito.totalPrecio)
    );

    /* alConfirmar lo entrega la página Carrito y vacía el carro. */
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

        <legend>{esCliente ? 'Confirmar pedido' : 'Datos de compra'}</legend>

        {esCliente ? (
          /* ===== MODO CLIENTE =====
             Sus datos ya están guardados: se muestran para que los
             revise, y se le avisa dónde cambiarlos. */
          <div className="ficha-comprador">
            <p className="ficha-comprador-titulo">Comprando como</p>
            <p><strong>{usuario.nombre}</strong> · {usuario.rut}</p>
            <p>{usuario.email} · {usuario.fono}</p>
            <p>Despacho a {usuario.direccion}, {usuario.comuna}</p>
            <p className="nota-formulario">
              Para cambiar estos datos, edítalos en tu perfil.
            </p>
          </div>
        ) : (
          /* ===== MODO INVITADO =====
             Escribe todo, con las mismas validaciones de siempre. */
          <>
            <p className="nota-formulario">
              Estás comprando como invitado. Si creas una cuenta, la
              próxima vez no tendrás que escribir estos datos.
            </p>

            <h3 className="subtitulo-formulario">Tus datos</h3>

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
              marcador="nombre@gmail.com"
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

            <h3 className="subtitulo-formulario">Despacho</h3>

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

            <CampoFormulario
              id="experiencia"
              etiqueta="Nivel de experiencia"
              valor={datos.experiencia}
              alCambiar={manejarCambio}
              opciones={nivelesExperiencia}
              textoVacio="-- SELECCIONE NIVEL --"
            />
          </>
        )}

        {/* ===== DATOS DE ESTE PEDIDO =====
            Los completan tanto el invitado como el cliente, porque
            cambian de una compra a otra. */}

        <h3 className="subtitulo-formulario">Este pedido</h3>

        <CampoFormulario
          id="investigacion"
          etiqueta="¿En qué tipo de investigación usarás los equipos?"
          valor={datos.investigacion}
          alCambiar={manejarCambio}
          opciones={tiposInvestigacion}
          textoVacio="-- SELECCIONE TIPO --"
        />

        <CampoFormulario
          id="horario"
          etiqueta="Horario de despacho"
          valor={datos.horario}
          alCambiar={manejarCambio}
          opciones={horariosDespacho}
          textoVacio="-- SELECCIONE HORARIO --"
        />

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

        {/* ===== BOTONES =====
            Son <Button> de React Bootstrap pero conservan las clases
            del sitio, para mantener los colores de Vestigio. */}
        <div className="botones">
          <Button type="submit" variant="danger" className="btn-comprar">
            {esCliente ? 'Confirmar compra' : 'Comprar'}
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
