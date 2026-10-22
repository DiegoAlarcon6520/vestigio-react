/* ÁTOMO: ImagenProducto
   La foto cuadrada de un producto.

   Los atributos width y height son los mismos del HTML original: no
   definen el tamaño final (de eso se encarga el CSS), sino que le avisan
   al navegador la proporción para que no salte el diseño mientras carga. */
function ImagenProducto({ imagen, alt }) {
  return (
    <img
      className="producto-imagen"
      src={imagen}
      width="600"
      height="600"
      alt={alt}
    />
  );
}

export default ImagenProducto;
