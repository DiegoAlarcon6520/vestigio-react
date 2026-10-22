/* ORGANISMO: Footer
   El pie de página. En el HTML original era un simple
   <p class="footer"> repetido en las tres páginas.

   El texto llega por props en vez de estar escrito acá dentro, para que
   cambiar el año o la frase se haga en un solo lugar (App.jsx). */
function Footer({ texto }) {
  return <p className="footer">{texto}</p>;
}

export default Footer;
