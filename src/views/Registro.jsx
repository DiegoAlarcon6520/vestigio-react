import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Encabezado from '../organisms/Encabezado';
import Seccion from '../molecules/Seccion';
import FormularioRegistro from '../organisms/FormularioRegistro';

/* PÁGINA: Registro
   Creación de cuenta.

   Después de registrarse correctamente se muestra un aviso y, tras un
   momento, se manda al usuario al login. El setTimeout da tiempo a
   leer el mensaje antes de cambiar de página. */
function Registro({ auth, tema }) {

  const navigate = useNavigate();
  const [listo, setListo] = useState(false);

  const manejarRegistro = (datos) => {
    const resultado = auth.registrar(datos);

    if (resultado.ok) {
      setListo(true);
      setTimeout(() => navigate('/login'), 1800);
    }

    return resultado;
  };

  return (
    <>
      <Encabezado
        titulo="CREAR CUENTA"
        subtitulo="Únete a la comunidad de investigadores de Vestigio"
      />

      {listo ? (
        <Seccion titulo="Cuenta creada">
          <p>
            Tu cuenta quedó registrada. Te llevamos al inicio de sesión...
          </p>
        </Seccion>
      ) : (
        <FormularioRegistro tema={tema} alEnviar={manejarRegistro} />
      )}

      <Seccion titulo="¿Ya tienes cuenta?">
        <p>
          Entra directamente desde <Link to="/login">el inicio de sesión</Link>.
        </p>
      </Seccion>
    </>
  );
}

export default Registro;
