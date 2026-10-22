import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import CampoFormulario from '../molecules/CampoFormulario';
import { calcularEdad } from './FormularioCompra';
import {
  comunas,
  perfilesInvestigador,
  nivelesExperiencia,
  fenomenosInteres,
  equipamientoPrevio
} from '../data/opciones';

/* ORGANISMO: FormularioRegistro
   Crea una cuenta nueva.

   Desde la Fase 5 el registro pide más datos que antes, y hay una
   razón concreta: la cuenta guarda todo lo necesario para que después
   la compra sea de dos clics. Un usuario con sesión iniciada ya no
   vuelve a escribir su nombre, su RUT ni su dirección.

   Los datos se agrupan en tres bloques:
     1. Identificación   nombre, RUT, correo, teléfono, nacimiento
     2. Despacho         dirección y comuna
     3. Perfil de investigador — los campos propios de Vestigio

   Reutiliza las expresiones regulares del formulario de compra, de
   modo que las reglas de la tienda sean una sola en todo el sitio,
   y también calcularEdad, que ya estaba escrita y probada. */

const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const regexRut = /^[0-9]{7,8}-[0-9kK]{1}$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|duocuc\.cl|duoc\.cl|profesor\.duoc\.cl)$/;
const regexFono = /^\+56[0-9]{9}$/;

const datosVacios = {
  nombre: '',
  rut: '',
  email: '',
  fono: '',
  fenac: '',
  direccion: '',
  comuna: '',
  perfil: '',
  experiencia: '',
  fenomeno: '',
  equipamiento: '',
  password: '',
  password2: ''
};


