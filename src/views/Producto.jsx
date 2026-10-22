import { Link, useParams } from 'react-router-dom';

import Encabezado from '../organisms/Encabezado';
import Seccion from '../molecules/Seccion';
import Precio from '../atoms/Precio';
import Valoracion from '../atoms/Valoracion';

import { productos } from '../data/productos';

/* PÁGINA: Producto
   Vista de detalle de un producto. Es nueva: el sitio estático no la
   tenía, porque sin JavaScript habría significado escribir doce
   archivos HTML casi idénticos.

   Se mantiene el mismo lenguaje visual del resto del sitio (la franja
   #encabezado y un bloque .seccion) para que no parezca de otra página. */
function Producto() {

  /* useParams lee los trozos variables de la URL. La ruta está definida
     como "/productos/:id", así que al visitar /productos/spirit-box
     esta línea deja id = "spirit-box". */
  const { id } = useParams();

  /* find() recorre el catálogo y devuelve el primer producto cuyo id
     coincida. Si no hay ninguno, devuelve undefined. */
  const producto = productos.find((p) => p.id === id);

  /* Alguien podría escribir una URL inventada a mano. Sin esta
     comprobación, la línea producto.nombre de más abajo reventaría.
     Mostramos un aviso dentro del diseño del sitio. */
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

        {/* El botón queda listo pero todavía sin acción: el carrito se
            implementa con useState en la Fase 2. */}
        <button className="btn-carrito">
          Agregar al carro
        </button>

        <p><Link to="/productos">← Volver al catálogo</Link></p>

      </Seccion>
    </>
  );
}

export default Producto;
