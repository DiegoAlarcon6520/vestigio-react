import CampoBusqueda from '../atoms/CampoBusqueda';

/* MOLÉCULA: FiltroCatalogo
   La barra que hay sobre el catálogo: el buscador, el orden y el
   contador de resultados.

   No filtra nada por su cuenta. Solo muestra los controles y avisa los
   cambios hacia arriba; el filtrado ocurre en la página Productos.
   Separarlo así permite probar el filtro sin montar la interfaz. */
function FiltroCatalogo({ busqueda, alBuscar, orden, alOrdenar, cantidad, total }) {
  return (
    <div className="filtros">

      <CampoBusqueda valor={busqueda} alCambiar={alBuscar} />

      <select
        id="orden"
        className="campo-orden"
        value={orden}
        onChange={(evento) => alOrdenar(evento.target.value)}
      >
        <option value="relevancia">Orden del catálogo</option>
        <option value="precio-asc">Precio: de menor a mayor</option>
        <option value="precio-desc">Precio: de mayor a menor</option>
        <option value="nombre">Nombre A-Z</option>
      </select>

      <p className="contador-resultados">
        Mostrando {cantidad} de {total} equipos
      </p>

    </div>
  );
}

export default FiltroCatalogo;
