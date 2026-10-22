import TarjetaProducto from '../molecules/TarjetaProducto';

/* ORGANISMO: GaleriaProductos
   La cuadrícula del catálogo: el <div class="catalogo"> que en el CSS
   original se arma con grid de 3 columnas y baja a 2 y a 1 en pantallas
   angostas.

   Recibe la lista ya filtrada y dibuja una tarjeta por cada producto.
   No sabe de dónde vienen los datos ni qué filtro se aplicó: por eso
   sirve igual para el catálogo completo que para un resultado de
   búsqueda.

   Si la lista llega vacía muestra un aviso en lugar de una cuadrícula
   en blanco. */
function GaleriaProductos({ productos, alAgregar, esFavorito, alAlternarFavorito }) {

  if (productos.length === 0) {
    return (
      <p className="sin-resultados">
        No encontramos equipos que coincidan con tu búsqueda.
      </p>
    );
  }

  return (
    <div className="catalogo">
      {productos.map((producto) => (
        <TarjetaProducto
          key={producto.id}
          producto={producto}
          alAgregar={alAgregar}
          esFavorito={esFavorito(producto.id)}
          alAlternarFavorito={alAlternarFavorito}
        />
      ))}
    </div>
  );
}

export default GaleriaProductos;
