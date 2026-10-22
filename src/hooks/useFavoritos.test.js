import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useFavoritos } from './useFavoritos';

/* PU-011
   Los favoritos tienen que poder marcarse y desmarcarse con el mismo
   botón. La prueba comprueba el ciclo completo. */
describe('useFavoritos', () => {

  it('PU-011: alternar marca y desmarca el mismo producto', () => {
    // Arrange
    const { result } = renderHook(() => useFavoritos());
    expect(result.current.esFavorito('spirit-box')).toBe(false);

    // Act: primera vez, se marca
    act(() => result.current.alternar('spirit-box'));

    // Assert
    expect(result.current.esFavorito('spirit-box')).toBe(true);
    expect(result.current.total).toBe(1);

    // Act: segunda vez, se desmarca
    act(() => result.current.alternar('spirit-box'));

    // Assert
    expect(result.current.esFavorito('spirit-box')).toBe(false);
    expect(result.current.total).toBe(0);
  });

});
