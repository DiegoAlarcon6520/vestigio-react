import { describe, it, expect } from 'vitest';

import { normalizar } from './texto';

/* PU-003
   normalizar es lo que permite que buscar "camara" encuentre la
   "Cámara Espectro Completo". Sin esta función el filtro del catálogo
   obligaría a escribir las tildes. */
describe('normalizar', () => {

  it('PU-003: quita las tildes y pasa a minúsculas', () => {
    // Arrange
    const texto = 'Cámara Espectro Completo';

    // Act
    const resultado = normalizar(texto);

    // Assert
    expect(resultado).toBe('camara espectro completo');
  });

  it('PU-004: un texto sin tildes queda igual, solo en minúsculas', () => {
    // Arrange
    const texto = 'Spirit Box';

    // Act
    const resultado = normalizar(texto);

    // Assert
    expect(resultado).toBe('spirit box');
  });

});
