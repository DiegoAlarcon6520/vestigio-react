import { Link } from 'react-router-dom';

/* ÁTOMO: EnlaceMenu
   Un enlace del menú superior.

   Usa <Link> en vez de <a> para que el router cambie de página sin
   recargar el navegador. Por debajo <Link> igual genera una etiqueta <a>,
   así que el CSS original (nav a { color: #d97e77 }) sigue aplicando sin
   tener que tocarlo. */
function EnlaceMenu({ destino, texto }) {
  return <Link to={destino}>{texto}</Link>;
}

export default EnlaceMenu;
