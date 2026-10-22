import TituloPrincipal from '../atoms/TituloPrincipal';
import Subtitulo from '../atoms/Subtitulo';

/* ORGANISMO: Encabezado
   La franja de título de las páginas interiores (el
   <section id="encabezado"> de articulos.html y compra.html).

   Es igual al Hero pero sin imagen y con menos altura, tal como estaba
   en el CSS original.

   className es opcional: el catálogo lo usa para ajustar un detalle de
   interlineado que en el CSS original venía de articulos-rojo.css. */
function Encabezado({ titulo, subtitulo, className }) {
  return (
    <section id="encabezado" className={className}>

      <TituloPrincipal texto={titulo} />
      <Subtitulo texto={subtitulo} />

    </section>
  );
}

export default Encabezado;
