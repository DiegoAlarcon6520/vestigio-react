import { useEffect, useState } from 'react';

/* ==========================================================
   HOOK: useTema
   ==========================================================
   Alterna entre el tema oscuro (el original de Vestigio) y un tema
   claro.

   El tema oscuro es el que ya tenía el sitio, así que es el valor por
   defecto y no necesita ninguna regla extra de CSS. El claro se logra
   agregando la clase "tema-claro" al <body>, que en App.css reescribe
   los colores.

   Se usa el <body> y no un div porque el color de fondo general está
   definido sobre body en el CSS original.
   ========================================================== */

export function useTema() {

  const [tema, setTema] = useState('oscuro');

  /* useEffect sincroniza el estado de React con algo de afuera; acá,
     con la clase del <body>. Se vuelve a ejecutar cada vez que cambia
     "tema", gracias al arreglo [tema] del final.

     classList.toggle con un segundo argumento agrega la clase si es
     true y la quita si es false. */
  useEffect(() => {
    document.body.classList.toggle('tema-claro', tema === 'claro');
  }, [tema]);

  const alternar = () => setTema((actual) => (actual === 'oscuro' ? 'claro' : 'oscuro'));

  return { tema, alternar };
}
