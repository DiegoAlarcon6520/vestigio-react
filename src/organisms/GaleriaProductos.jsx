import TarjetaProducto from '../molecules/TarjetaProducto';

/* ORGANISMO: GaleriaProductos
   La cuadrícula del catálogo: el <div class="catalogo"> que en el CSS
   original se arma con grid de 3 columnas y baja a 2 y a 1 en pantallas
   angostas.

   Recibe la lista de productos y dibuja una TarjetaProducto por cada uno.
   No sabe de dónde vienen los datos: eso lo decide la página que lo usa.
   Gracias a eso el mismo organismo servirá después para mostrar
   resultados filtrados sin cambiarle una línea. */
function GaleriaProductos({ productos }) {
  return (
    <div className="catalogo">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          id={producto.id}
          imagen={producto.imagen}
          nombre={producto.nombre}
          descripcion={producto.descripcion}
          precio={producto.precio}
          valoracion={producto.valoracion}
          alt={producto.alt}
        />
      ))}
    </div>
  );
}

export default GaleriaProductos;
