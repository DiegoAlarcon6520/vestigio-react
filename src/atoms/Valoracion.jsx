/* ÁTOMO: Valoracion
   Las estrellas de reseña. Llegan ya armadas como texto desde los datos
   (por ejemplo "★★★★☆"), igual que en el HTML original. */
function Valoracion({ estrellas }) {
  return <div className="valoracion">{estrellas}</div>;
}

export default Valoracion;
