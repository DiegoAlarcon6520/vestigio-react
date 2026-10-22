import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

import TarjetaProducto from './TarjetaProducto';
import { renderConRouter, productoMock } from '../test/ayudas';

/* La tarjeta es el componente que más se repite en el sitio: aparece
   doce veces en el catálogo.

   vi.fn() crea una función espía: no hace nada, pero registra si fue
   llamada y con qué argumentos. Sirve para comprobar que la tarjeta
   avisa correctamente hacia arriba, sin montar toda la aplicación. */
describe('TarjetaProducto', () => {

  /* Dibuja la tarjeta con valores por defecto, dejando sobrescribir
     solo lo que cada prueba necesite cambiar. */
  const montar = (extra = {}) =>
    renderConRouter(
      <TarjetaProducto
        producto={productoMock}
        alAgregar={vi.fn()}
        puedeComprar={true}
        esFavorito={false}
        alAlternarFavorito={vi.fn()}
        {...extra}
      />
    );

  it('PU-012: avisa el producto al hacer clic en "Agregar al carro"', () => {
    // Arrange
    const alAgregar = vi.fn();
    montar({ alAgregar });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Agregar al carro' }));

    // Assert: se llamó una vez, y con el producto completo
    expect(alAgregar).toHaveBeenCalledTimes(1);
    expect(alAgregar).toHaveBeenCalledWith(productoMock);
  });

  it('PU-013: el botón de favoritos muestra el texto según su estado', () => {
    // Arrange
    montar({ esFavorito: true });

    // Act: no hay acción, se comprueba el render inicial

    // Assert
    expect(
      screen.getByRole('button', { name: '★ Guardado en favoritos' })
    ).toBeInTheDocument();
  });

  it('PU-028: no ofrece el botón de carro a quien no puede comprar', () => {
    // Arrange: es el caso de la cuenta de administración
    montar({ puedeComprar: false });

    // Act: no hay acción

    // Assert: desaparece el botón de carro, pero el de favoritos queda
    expect(
      screen.queryByRole('button', { name: 'Agregar al carro' })
    ).not.toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: '☆ Agregar a favoritos' })
    ).toBeInTheDocument();
  });

});
