import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useCarrito } from './hooks/useCarrito';
import { useCatalogo } from './hooks/useCatalogo';
import { useAuth } from './hooks/useAuth';
import { productoMock } from './test/ayudas';

/* ==========================================================
   LIMITACIONES CONOCIDAS — ESTAS PRUEBAS FALLAN A PROPÓSITO
   ==========================================================
   Las tres pruebas de este archivo están escritas contra el
   comportamiento IDEAL del sistema, no contra el actual. Fallan, y eso
   es exactamente lo que deben hacer.

   No son errores: son limitaciones declaradas de un proyecto de
   front-end sin servidor. Cada una deja por escrito algo que el
   sistema todavía no hace, por qué no lo hace y qué haría falta para
   resolverlo. Cuando esa funcionalidad se implemente, la prueba pasa
   a verde sola y deja de ser una limitación.

   Es la diferencia con una prueba de rechazo: PU-019 comprueba que el
   formulario RECHAZA un RUT con puntos, y por eso pasa. Estas, en
   cambio, piden algo que el sistema no entrega, y por eso fallan.

   El segundo argumento de expect() es el mensaje que aparece en el
   reporte cuando la prueba falla. Se usa para que el motivo quede
   visible sin tener que abrir el archivo.
   ========================================================== */

describe('LIMITACIONES CONOCIDAS (fallan a propósito)', () => {

  beforeEach(() => {
    localStorage.clear();
  });


  it('PU-039 (INTENCIONAL): el carro debería sobrevivir a la recarga de la página', () => {

    /* 1 - PREPARACIÓN (Arrange)
       Se monta el carro y se agrega un equipo. */
    const primeraVisita = renderHook(() => useCarrito());
    act(() => primeraVisita.result.current.agregar(productoMock));

    expect(primeraVisita.result.current.totalUnidades).toBe(1);

    /* 2 - EJECUCIÓN (Act)
       Montar un hook nuevo equivale a recargar la página: el estado
       anterior se pierde porque vivía en memoria. */
    const despuesDeRecargar = renderHook(() => useCarrito());

    /* 3 - EVALUAR RESULTADO (Assert)
       FALLA A PROPÓSITO. useCarrito guarda los equipos con useState, no
       en localStorage, así que al recargar el carro vuelve a cero.

       Por qué está así: la evaluación pide un carro en memoria. Para
       que esta prueba pasara habría que guardar los items en
       localStorage, igual que hace useAuth con la sesión. */
    expect(
      despuesDeRecargar.result.current.totalUnidades,
      'El carro se vacía al recargar: useCarrito guarda su estado en memoria y no en localStorage'
    ).toBe(1);
  });


  it('PU-040 (INTENCIONAL): los equipos creados en el Panel deberían persistir', () => {

    /* 1 - PREPARACIÓN (Arrange) */
    const primeraVisita = renderHook(() => useCatalogo());
    const totalInicial = primeraVisita.result.current.productos.length;

    /* 2 - EJECUCIÓN (Act)
       El administrador agrega un equipo y después se recarga. */
    act(() =>
      primeraVisita.result.current.crear({
        nombre: 'Medidor de Iones',
        descripcion: 'Detecta cambios en la ionizacion del aire.',
        valor: '24990',
        valoracion: '★★★★☆'
      })
    );

    expect(primeraVisita.result.current.productos).toHaveLength(totalInicial + 1);

    const despuesDeRecargar = renderHook(() => useCatalogo());

    /* 3 - EVALUAR RESULTADO (Assert)
       FALLA A PROPÓSITO. El catálogo parte siempre desde
       data/productos.js, así que los equipos creados desaparecen.

       Por qué está así: la evaluación pide un CRUD en memoria, y el
       propio Panel lo advierte en pantalla. Para que esta prueba pasara
       haría falta una base de datos o, como mínimo, guardar el catálogo
       en localStorage. */
    expect(
      despuesDeRecargar.result.current.productos,
      'El catálogo vuelve a su estado original al recargar: useCatalogo no persiste los cambios'
    ).toHaveLength(totalInicial + 1);
  });


  it('PU-041 (INTENCIONAL): las contraseñas no deberían guardarse legibles', () => {

    /* 1 - PREPARACIÓN (Arrange) */
    const { result } = renderHook(() => useAuth());

    /* 2 - EJECUCIÓN (Act)
       Se crea una cuenta y se lee lo que quedó realmente guardado. */
    act(() =>
      result.current.registrar({
        nombre: 'Usuario Prueba',
        rut: '11111111-1',
        email: 'prueba@gmail.com',
        fono: '+56911111111',
        fenac: '1999-01-01',
        direccion: 'Calle Falsa 123',
        comuna: 'Ñuñoa',
        perfil: 'Investigador',
        experiencia: 'Intermedio',
        fenomeno: 'Psicofonias',
        equipamiento: 'Basico',
        password: 'claveSecreta123'
      })
    );

    const guardado = localStorage.getItem('vestigio-usuarios');

    /* 3 - EVALUAR RESULTADO (Assert)
       FALLA A PROPÓSITO. La contraseña queda en localStorage tal cual
       se escribió, visible desde las herramientas del navegador.

       Por qué está así: el proyecto es solo front-end. Cifrar la
       contraseña en el navegador no aportaría seguridad real, porque el
       código del cifrado viajaría junto al dato. La solución correcta
       es un servidor que guarde un hash, y eso queda fuera del alcance
       de esta entrega. */
    expect(
      guardado.includes('claveSecreta123'),
      'La contraseña se guarda tal cual en localStorage: un proyecto sin servidor no puede protegerla de verdad'
    ).toBe(false);
  });

});
