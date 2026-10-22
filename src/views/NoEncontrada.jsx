import { Link } from 'react-router-dom';

import Encabezado from '../organisms/Encabezado';
import Seccion from '../molecules/Seccion';

/* PÁGINA: NoEncontrada (error 404)
   Se muestra cuando la URL no coincide con ninguna ruta conocida.

   En App.jsx está asociada a la ruta "*", que en react-router significa
   "cualquier cosa que no haya coincidido antes". Por eso tiene que ir
   siempre al final de la lista de rutas.

   El sitio estático no tenía esta página: un enlace roto mostraba el
   404 genérico del servidor. */
function NoEncontrada() {
  return (
    <>
      <Encabezado
        titulo="ERROR 404"
        subtitulo="Esta página no existe... o no quiere ser encontrada"
      />

      <Seccion titulo="Nada por aquí">
        <p>
          La dirección que escribiste no corresponde a ninguna sección de
          Vestigio. Puede que el enlace esté mal copiado o que la página
          se haya movido.
        </p>
        <p><Link to="/">← Volver al inicio</Link></p>
      </Seccion>
    </>
  );
}

export default NoEncontrada;
