/* ORGANISMO: TablaProductos
   La lista de equipos del Panel de Control, con los botones para
   editar y eliminar cada uno.

   Es la parte "Read", "Update" y "Delete" del CRUD; la "Create" la
   aporta FormularioProducto.

   Se dibuja como una lista de filas y no como una <table> para que
   pueda reacomodarse en pantallas angostas. */
function TablaProductos({ productos, alEditar, alEliminar }) {
  return (
    <div className="tabla-productos">

      <div className="fila-productos encabezado-tabla">
        <span>Equipo</span>
        <span>Precio</span>
        <span>Valoración</span>
        <span>Acciones</span>
      </div>

      {productos.map((producto) => (
        <div className="fila-productos" key={producto.id}>

          <span className="celda-nombre">
            <img src={producto.imagen} alt={producto.alt} />
            {producto.nombre}
          </span>

          <span>{producto.precio}</span>

          <span className="celda-valoracion">{producto.valoracion}</span>

          <span className="celda-acciones">
            <button onClick={() => alEditar(producto)}>Editar</button>

            {/* confirm() detiene todo hasta que el usuario responde.
                Es lo mismo que usaba el sitio original con sus alert. */}
            <button
              className="accion-peligro"
              onClick={() => {
                if (confirm('¿Eliminar "' + producto.nombre + '" del catálogo?')) {
                  alEliminar(producto.id);
                }
              }}
            >
              Eliminar
            </button>
          </span>

        </div>
      ))}

    </div>
  );
}

export default TablaProductos;
