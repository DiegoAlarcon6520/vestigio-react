import { useState } from 'react';

import Encabezado from '../organisms/Encabezado';
import FormularioProducto from '../organisms/FormularioProducto';
import TablaProductos from '../organisms/TablaProductos';

/* PÁGINA: Panel de Control
   Solo accesible para el administrador, gracias a RutaPrivada.

   Es el CRUD completo del catálogo:
     Create  el formulario de arriba
     Read    la tabla de abajo
     Update  el botón "Editar" carga el producto en el formulario
     Delete  el botón "Eliminar"

   Los cambios viven en memoria: al recargar la página el catálogo
   vuelve al original. Es lo que pide la evaluación. */
function Panel({ auth, catalogo, tema }) {

  /* Guarda qué producto se está editando. Si vale null, el formulario
     está en modo "crear". Es estado local porque solo le interesa a
     esta página. */
  const [enEdicion, setEnEdicion] = useState(null);

  const manejarGuardar = (datos) => {
    if (enEdicion) {
      catalogo.actualizar(enEdicion.id, datos);
      setEnEdicion(null);
    } else {
      catalogo.crear(datos);
    }
  };

  return (
    <>
      <Encabezado
        titulo="PANEL DE CONTROL"
        subtitulo={'Sesión de ' + auth.usuario.nombre}
      />

      <div className="bloque-panel">
        <p className="aviso-panel">
          Los cambios que hagas acá viven mientras la aplicación esté
          abierta. Al recargar la página, el catálogo vuelve a su estado
          original.
        </p>
      </div>

      <FormularioProducto
        tema={tema}
        enEdicion={enEdicion}
        alGuardar={manejarGuardar}
        alCancelar={() => setEnEdicion(null)}
      />

      <div className="bloque-panel">
        <h2>Catálogo actual ({catalogo.productos.length} equipos)</h2>

        <TablaProductos
          productos={catalogo.productos}
          alEditar={setEnEdicion}
          alEliminar={catalogo.eliminar}
        />
      </div>
    </>
  );
}

export default Panel;
