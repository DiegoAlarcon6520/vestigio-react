import { useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import CampoFormulario from '../molecules/CampoFormulario';

/* ORGANISMO: FormularioLogin
   Pide correo y contraseña y avisa hacia arriba el resultado.

   No sabe cuáles son las credenciales correctas: eso lo decide el hook
   useAuth. Acá solo se valida que los campos estén bien escritos y se
   muestra el mensaje de error que devuelva el intento.

   El error se guarda en un estado propio porque es información que
   solo le importa a este formulario. */
function FormularioLogin({ tema, alEnviar }) {

  const [datos, setDatos] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const manejarCambio = (evento) => {
    const { id, value } = evento.target;
    setDatos({ ...datos, [id]: value });
    setError(''); // al escribir, se limpia el error anterior
  };

  const manejarEnvio = (evento) => {
    evento.preventDefault();

    /* Validación de forma antes de intentar entrar. */
    if (datos.email.trim() === '') {
      setError('Ingresa tu correo electrónico.');
      return;
    }
    if (datos.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    /* alEnviar lo entrega la página Login y devuelve { ok, mensaje }. */
    const resultado = alEnviar(datos.email, datos.password);

    if (!resultado.ok) {
      setError(resultado.mensaje);
    }
  };

  return (
    <Form
      id="formulario-login"
      data-bs-theme={tema === 'claro' ? 'light' : 'dark'}
      onSubmit={manejarEnvio}
    >
      <fieldset>

        <legend>Acceso a tu cuenta</legend>

        <CampoFormulario
          id="email"
          etiqueta="Correo electrónico"
          marcador="admin@vestigio.cl"
          valor={datos.email}
          alCambiar={manejarCambio}
        />

        <CampoFormulario
          id="password"
          etiqueta="Contraseña"
          tipo="password"
          marcador="Ingrese su contraseña"
          valor={datos.password}
          alCambiar={manejarCambio}
        />

        {/* El mensaje solo aparece si hay algo que mostrar. En React,
            {condición && <elemento/>} dibuja el elemento solo cuando la
            condición es verdadera. */}
        {error && <p className="mensaje-error" role="alert">{error}</p>}

        <div className="botones">
          <Button type="submit" variant="danger" className="btn-comprar">
            Entrar
          </Button>
        </div>

      </fieldset>
    </Form>
  );
}

export default FormularioLogin;
