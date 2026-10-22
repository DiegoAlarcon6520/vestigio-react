import { useEffect, useState } from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import CampoFormulario from '../molecules/CampoFormulario';

/* ORGANISMO: FormularioProducto
   El formulario del Panel de Control. Sirve para las dos operaciones:
   crear un producto nuevo y editar uno existente.

   Es el mismo formulario porque los campos son idénticos; lo único
   que cambia es si llega o no un producto para editar.

   No se pide una imagen: la evaluación indica usar una imagen genérica
   por defecto para omitir la carga de archivos. useCatalogo se encarga
   de asignarla. */

const valoraciones = [
  { valor: '★☆☆☆☆', texto: '1 estrella' },
  { valor: '★★☆☆☆', texto: '2 estrellas' },
  { valor: '★★★☆☆', texto: '3 estrellas' },
  { valor: '★★★★☆', texto: '4 estrellas' },
  { valor: '★★★★★', texto: '5 estrellas' }
];

const vacio = { nombre: '', descripcion: '', valor: '', valoracion: '' };


function FormularioProducto({ tema, enEdicion, alGuardar, alCancelar }) {

  const [datos, setDatos] = useState(vacio);
  const [error, setError] = useState('');

  /* Cuando el administrador hace clic en "Editar" de la tabla, el
     producto llega por props. Este efecto copia sus valores a los
     campos del formulario.

     Se necesita un useEffect porque el formulario ya está dibujado y
     hay que reaccionar a un cambio que viene de afuera. El arreglo
     [enEdicion] hace que se ejecute solo cuando cambia ese producto. */
  useEffect(() => {
    if (enEdicion) {
      setDatos({
        nombre: enEdicion.nombre,
        descripcion: enEdicion.descripcion,
        valor: String(enEdicion.valor),
        valoracion: enEdicion.valoracion
      });
    } else {
      setDatos(vacio);
    }
    setError('');
  }, [enEdicion]);

  const manejarCambio = (evento) => {
    const { id, value } = evento.target;
    setDatos({ ...datos, [id]: value });
    setError('');
  };

  const manejarEnvio = (evento) => {
    evento.preventDefault();
    const campos = evento.target.elements;

    /* --- NOMBRE --- */
    if (datos.nombre.trim().length < 3) {
      setError('El nombre del equipo debe tener al menos 3 caracteres.');
      campos.nombre.focus();
      return;
    }

    /* --- DESCRIPCIÓN --- */
    if (datos.descripcion.trim().length < 10) {
      setError('Escribe una descripción de al menos 10 caracteres.');
      campos.descripcion.focus();
      return;
    }

    /* --- PRECIO --- */
    /* Number.isNaN detecta cuando parseInt no pudo convertir el texto. */
    const precio = parseInt(datos.valor);

    if (Number.isNaN(precio) || precio < 1000 || precio > 9999999) {
      setError('El precio debe ser un número entre 1.000 y 9.999.999.');
      campos.valor.focus();
      return;
    }

    /* --- VALORACIÓN --- */
    if (datos.valoracion === '') {
      setError('Selecciona una valoración inicial.');
      campos.valoracion.focus();
      return;
    }

    alGuardar(datos);
    setDatos(vacio);
  };

  return (
    <Form
      id="formulario-producto"
      data-bs-theme={tema === 'claro' ? 'light' : 'dark'}
      onSubmit={manejarEnvio}
    >
      <fieldset>

        <legend>{enEdicion ? 'Editar equipo' : 'Nuevo equipo'}</legend>

        <CampoFormulario id="nombre" etiqueta="Nombre del equipo"
          marcador="Ej: Medidor de iones" valor={datos.nombre} alCambiar={manejarCambio} />

        <CampoFormulario id="descripcion" etiqueta="Descripción"
          marcador="Para qué sirve este equipo" valor={datos.descripcion} alCambiar={manejarCambio} />

        <CampoFormulario id="valor" etiqueta="Precio (solo números)" tipo="number"
          marcador="24990" min="1000" max="9999999" valor={datos.valor} alCambiar={manejarCambio} />

        <CampoFormulario id="valoracion" etiqueta="Valoración inicial"
          valor={datos.valoracion} alCambiar={manejarCambio}
          opciones={valoraciones} textoVacio="-- SELECCIONE VALORACIÓN --" />

        <p className="nota-formulario">
          El equipo se publicará con una imagen genérica.
        </p>

        {error && <p className="mensaje-error" role="alert">{error}</p>}

        <div className="botones">
          <Button type="submit" variant="danger" className="btn-comprar">
            {enEdicion ? 'Guardar cambios' : 'Agregar al catálogo'}
          </Button>

          {/* El botón de cancelar solo tiene sentido mientras se edita. */}
          {enEdicion && (
            <Button type="button" variant="secondary" className="btn-limpiar" onClick={alCancelar}>
              Cancelar
            </Button>
          )}
        </div>

      </fieldset>
    </Form>
  );
}

export default FormularioProducto;
