import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

import TarjetaProducto from './TarjetaProducto';
import { renderConRouter, productoMock } from '../test/ayudas';

/* PU-012 y PU-013
   La tarjeta es el componente que más se repite en el sitio: aparece
   doce veces en el catálogo. Se prueban sus dos acciones.

   vi.fn() crea una función espía: no hace nada, pero registra si fue
   llamada y con qué argumentos. Sirve para comprobar que la tarjeta
   avisa correctamente hacia arriba, sin tener que montar toda la app. */
describe('TarjetaProducto', () => {

  it('PU-012: avisa el producto al hacer clic en "Agregar al carro"', () => {
    // Arrange
    const alAgregar = vi.fn();

    renderConRouter(
      <TarjetaProducto
        producto={productoMock}
        alAgregar={alAgregar}
        esFavorito={false}
        alAlternarFavorito={vi.fn()}
      />
    );

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carro' }));

    // Assert: se llamó una vez, y con el producto completo
    expect(alAgregar).toHaveBeenCalledTimes(1);
    expect(alAgregar).toHaveBeenCalledWith(productoMock);
  });

  it('PU-013: el botón de favoritos muestra el texto según su estado', () => {
    // Arrange: la tarjeta recibe esFavorito en true
    renderConRouter(
      <TarjetaProducto
        producto={productoMock}
        alAgregar={vi.fn()}
        esFavorito={true}
        alAlternarFavorito={vi.fn()}
      />
    );

    // Act: no hay acción, se comprueba el render inicial

    // Assert
    expect(
      screen.getByRole('button', { name: '★ Guardado en favoritos' })
    ).toBeInTheDocument();
  });

});
