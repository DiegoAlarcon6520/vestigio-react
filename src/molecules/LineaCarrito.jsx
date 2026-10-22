import { Link } from 'react-router-dom';

import { formatearPrecio } from '../utils/formato';

/* MOLÉCULA: LineaCarrito
   Una fila del resumen del carro: la miniatura, el nombre, los
   controles de cantidad y el subtotal.

   El subtotal se calcula acá mismo multiplicando precio por cantidad.
   No se guarda en el estado porque siempre se puede deducir de los
   otros dos datos. */
function LineaCarrito({ item, alCambiarCantidad, alQuitar }) {

  const { producto, cantidad } = item;

  return (
    <div className="linea-carrito">

      <img
        className="linea-carrito-imagen"
        src={producto.imagen}
        alt={producto.alt}
      />

      <div className="linea-carrito-datos">
        <Link to={'/productos/' + producto.id}>{producto.nombre}</Link>
        <span className="linea-carrito-unitario">{producto.precio} c/u</span>
      </div>

      <div className="linea-carrito-cantidad">
        <button
          onClick={() => alCambiarCantidad(producto.id, cantidad - 1)}
          aria-label={'Quitar una unidad de ' + producto.nombre}
        >
          −
        </button>

        <span>{cantidad}</span>

        <button
          onClick={() => alCambiarCantidad(producto.id, cantidad + 1)}
          aria-label={'Agregar una unidad de ' + producto.nombre}
        >
          +
        </button>
      </div>

      <span className="linea-carrito-subtotal">
        {formatearPrecio(producto.valor * cantidad)}
      </span>

      <button
        className="linea-carrito-quitar"
        onClick={() => alQuitar(producto.id)}
        aria-label={'Quitar ' + producto.nombre + ' del carro'}
      >
        ✕
      </button>

    </div>
  );
}

export default LineaCarrito;
