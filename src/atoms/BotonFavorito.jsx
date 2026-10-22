/* ÁTOMO: BotonFavorito
   Marca o desmarca un producto como favorito.

   No guarda el estado: lo recibe por props y avisa hacia arriba cuando
   se hace clic. Un componente así se llama "controlado", y es más fácil
   de probar porque su resultado depende solo de lo que le entra. */
function BotonFavorito({ activo, alAlternar }) {
  return (
    <button
      className={activo ? 'btn-favorito activo' : 'btn-favorito'}
      onClick={alAlternar}
    >
      {activo ? '★ Guardado en favoritos' : '☆ Agregar a favoritos'}
    </button>
  );
}

export default BotonFavorito;
