/* ==========================================================
   VESTIGIO — Utilidades de texto
   ========================================================== */

/* Deja un texto en minúsculas y SIN TILDES, para poder comparar.

   Hace falta porque nadie escribe "cámara" con tilde en un buscador,
   pero el catálogo sí la tiene. Sin esto, buscar "camara" no
   encontraría la Cámara de Espectro Completo.

   Cómo funciona:
     normalize('NFD')  separa cada letra acentuada en dos piezas:
                       la letra base y el acento ("á" → "a" + "´")
     replace(...)      borra todos esos acentos sueltos. El rango
                       ̀-ͯ es el bloque Unicode que los
                       agrupa.
     toLowerCase()     iguala mayúsculas y minúsculas */
export function normalizar(texto) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}
