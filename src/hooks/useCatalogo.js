import { useState } from 'react';

import { productos as catalogoInicial } from '../data/productos';
import generico from '../assets/img/productos/generico.svg';
import { formatearPrecio } from '../utils/formato';

/* ==========================================================
   HOOK: useCatalogo
   ==========================================================
   Hasta la Fase 2 el catálogo era una lista fija importada desde
   data/productos.js. Ahora el Panel de Control tiene que poder
   agregar, editar y borrar productos, así que esa lista pasa a ser
   ESTADO.

   El archivo data/productos.js sigue existiendo: es el punto de
   partida. Lo que cambia es que ya no se lee directo en cada página,
   sino que App.jsx lo carga una vez acá y reparte el resultado.

   Los cambios son "en memoria", como pide la evaluación: viven
   mientras la aplicación esté abierta y se pierden al recargar.
   ========================================================== */

export function useCatalogo() {

  const [productos, setProductos] = useState(catalogoInicial);


  /* ----- CREAR -----
     Recibe lo que escribió el administrador y arma el producto
     completo, rellenando lo que el formulario no pide. */
  const crear = (datos) => {

    /* El id se genera a partir del nombre: se pasa a minúsculas, se
       cambian los espacios por guiones y se quita todo lo que no sea
       letra, número o guion. "Vela de Sebo" → "vela-de-sebo".
       Se le agrega la hora en milisegundos para que dos productos con
       el mismo nombre no choquen. */
    const base = datos.nombre
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const valor = parseInt(datos.valor);

    const nuevo = {
      id: base + '-' + Date.now(),
      imagen: generico,              // imagen por defecto, sin subir archivos
      nombre: datos.nombre.trim(),
      descripcion: datos.descripcion.trim(),
      precio: formatearPrecio(valor), // el texto "$12.990"
      valor: valor,                   // el número 12990
      valoracion: datos.valoracion,
      alt: 'Imagen genérica de ' + datos.nombre.trim()
    };

    setProductos((actuales) => [...actuales, nuevo]);
    return nuevo;
  };


  /* ----- ACTUALIZAR -----
     map() devuelve una lista nueva donde solo cambió el producto que
     coincide con el id. El resto se deja tal cual. */
  const actualizar = (id, datos) => {
    const valor = parseInt(datos.valor);

    setProductos((actuales) =>
      actuales.map((p) =>
        p.id === id
          ? {
              ...p,
              nombre: datos.nombre.trim(),
              descripcion: datos.descripcion.trim(),
              precio: formatearPrecio(valor),
              valor: valor,
              valoracion: datos.valoracion
            }
          : p
      )
    );
  };


  /* ----- ELIMINAR -----
     filter() se queda con todos los que NO coinciden con el id. */
  const eliminar = (id) => {
    setProductos((actuales) => actuales.filter((p) => p.id !== id));
  };


  /* ----- BUSCAR UNO -----
     Lo usa la página de detalle para saber qué producto mostrar. */
  const buscarPorId = (id) => productos.find((p) => p.id === id);


  return { productos, crear, actualizar, eliminar, buscarPorId };
}
