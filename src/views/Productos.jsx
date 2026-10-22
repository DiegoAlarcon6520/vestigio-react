import Encabezado from '../organisms/Encabezado';
import GaleriaProductos from '../organisms/GaleriaProductos';

import { productos } from '../data/productos';

/* PÁGINA: Productos
   Equivale a articulos.html: la franja de título y debajo la cuadrícula
   con los doce productos.

   La diferencia con el original es de dónde salen los productos. Antes
   eran doce bloques de HTML escritos a mano; ahora se leen del archivo
   data/productos.js y GaleriaProductos los recorre.

   La clase "encabezado-catalogo" existe porque en articulos-rojo.css el
   interlineado de los párrafos era 1.6 y en las otras dos páginas 1.7.
   Sin ese ajuste la página quedaba unos píxeles más alta que el original. */
function Productos() {
  return (
    <>
      <Encabezado
        titulo="NUESTROS ARTÍCULOS"
        subtitulo="Instrumentos para tu propia investigación"
        className="encabezado-catalogo"
      />

      <GaleriaProductos productos={productos} />
    </>
  );
}

export default Productos;
