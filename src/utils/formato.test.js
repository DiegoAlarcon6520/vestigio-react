import { describe, it, expect } from 'vitest';

import { formatearPrecio } from './formato';

/* PU-001 y PU-002
   formatearPrecio es la función que convierte el número guardado en el
   catálogo al texto que se muestra en pantalla. La usan el carrito y
   el Panel de Control, así que si se rompe, los precios se ven mal en
   todo el sitio. */
describe('formatearPrecio', () => {

  it('PU-001: agrega el signo peso y el separador de miles', () => {
    // Arrange: un precio cualquiera del catálogo
    const valor = 34990;

    // Act
    const resultado = formatearPrecio(valor);

    // Assert
    expect(resultado).toBe('$34.990');
  });

  it('PU-002: funciona también con montos de seis cifras', () => {
    // Arrange
    const valor = 129990;

    // Act
    const resultado = formatearPrecio(valor);

    // Assert
    expect(resultado).toBe('$129.990');
  });

});
