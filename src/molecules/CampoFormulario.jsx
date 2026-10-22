import Form from 'react-bootstrap/Form';

/* MOLÉCULA: CampoFormulario
   Una etiqueta más su control, que es el bloque que se repite en todo
   el formulario de compra.

   En el HTML original cada campo era un <div class="campo"> con su
   <label> y su <input>, copiado ocho veces. Acá se escribe una vez.

   Usa componentes de React Bootstrap:
     Form.Group   agrupa etiqueta y control
     Form.Label   la etiqueta
     Form.Control una caja de texto, número o fecha
     Form.Select  una lista desplegable

   controlId es la pieza clave: React Bootstrap le pone ese valor como
   id al control y como htmlFor a la etiqueta. Gracias a eso el label
   queda asociado al campo, que es lo que permite hacer clic en el texto
   para enfocar la caja, y lo que usan las pruebas con getByLabelText.

   Si se le pasan "opciones" dibuja un select; si no, un campo normal.
   Una sola molécula cubre los dos casos y evita duplicar el bloque. */
function CampoFormulario({
  id,
  etiqueta,
  tipo = 'text',
  valor,
  alCambiar,
  marcador,
  opciones,
  textoVacio,
  min,
  max
}) {
  return (
    <Form.Group className="mb-3" controlId={id}>

      <Form.Label>{etiqueta}</Form.Label>

      {opciones ? (
        <Form.Select required value={valor} onChange={alCambiar}>
          {/* La primera opción tiene value vacío: si el formulario llega
              con ese valor, significa que el usuario no eligió nada. */}
          <option value="">{textoVacio}</option>

          {opciones.map((opcion) => (
            <option key={opcion.valor} value={opcion.valor}>
              {opcion.texto}
            </option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control
          type={tipo}
          required
          placeholder={marcador}
          value={valor}
          onChange={alCambiar}
          min={min}
          max={max}
        />
      )}

    </Form.Group>
  );
}

export default CampoFormulario;
