import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import CampoFormulario from '../molecules/CampoFormulario';
import { calcularEdad } from './FormularioCompra';

/* ORGANISMO: FormularioRegistro
   Crea una cuenta nueva.

   Reutiliza las mismas expresiones regulares del formulario de compra
   para el nombre, el RUT y el correo, de modo que las reglas de la
   tienda sean una sola en todo el sitio. También reutiliza
   calcularEdad, que ya estaba escrita y probada.

   Los campos de contexto acá son el tipo de investigador y la comuna:
   sirven para que la tienda sepa a quién le está vendiendo. */

const regexNombre = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const regexRut = /^[0-9]{7,8}-[0-9kK]{1}$/;
const regexEmail = /^[a-zA-Z0-9._%+-]+@(gmail\.com|outlook\.com|hotmail\.com|duocuc\.cl|duoc\.cl|profesor\.duoc\.cl)$/;

const perfiles = [
  { valor: 'Aficionado', texto: 'Aficionado / curioso' },
  { valor: 'Investigador', texto: 'Investigador independiente' },
  { valor: 'Equipo', texto: 'Integrante de un equipo de investigación' },
  { valor: 'Medio', texto: 'Medio de comunicación o documentalista' }
];

const datosVacios = {
  nombre: '',
  rut: '',
  email: '',
  fenac: '',
  perfil: '',
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

    /* --- NOMBRE --- */
    if (!regexNombre.test(datos.nombre)) {
      setError('El nombre solo debe contener letras y espacios.');
      campos.nombre.focus();
      return;
    }

    /* --- RUT --- */
    if (!regexRut.test(datos.rut)) {
      setError('El RUT debe tener el formato 12345678-9 (sin puntos).');
      campos.rut.focus();
      return;
    }

    /* --- CORREO --- */
    if (!regexEmail.test(datos.email)) {
      setError('El correo debe ser de un dominio permitido: gmail.com, outlook.com, hotmail.com, duocuc.cl o duoc.cl');
      campos.email.focus();
      return;
    }

    /* --- MAYOR DE 18 --- */
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

    /* --- PERFIL DE INVESTIGADOR (campo de contexto) --- */
    if (datos.perfil === '') {
      setError('Cuéntanos qué tipo de investigador eres.');
      campos.perfil.focus();
      return;
    }

    /* --- CONTRASEÑA --- */
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

    /* Todo correcto: se le entrega a la página, que llama a useAuth.
       No se envía password2, que solo servía para comparar. */
    const resultado = alEnviar({
      nombre: datos.nombre.trim(),
      rut: datos.rut,
      email: datos.email,
      fenac: datos.fenac,
      perfil: datos.perfil,
      password: datos.password
    });

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

        <CampoFormulario id="nombre" etiqueta="Nombre completo"
          marcador="Ingrese su nombre" valor={datos.nombre} alCambiar={manejarCambio} />

        <CampoFormulario id="rut" etiqueta="RUT"
          marcador="Formato 12345678-9" valor={datos.rut} alCambiar={manejarCambio} />

        <CampoFormulario id="email" etiqueta="Correo electrónico"
          marcador="nombre@duocuc.cl" valor={datos.email} alCambiar={manejarCambio} />

        <CampoFormulario id="fenac" etiqueta="Fecha de nacimiento"
          tipo="date" valor={datos.fenac} alCambiar={manejarCambio} />

        <CampoFormulario id="perfil" etiqueta="¿Qué tipo de investigador eres?"
          valor={datos.perfil} alCambiar={manejarCambio}
          opciones={perfiles} textoVacio="-- SELECCIONE PERFIL --" />

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
