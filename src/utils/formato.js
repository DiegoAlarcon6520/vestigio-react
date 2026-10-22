/* ==========================================================
   VESTIGIO — Utilidades de formato
   ==========================================================
   Funciones sueltas que no dibujan nada: solo transforman datos.
   Viven fuera de atoms/molecules/organisms porque no son componentes.
   ========================================================== */

/* Convierte un número a la forma en que se muestran los precios en el
   sitio: 34990 → "$34.990"

   toLocaleString('es-CL') se encarga de poner el punto como separador
   de miles, que es la convención chilena. */
export function formatearPrecio(numero) {
  return '$' + numero.toLocaleString('es-CL');
}
