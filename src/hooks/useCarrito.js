import { useState } from 'react';

/* ==========================================================
   HOOK: useCarrito
   ==========================================================
   Un "hook personalizado" es una función que agrupa estado y lógica
   para poder reutilizarla. Por convención su nombre empieza con "use".

   Acá vive todo el carrito: qué productos tiene, cuántos de cada uno y
   las funciones para modificarlo. App.jsx lo llama una sola vez y
   reparte el resultado hacia abajo por props.

   Se hace así, y no con un useState dentro de cada tarjeta, porque el
   carrito es UNO SOLO para toda la aplicación: el número del menú y la
   página de compra tienen que ver exactamente lo mismo.

   En el sitio original esto era una variable suelta llamada
   totalCarrito dentro de articulos.html, y se perdía al cambiar de
   página. Acá sobrevive mientras la aplicación esté abierta.
   ========================================================== */

export function useCarrito() {

  /* items es un arreglo de objetos { producto, cantidad }.
     Empieza vacío. */
  const [items, setItems] = useState([]);

  /* Agrega un producto. Si ya estaba en el carro, le sube la cantidad
     en vez de repetirlo como una segunda línea. */
  const agregar = (producto) => {
    setItems((actuales) => {

      const yaEsta = actuales.find((item) => item.producto.id === producto.id);

      if (yaEsta) {
        /* map() devuelve un arreglo NUEVO con la línea modificada.
           En React nunca se modifica el estado directamente: siempre se
           reemplaza por una copia, si no el componente no se entera del
           cambio y no vuelve a dibujarse. */
        return actuales.map((item) =>
          item.producto.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      /* Si es nuevo, se agrega al final con cantidad 1.
         Los tres puntos copian el arreglo anterior. */
      return [...actuales, { producto, cantidad: 1 }];
    });
  };

  /* Saca una línea completa del carro, sin importar su cantidad. */
  const quitar = (id) => {
    setItems((actuales) => actuales.filter((item) => item.producto.id !== id));
  };

  /* Cambia la cantidad de una línea. Si baja de 1, se saca la línea. */
  const cambiarCantidad = (id, cantidad) => {
    if (cantidad < 1) {
      quitar(id);
      return;
    }
    setItems((actuales) =>
      actuales.map((item) =>
        item.producto.id === id ? { ...item, cantidad } : item
      )
    );
  };

  const vaciar = () => setItems([]);

  /* Estos dos no son estado: se calculan cada vez a partir de items.
     Guardarlos en su propio useState sería un error clásico, porque
     habría que acordarse de actualizarlos en cada cambio.

     reduce() recorre el arreglo acumulando un total. */
  const totalUnidades = items.reduce((suma, item) => suma + item.cantidad, 0);

  const totalPrecio = items.reduce(
    (suma, item) => suma + item.producto.valor * item.cantidad,
    0
  );

  return {
    items,
    agregar,
    quitar,
    cambiarCantidad,
    vaciar,
    totalUnidades,
    totalPrecio
  };
}
