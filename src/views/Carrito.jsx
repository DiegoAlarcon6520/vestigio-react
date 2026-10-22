import Encabezado from '../organisms/Encabezado';
import ResumenCarrito from '../organisms/ResumenCarrito';
import FormularioCompra from '../organisms/FormularioCompra';

/* PÁGINA: Carrito
   Equivale a compra.html, pero ahora además muestra lo que el usuario
   fue agregando mientras recorría el catálogo.

   Tiene dos partes:
     1. El resumen del carro, que sale del estado de App.jsx
     2. El formulario de compra con todas sus validaciones

   El formulario conserva su propio selector de producto y su cantidad,
   tal como en el sitio original, porque esas dos validaciones formaban
   parte de lo pedido en la primera entrega. El carro es información
   adicional que se suma al resumen final. */
function Carrito({ carrito, catalogo, tema }) {
  return (
    <>
      <Encabezado
        titulo="REALIZAR COMPRA"
        subtitulo="Completa tus datos para procesar tu pedido"
      />

      <div className="bloque-carrito">
        <h2>Tu carro</h2>

        <ResumenCarrito
          items={carrito.items}
          totalUnidades={carrito.totalUnidades}
          totalPrecio={carrito.totalPrecio}
          alCambiarCantidad={carrito.cambiarCantidad}
          alQuitar={carrito.quitar}
          alVaciar={carrito.vaciar}
        />
      </div>

      <FormularioCompra
        tema={tema}
        catalogo={catalogo.productos}
        resumenCarrito={{
          totalUnidades: carrito.totalUnidades,
          totalPrecio: carrito.totalPrecio
        }}
        alConfirmar={carrito.vaciar}
      />
    </>
  );
}

export default Carrito;
