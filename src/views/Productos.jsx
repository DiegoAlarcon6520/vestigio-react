import { useState } from 'react';

import Encabezado from '../organisms/Encabezado';
import GaleriaProductos from '../organisms/GaleriaProductos';
import FiltroCatalogo from '../molecules/FiltroCatalogo';

import { normalizar } from '../utils/texto';

/* PÁGINA: Productos
   Equivale a articulos.html: la franja de título y la cuadrícula con
   los doce productos.

   Lo nuevo respecto del sitio estático es el filtro. El texto escrito y
   el criterio de orden son estado local de esta página: no los necesita
   nadie más, así que no tiene sentido subirlos a App.jsx. Esa es la
   regla general para decidir dónde poner un useState: en el componente
   más cercano que lo use.

   La lista filtrada NO se guarda en un estado. Se calcula en cada
   render a partir del catálogo y del texto buscado. Guardarla sería
   duplicar información y arriesgarse a que quede desactualizada. */
function Productos({ carrito, favoritos, catalogo, puedeComprar }) {

  /* El catálogo ya no se importa del archivo de datos: llega por props
     desde App, porque el Panel de Control puede haberlo modificado. */
  const productos = catalogo.productos;

  const [busqueda, setBusqueda] = useState('');
  const [orden, setOrden] = useState('relevancia');

  /* 1) Filtrar por texto. normalizar() baja todo a minúsculas y quita
     las tildes de los dos lados, así escribir "camara" encuentra la
     "Cámara Espectro Completo". includes() devuelve true si el texto
     aparece en cualquier parte del nombre o la descripción. */
  const termino = normalizar(busqueda.trim());

  const filtrados = productos.filter((producto) =>
    normalizar(producto.nombre).includes(termino) ||
    normalizar(producto.descripcion).includes(termino)
  );

  /* 2) Ordenar. Se copia el arreglo con [...] antes de ordenar porque
     sort() modifica el original, y el original es el catálogo que
     comparten todas las páginas. */
  const visibles = [...filtrados];

  if (orden === 'precio-asc') {
    visibles.sort((a, b) => a.valor - b.valor);
  } else if (orden === 'precio-desc') {
    visibles.sort((a, b) => b.valor - a.valor);
  } else if (orden === 'nombre') {
    visibles.sort((a, b) => a.nombre.localeCompare(b.nombre));
  }

  return (
    <>
      <Encabezado
        titulo="NUESTROS ARTÍCULOS"
        subtitulo="Instrumentos para tu propia investigación"
        className="encabezado-catalogo"
      />

      <FiltroCatalogo
        busqueda={busqueda}
        alBuscar={setBusqueda}
        orden={orden}
        alOrdenar={setOrden}
        cantidad={visibles.length}
        total={productos.length}
      />

      <GaleriaProductos
        productos={visibles}
        alAgregar={carrito.agregar}
        puedeComprar={puedeComprar}
        esFavorito={favoritos.esFavorito}
        alAlternarFavorito={favoritos.alternar}
      />
    </>
  );
}

export default Productos;
