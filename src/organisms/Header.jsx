import { useLocation } from 'react-router-dom';

import MenuPrincipal from '../molecules/MenuPrincipal';

/* ORGANISMO: Header
   La barra de navegación que se repite en todas las páginas.

   En el sitio original el menú estaba copiado en los tres HTML. Acá se
   escribe una vez y App.jsx lo dibuja fuera de las rutas, así que se
   mantiene fijo mientras cambia el contenido de abajo.

   El contador del carro (🛒 0) solo aparecía en articulos.html, no en la
   portada ni en el formulario de compra. useLocation() nos dice en qué
   ruta estamos para respetar ese detalle.

   En esta fase el número es un 0 fijo. En la Fase 2 pasará a ser un
   estado real que sube cuando se agrega un producto. */
function Header({ itemsMenu }) {

  const { pathname } = useLocation();
  const enCatalogo = pathname === '/productos';

  return (
    <nav id="menu-principal">

      <MenuPrincipal itemsMenu={itemsMenu} />

      {enCatalogo && (
        <span className="carrito">
          🛒 <span id="carrito-contador" className="carrito-contador">0</span>
        </span>
      )}

    </nav>
  );
}

export default Header;
