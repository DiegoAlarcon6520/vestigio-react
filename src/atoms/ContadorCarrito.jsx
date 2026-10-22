/* ÁTOMO: ContadorCarrito
   El 🛒 con el número al lado, que en el sitio original estaba dentro
   del menú de articulos.html.

   Antes el número lo escribía JavaScript a mano con
   document.getElementById("carrito-contador").textContent = total.
   Ahora llega por props: React se encarga de redibujarlo cuando el
   total cambia. */
function ContadorCarrito({ total }) {
  return (
    <span className="carrito">
      🛒 <span id="carrito-contador" className="carrito-contador">{total}</span>
    </span>
  );
}

export default ContadorCarrito;
