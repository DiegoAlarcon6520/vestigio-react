/* ÁTOMO: BotonTema
   El interruptor de tema claro / oscuro del menú.

   Es el único elemento que se agrega al menú respecto del sitio
   original. Está dimensionado para no alterar la altura de la barra,
   así que el resto de la página sigue quedando en la misma posición.

   aria-label le da un nombre al botón para los lectores de pantalla,
   porque su contenido visible es solo un símbolo. */
function BotonTema({ tema, alAlternar }) {

  const esOscuro = tema === 'oscuro';

  return (
    <button
      className="btn-tema"
      onClick={alAlternar}
      aria-label={esOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      title={esOscuro ? 'Tema claro' : 'Tema oscuro'}
    >
      {esOscuro ? '☀' : '☾'}
    </button>
  );
}

export default BotonTema;
