import { Link } from 'react-router-dom';

import Encabezado from '../organisms/Encabezado';
import ResumenCarrito from '../organisms/ResumenCarrito';
import FormularioCompra from '../organisms/FormularioCompra';
import Seccion from '../molecules/Seccion';

/* PÁGINA: Carrito
   Equivale a compra.html, pero ahora muestra lo que el usuario fue
   agregando mientras recorría el catálogo.

   Esta página decide QUIÉN puede comprar, y según eso muestra una de
   tres cosas:

     ADMINISTRADOR  un aviso. La cuenta de administración gestiona el
                    catálogo, no compra. Ni siquiera se monta el
                    formulario.
     CLIENTE        el resumen del carro y un formulario corto: sus
                    datos ya están guardados en la cuenta.
     INVITADO       el resumen del carro y el formulario completo.

   Poner la decisión acá y no dentro del formulario mantiene a
   FormularioCompra ocupado de una sola cosa: pedir y validar datos. */
function Carrito({ carrito, auth, tema }) {

  /* ----- CASO 1: ADMINISTRADOR ----- */
  if (auth.esAdmin) {
    return (
      <>
        <Encabezado
          titulo="COMPRAS NO DISPONIBLES"
          subtitulo="La cuenta de administración no realiza pedidos"
        />

        <Seccion titulo="Cuenta de administración">
          <p>
            Estás con la sesión de administrador. Esta cuenta existe para
            mantener el catálogo, no para comprar, así que no tiene carro
            ni formulario de pedido.
          </p>
          <p>
            Si quieres hacer una compra, cierra sesión y hazlo como
            invitado, o entra con una cuenta de cliente.
          </p>
          <p><Link to="/panel">Ir al Panel de Control →</Link></p>
        </Seccion>
      </>
    );
  }

  /* ----- CASOS 2 y 3: CLIENTE O INVITADO ----- */
  return (
    <>
      <Encabezado
        titulo="REALIZAR COMPRA"
        subtitulo={
          auth.autenticado
            ? 'Revisa tu pedido y confirma'
            : 'Completa tus datos para procesar tu pedido'
        }
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

      {/* Sin equipos en el carro no hay nada que comprar, así que el
          formulario no se muestra. Antes el formulario preguntaba qué
          producto se quería; ahora eso lo define el carro. */}
      {carrito.estaVacio ? (
        <Seccion titulo="Nada que comprar todavía">
          <p>
            Agrega al menos un equipo desde el catálogo y el formulario de
            compra aparecerá acá.
          </p>
          <p><Link to="/productos">Ver el catálogo →</Link></p>
        </Seccion>
      ) : (
        <FormularioCompra
          tema={tema}
          usuario={auth.autenticado ? auth.usuario : null}
          resumenCarrito={carrito}
          alConfirmar={carrito.vaciar}
        />
      )}

      {/* Invitación a registrarse, solo para quien compra sin cuenta. */}
      {!auth.autenticado && !carrito.estaVacio && (
        <Seccion titulo="¿Compras seguido?">
          <p>
            Si <Link to="/registro">creas una cuenta</Link>, tus datos
            quedan guardados y la próxima compra son dos clics.
          </p>
        </Seccion>
      )}
    </>
  );
}

export default Carrito;
