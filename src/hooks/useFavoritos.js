import { useState } from 'react';

/* ==========================================================
   HOOK: useFavoritos
   ==========================================================
   Guarda qué productos marcó el usuario como favoritos.

   Solo se guardan los id, no el producto completo: con el id basta para
   saber si una tarjeta está marcada, y el arreglo queda liviano.

   Igual que el carrito, vive en App.jsx y no dentro de cada tarjeta,
   para que la marca se mantenga al navegar entre el catálogo y el
   detalle del producto.
   ========================================================== */

export function useFavoritos() {

  const [ids, setIds] = useState([]);

  /* Pregunta si un producto está marcado.
     includes() devuelve true o false. */
  const esFavorito = (id) => ids.includes(id);

  /* Marca o desmarca según cómo esté ahora. */
  const alternar = (id) => {
    setIds((actuales) =>
      actuales.includes(id)
        ? actuales.filter((favorito) => favorito !== id)  // quitar
        : [...actuales, id]                               // agregar
    );
  };

  return { ids, esFavorito, alternar, total: ids.length };
}
