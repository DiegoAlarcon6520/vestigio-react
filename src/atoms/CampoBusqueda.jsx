/* ÁTOMO: CampoBusqueda
   La caja de texto donde se escribe para filtrar el catálogo.

   Es un campo "controlado": su valor viene de props y cada tecla
   dispara alCambiar. Así el texto que se ve y el estado de React nunca
   se desincronizan. */
function CampoBusqueda({ valor, alCambiar }) {
  return (
    <input
      type="search"
      id="busqueda"
      className="campo-busqueda"
      placeholder="Buscar equipo..."
      value={valor}
      onChange={(evento) => alCambiar(evento.target.value)}
    />
  );
}

export default CampoBusqueda;
