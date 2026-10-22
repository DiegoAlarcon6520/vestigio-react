import { Link } from 'react-router-dom';

import ImagenProducto from '../atoms/ImagenProducto';
import Precio from '../atoms/Precio';
import Valoracion from '../atoms/Valoracion';

/* MOLÉCULA: TarjetaProducto
   Una tarjeta del catálogo, armada con los átomos de arriba.

   En el HTML original este bloque estaba escrito doce veces, una por
   producto, cambiando solo los textos. Acá se escribe una sola vez y
   recibe los datos por props.

   La imagen y el nombre llevan al detalle del producto (/productos/:id).
   Esa navegación es nueva respecto del sitio estático, que no tenía
   página de detalle.

   El botón "Agregar al carro" todavía no hace nada: la lógica del
   carrito con useState entra en la Fase 2. */
function TarjetaProducto({ id, imagen, nombre, descripcion, precio, valoracion, alt }) {
  return (
    <div className="producto">

      <Link to={'/productos/' + id}>
        <ImagenProducto imagen={imagen} alt={alt} />
      </Link>

      <h3>
        <Link to={'/productos/' + id}>{nombre}</Link>
      </h3>

      <p>{descripcion}</p>

      <Precio valor={precio} />

      <Valoracion estrellas={valoracion} />

      <button className="btn-carrito">
        Agregar al carro
      </button>

    </div>
  );
}

export default TarjetaProducto;
