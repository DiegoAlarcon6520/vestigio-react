import { useLocation } from 'react-router-dom';

import MenuPrincipal from '../molecules/MenuPrincipal';
import ContadorCarrito from '../atoms/ContadorCarrito';
import BotonTema from '../atoms/BotonTema';

/* ORGANISMO: Header
   La barra de navegación que se repite en todas las páginas.

   En el sitio original el menú estaba copiado en los tres HTML. Acá se
   escribe una vez y App.jsx lo dibuja fuera de las rutas, así que se
   mantiene fijo mientras cambia el contenido de abajo.

   Desde la Fase 3 el menú cambia según la sesión: los enlaces de
   cuenta no son los mismos para alguien que entró y para alguien que
   no. Esos enlaces se calculan en App.jsx y llegan ya resueltos por
   props, para que este componente siga siendo solo presentación.

   El contador del carro solo aparecía en articulos.html. Ahora que el
   carro es de verdad conviene verlo también en la página de compra,
   así que se muestra en todas menos en la portada, que en el original
   no lo tenía. */
function Header({ itemsMenu, totalCarrito, tema, alAlternarTema, autenticado, alCerrarSesion }) {

  const { pathname } = useLocation();
  const esPortada = pathname === '/';

  return (
    <nav id="menu-principal">

      <MenuPrincipal itemsMenu={itemsMenu} />

      {/* El botón de salir no es un enlace: ejecuta una acción, así que
          corresponde que sea un <button>. */}
      {autenticado && (
        <button className="enlace-salir" onClick={alCerrarSesion}>
          Salir
        </button>
      )}

      {!esPortada && <ContadorCarrito total={totalCarrito} />}

      <BotonTema tema={tema} alAlternar={alAlternarTema} />

    </nav>
  );
}

export default Header;
