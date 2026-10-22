/* ÁTOMO: TituloPrincipal
   El <h1> que encabeza cada página. En el CSS original lleva la
   tipografía Trebuchet y el letter-spacing que da el aire "de misterio".
   Es un átomo porque no se puede descomponer más: es una sola etiqueta. */
function TituloPrincipal({ texto }) {
  return <h1>{texto}</h1>;
}

export default TituloPrincipal;