function FormularioRegistro({ tema, alEnviar }) {

  const [datos, setDatos] = useState(datosVacios);
  const [error, setError] = useState('');

  const manejarCambio = (evento) => {
    const { id, value } = evento.target;
    setDatos({ ...datos, [id]: value });
    setError('');
  };

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    const campos = evento.target.elements;

    /* ----- 1. IDENTIFICACIÓN ----- */

    if (!regexNombre.test(datos.nombre)) {
      setError('El nombre solo debe contener letras y espacios.');
      campos.nombre.focus();
      return;
    }

    if (!regexRut.test(datos.rut)) {
      setError('El RUT debe tener el formato 12345678-9 (sin puntos).');
      campos.rut.focus();
      return;
    }

    if (!regexEmail.test(datos.email)) {
      setError('El correo debe ser de un dominio permitido: gmail.com, outlook.com, hotmail.com, duocuc.cl o duoc.cl');
      campos.email.focus();
      return;
    }

    if (!regexFono.test(datos.fono)) {
      setError('El teléfono debe empezar con +56 y tener 9 dígitos después. Ejemplo: +56912345678');
      campos.fono.focus();
      return;
    }

    if (datos.fenac === '') {
      setError('Debes ingresar tu fecha de nacimiento.');
      campos.fenac.focus();
      return;
    }

    if (calcularEdad(datos.fenac) < 18) {
      setError('Debes ser mayor de 18 años para crear una cuenta en Vestigio.');
      campos.fenac.focus();
      return;
    }

    /* ----- 2. DESPACHO -----
       Se piden acá para que la compra posterior no vuelva a pedirlos. */

    if (datos.direccion.trim().length < 5) {
      setError('Ingresa una dirección válida (calle y número).');
      campos.direccion.focus();
      return;
    }

    if (datos.comuna === '') {
      setError('Debes seleccionar tu comuna.');
      campos.comuna.focus();
      return;
    }

    /* ----- 3. PERFIL DE INVESTIGADOR -----
       Los campos propios de la temática de la tienda. */

    if (datos.perfil === '') {
      setError('Cuéntanos qué tipo de investigador eres.');
      campos.perfil.focus();
      return;
    }

    if (datos.experiencia === '') {
      setError('Indica tu nivel de experiencia en investigación.');
      campos.experiencia.focus();
      return;
    }

    if (datos.fenomeno === '') {
      setError('Selecciona el fenómeno que más te interesa registrar.');
      campos.fenomeno.focus();
      return;
    }

    if (datos.equipamiento === '') {
      setError('Indícanos con qué equipamiento cuentas actualmente.');
      campos.equipamiento.focus();
      return;
    }

    /* ----- 4. CONTRASEÑA ----- */

    if (datos.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      campos.password.focus();
      return;
    }

    if (datos.password !== datos.password2) {
      setError('Las dos contraseñas no coinciden.');
      campos.password2.focus();
      return;
    }

    /* Todo correcto. No se envía password2, que solo servía para
       comparar; el resto viaja completo porque la cuenta lo guardará. */
    const { password2, ...cuenta } = datos;

    const resultado = alEnviar({ ...cuenta, nombre: datos.nombre.trim() });

    if (!resultado.ok) {
      setError(resultado.mensaje);
      return;
    }

    setDatos(datosVacios);
  };

  return (
    <Form
      id="formulario-registro"
      data-bs-theme={tema === 'claro' ? 'light' : 'dark'}
      onSubmit={manejarEnvio}
    >
      <fieldset>

        <legend>Datos de la cuenta</legend>

        <p className="nota-formulario">
          Estos datos quedarán guardados en tu cuenta, de modo que al
          comprar no tengas que volver a escribirlos.
        </p>

        <h3 className="subtitulo-formulario">Identificación</h3>

        <CampoFormulario id="nombre" etiqueta="Nombre completo"
          marcador="Ingrese su nombre" valor={datos.nombre} alCambiar={manejarCambio} />

        <CampoFormulario id="rut" etiqueta="RUT"
          marcador="Formato 12345678-9" valor={datos.rut} alCambiar={manejarCambio} />

        <CampoFormulario id="email" etiqueta="Correo electrónico"
          marcador="nombre@gmail.com" valor={datos.email} alCambiar={manejarCambio} />

        <CampoFormulario id="fono" etiqueta="Teléfono"
          marcador="+56912345678" valor={datos.fono} alCambiar={manejarCambio} />

        <CampoFormulario id="fenac" etiqueta="Fecha de nacimiento"
          tipo="date" valor={datos.fenac} alCambiar={manejarCambio} />

        <h3 className="subtitulo-formulario">Despacho</h3>

        <CampoFormulario id="direccion" etiqueta="Dirección"
          marcador="Calle y número" valor={datos.direccion} alCambiar={manejarCambio} />

        <CampoFormulario id="comuna" etiqueta="Comuna"
          valor={datos.comuna} alCambiar={manejarCambio}
          opciones={comunas} textoVacio="-- SELECCIONE COMUNA --" />

        <h3 className="subtitulo-formulario">Perfil de investigador</h3>

        <CampoFormulario id="perfil" etiqueta="¿Qué tipo de investigador eres?"
          valor={datos.perfil} alCambiar={manejarCambio}
          opciones={perfilesInvestigador} textoVacio="-- SELECCIONE PERFIL --" />

        <CampoFormulario id="experiencia" etiqueta="Nivel de experiencia"
          valor={datos.experiencia} alCambiar={manejarCambio}
          opciones={nivelesExperiencia} textoVacio="-- SELECCIONE NIVEL --" />

        <CampoFormulario id="fenomeno" etiqueta="¿Qué fenómeno te interesa registrar?"
          valor={datos.fenomeno} alCambiar={manejarCambio}
          opciones={fenomenosInteres} textoVacio="-- SELECCIONE FENÓMENO --" />

        <CampoFormulario id="equipamiento" etiqueta="¿Con qué equipamiento cuentas hoy?"
          valor={datos.equipamiento} alCambiar={manejarCambio}
          opciones={equipamientoPrevio} textoVacio="-- SELECCIONE OPCIÓN --" />

        <h3 className="subtitulo-formulario">Contraseña</h3>

        <CampoFormulario id="password" etiqueta="Contraseña" tipo="password"
          marcador="Mínimo 6 caracteres" valor={datos.password} alCambiar={manejarCambio} />

        <CampoFormulario id="password2" etiqueta="Repetir contraseña" tipo="password"
          marcador="Repita su contraseña" valor={datos.password2} alCambiar={manejarCambio} />

        {error && <p className="mensaje-error" role="alert">{error}</p>}

        <div className="botones">
          <Button type="submit" variant="danger" className="btn-comprar">
            Crear cuenta
          </Button>
        </div>

      </fieldset>
    </Form>
  );
}

export default FormularioRegistro;
