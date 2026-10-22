import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { calcularEdad } from './FormularioCompra';

/* PU-005 y PU-006
   calcularEdad decide si alguien puede comprar en Vestigio. Es la
   validación que no se puede hacer con una expresión regular, porque
   depende de la fecha de hoy.

   Justamente por eso hay que FIJAR la fecha: si la prueba usara el día
   real, el resultado cambiaría con el tiempo y algún día fallaría sola.
   vi.setSystemTime congela el reloj en una fecha conocida. */
describe('calcularEdad', () => {

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-21'));
  });

  afterEach(() => {
    // Devuelve el reloj real, para no afectar a las demás pruebas
    vi.useRealTimers();
  });

  it('PU-005: calcula 26 años para alguien nacido el 20-05-2000', () => {
    // Arrange: el cumpleaños de este año ya pasó
    const nacimiento = '2000-05-20';

    // Act
    const edad = calcularEdad(nacimiento);

    // Assert
    expect(edad).toBe(26);
  });

  it('PU-006: resta un año si el cumpleaños todavía no llega', () => {
    // Arrange: nació en diciembre, y hoy es octubre
    const nacimiento = '2000-12-31';

    // Act
    const edad = calcularEdad(nacimiento);

    // Assert: tiene 25, no 26
    expect(edad).toBe(25);
  });

});
