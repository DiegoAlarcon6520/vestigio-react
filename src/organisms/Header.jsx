import { useLocation } from 'react-router-dom';

import MenuPrincipal from '../molecules/MenuPrincipal';
import ContadorCarrito from '../atoms/ContadorCarrito';
import BotonTema from '../atoms/BotonTema';

/* ORGANISMO: Header
   La barra de navegación que se repite en todas las páginas.

   En el sitio original el menú estaba copiado en los tres HTML. Acá se
   escribe una vez y App.jsx lo dibuja fuera de las rutas, así que se
   mantiene fijo mientras cambia el contenido de abajo.

   El contador del carro solo aparecía en articulos.html. Ahora que el
   carro es de verdad, conviene verlo también en la página de compra,
   así que se muestra en todas menos en la portada, que en el original
   no lo tenía.

   El botón de tema es el único agregado respecto del diseño original. */
function Header({ itemsMenu, totalCarrito, tema, alAlternarTema }) {

  const { pathname } = useLocation();
  const esPortada = pathname === '/';

  return (
    <nav id="menu-principal">

      <MenuPrincipal itemsMenu={itemsMenu} />

      {!esPortada && <ContadorCarrito total={totalCarrito} />}

      <BotonTema tema={tema} alAlternar={alAlternarTema} />

    </nav>
  );
}

export default Header;
