import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';

import { useCarrito } from './useCarrito';
import { productoMock } from '../test/ayudas';

/* PU-007 a PU-010
   El carrito es la pieza con más lógica del proyecto, así que se prueba
   sola, sin interfaz.

   renderHook monta el hook en un componente de mentira y devuelve su
   resultado en result.current.

   act() envuelve todo lo que cambia el estado. Sin act, React avisa que
   la actualización ocurrió fuera de su control y el resultado leído
   podría ser el anterior. */
describe('useCarrito', () => {

  it('PU-007: parte vacío', () => {
    // Arrange + Act
    const { result } = renderHook(() => useCarrito());

    // Assert
    expect(result.current.items).toHaveLength(0);
    expect(result.current.totalUnidades).toBe(0);
    expect(result.current.totalPrecio).toBe(0);
  });

  it('PU-008: agregar dos veces el mismo producto sube la cantidad, no duplica la línea', () => {
    // Arrange
    const { result } = renderHook(() => useCarrito());

    // Act
    act(() => result.current.agregar(productoMock));
    act(() => result.current.agregar(productoMock));

    // Assert: una sola línea, con cantidad 2
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].cantidad).toBe(2);
    expect(result.current.totalUnidades).toBe(2);
  });

  it('PU-009: el total se calcula multiplicando precio por cantidad', () => {
    // Arrange: el producto de prueba vale 10.000
    const { result } = renderHook(() => useCarrito());

    // Act
    act(() => result.current.agregar(productoMock));
    act(() => result.current.cambiarCantidad(productoMock.id, 3));

    // Assert
    expect(result.current.totalPrecio).toBe(30000);
  });

  it('PU-010: bajar la cantidad a cero saca el producto del carro', () => {
    // Arrange
    const { result } = renderHook(() => useCarrito());
    act(() => result.current.agregar(productoMock));

    // Act
    act(() => result.current.cambiarCantidad(productoMock.id, 0));

    // Assert
    expect(result.current.items).toHaveLength(0);
  });

});
