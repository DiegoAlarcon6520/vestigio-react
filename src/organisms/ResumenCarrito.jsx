import { Link } from 'react-router-dom';

import LineaCarrito from '../molecules/LineaCarrito';
import { formatearPrecio } from '../utils/formato';

/* ORGANISMO: ResumenCarrito
   La lista de productos agregados, con el total y el botón para vaciar.

   Si el carro está vacío muestra un mensaje con un enlace al catálogo,
   en vez de una tabla sin filas. */
function ResumenCarrito({ items, totalUnidades, totalPrecio, alCambiarCantidad, alQuitar, alVaciar }) {

  if (items.length === 0) {
    return (
      <p className="carrito-vacio">
        Tu carro está vacío. <Link to="/productos">Ver el catálogo →</Link>
      </p>
    );
  }

  return (
    <div className="resumen-carrito">

      {items.map((item) => (
        <LineaCarrito
          key={item.producto.id}
          item={item}
          alCambiarCantidad={alCambiarCantidad}
          alQuitar={alQuitar}
        />
      ))}

      <div className="resumen-total">
        <span>
          {totalUnidades} {totalUnidades === 1 ? 'artículo' : 'artículos'}
        </span>
        <strong>Total: {formatearPrecio(totalPrecio)}</strong>
      </div>

      <button className="btn-limpiar" onClick={alVaciar}>
        Vaciar carro
      </button>

    </div>
  );
}

export default ResumenCarrito;
