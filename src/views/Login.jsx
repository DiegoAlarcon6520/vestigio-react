import { Link, useLocation, useNavigate } from 'react-router-dom';

import Encabezado from '../organisms/Encabezado';
import Seccion from '../molecules/Seccion';
import FormularioLogin from '../organisms/FormularioLogin';

/* PÁGINA: Login
   Inicio de sesión con credenciales estáticas.

   Dos hooks del router trabajan juntos acá:
     useLocation  trae el state que dejó RutaPrivada al redirigir, con
                  la dirección que el usuario quería visitar
     useNavigate  permite cambiar de página desde el código, no con un
                  clic en un enlace

   Así, si alguien escribe /panel sin sesión, lo mandamos al login y
   después de entrar vuelve a /panel en vez de quedar en la portada. */
function Login({ auth, tema }) {

  const navigate = useNavigate();
  const location = useLocation();

  /* El ?. evita un error si no viene ningún state. Si no hay destino
     guardado, se usa /perfil como valor por defecto. */
  const volverA = location.state?.volverA || '/perfil';

  const manejarLogin = (email, password) => {
    const resultado = auth.iniciarSesion(email, password);

    if (resultado.ok) {
      /* replace: true evita que el botón Atrás devuelva al login. */
      navigate(volverA, { replace: true });
    }

    /* Se devuelve el resultado para que el formulario muestre el error. */
    return resultado;
  };

  return (
    <>
      <Encabezado
        titulo="INICIAR SESIÓN"
        subtitulo="Accede para administrar el catálogo y revisar tus datos"
      />

      <FormularioLogin tema={tema} alEnviar={manejarLogin} />

      <Seccion titulo="¿Primera vez?">
        <p>
          Si todavía no tienes cuenta, puedes <Link to="/registro">crear una acá</Link>.
        </p>
        <p className="nota-credenciales">
          Cuenta de demostración del administrador:
          <br />
          <strong>admin@vestigio.cl</strong> / <strong>vestigio123</strong>
        </p>
      </Seccion>
    </>
  );
}

export default Login;
