/* MOLÉCULA: Seccion
   El bloque de texto que se repite en la portada: un <h2> y debajo el
   contenido. Reemplaza a los <section class="seccion"> que en el HTML
   original estaban copiados y pegados tres veces.

   children es una prop especial de React: contiene todo lo que se
   escriba entre la etiqueta de apertura y la de cierre del componente.
   Gracias a eso cada sección puede llevar los párrafos que quiera.

   id es opcional y solo lo usa la sección de Contacto, porque el menú
   necesita poder saltar hasta ella con "#contacto". */
function Seccion({ id, titulo, children }) {
  return (
    <section id={id} className="seccion">
      <h2>{titulo}</h2>
      {children}
    </section>
  );
}

export default Seccion;
