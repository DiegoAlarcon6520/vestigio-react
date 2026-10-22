import { Link } from 'react-router-dom';

import ImagenProducto from '../atoms/ImagenProducto';
import Precio from '../atoms/Precio';
import Valoracion from '../atoms/Valoracion';
import BotonFavorito from '../atoms/BotonFavorito';

/* MOLÉCULA: TarjetaProducto
   Una tarjeta del catálogo, armada con los átomos de arriba.

   En el HTML original este bloque estaba escrito doce veces. Acá se
   escribe una sola vez y recibe los datos por props.

   Las dos acciones (agregar al carro y marcar favorito) tampoco viven
   acá: la tarjeta solo avisa hacia arriba. El estado real está en
   App.jsx, para que el número del menú y la página de compra vean
   siempre lo mismo. */
function TarjetaProducto({ producto, alAgregar, esFavorito, alAlternarFavorito }) {
  return (
    <div className="producto">

      <Link to={'/productos/' + producto.id}>
        <ImagenProducto imagen={producto.imagen} alt={producto.alt} />
      </Link>

      <h3>
        <Link to={'/productos/' + producto.id}>{producto.nombre}</Link>
      </h3>

      <p>{producto.descripcion}</p>

      <Precio valor={producto.precio} />

      <Valoracion estrellas={producto.valoracion} />

      <button
        className="btn-carrito"
        onClick={() => alAgregar(producto)}
      >
        Agregar al carro
      </button>

      <BotonFavorito
        activo={esFavorito}
        alAlternar={() => alAlternarFavorito(producto.id)}
      />

    </div>
  );
}

export default TarjetaProducto;
