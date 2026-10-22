import { Link, useParams } from 'react-router-dom';

import Encabezado from '../organisms/Encabezado';
import Seccion from '../molecules/Seccion';
import Precio from '../atoms/Precio';
import Valoracion from '../atoms/Valoracion';
import BotonFavorito from '../atoms/BotonFavorito';

/* PÁGINA: Producto
   Vista de detalle. Es nueva: el sitio estático no la tenía, porque sin
   JavaScript habría significado escribir doce archivos HTML casi
   idénticos.

   Mantiene el mismo lenguaje visual del resto del sitio (la franja
   #encabezado y un bloque .seccion) para que no parezca de otra página. */
function Producto({ carrito, favoritos, catalogo }) {

  /* useParams lee los trozos variables de la URL. La ruta está definida
     como "/productos/:id", así que al visitar /productos/spirit-box
     esta línea deja id = "spirit-box". */
  const { id } = useParams();

  /* buscarPorId lo entrega useCatalogo y hace el find() sobre la lista
     viva, para que los equipos creados en el Panel también tengan ficha. */
  const producto = catalogo.buscarPorId(id);

  /* Alguien podría escribir una URL inventada a mano. Sin esta
     comprobación, producto.nombre más abajo reventaría. */
  if (!producto) {
    return (
      <>
        <Encabezado
          titulo="PRODUCTO NO ENCONTRADO"
          subtitulo="No tenemos ningún artículo con ese identificador"
        />

        <Seccion titulo="¿Y ahora?">
          <p>Puede que el enlace esté mal escrito o que el artículo ya no exista.</p>
          <p><Link to="/productos">← Volver al catálogo</Link></p>
        </Seccion>
      </>
    );
  }

  return (
    <>
      <Encabezado
        titulo={producto.nombre.toUpperCase()}
        subtitulo="Ficha técnica y disponibilidad"
      />

      <Seccion titulo="Sobre este equipo">

        <img
          className="imagen-central"
          src={producto.imagen}
          alt={producto.alt}
        />

        <p>{producto.descripcion}</p>

        <Precio valor={producto.precio} />
        <Valoracion estrellas={producto.valoracion} />

        <button
          className="btn-carrito"
          onClick={() => carrito.agregar(producto)}
        >
          Agregar al carro
        </button>

        <BotonFavorito
          activo={favoritos.esFavorito(producto.id)}
          alAlternar={() => favoritos.alternar(producto.id)}
        />

        <p><Link to="/productos">← Volver al catálogo</Link></p>

      </Seccion>
    </>
  );
}

export default Producto;
