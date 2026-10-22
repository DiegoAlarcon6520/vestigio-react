import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';

import GaleriaProductos from './GaleriaProductos';
import { renderConRouter, productoMock } from '../test/ayudas';

/* PU-015 y PU-016
   La galería tiene un caso especial que conviene cuidar: cuando el
   filtro no encuentra nada, en vez de una cuadrícula vacía debe salir
   un mensaje. */
describe('GaleriaProductos', () => {

  it('PU-015: dibuja una tarjeta por cada producto de la lista', () => {
    // Arrange: tres productos con id distinto
    const lista = [
      { ...productoMock, id: 'uno', nombre: 'Equipo Uno' },
      { ...productoMock, id: 'dos', nombre: 'Equipo Dos' },
      { ...productoMock, id: 'tres', nombre: 'Equipo Tres' }
    ];

    // Act
    renderConRouter(
      <GaleriaProductos
        productos={lista}
        alAgregar={vi.fn()}
        puedeComprar={true}
        esFavorito={() => false}
        alAlternarFavorito={vi.fn()}
      />
    );

    // Assert: hay un botón "Agregar al carro" por tarjeta
    expect(screen.getAllByRole('button', { name: 'Agregar al carro' })).toHaveLength(3);
    expect(screen.getByText('Equipo Dos')).toBeInTheDocument();
  });

  it('PU-016: muestra un aviso cuando la lista llega vacía', () => {
    // Arrange + Act
    renderConRouter(
      <GaleriaProductos
        productos={[]}
        alAgregar={vi.fn()}
        puedeComprar={true}
        esFavorito={() => false}
        alAlternarFavorito={vi.fn()}
      />
    );

    // Assert
    expect(screen.getByText(/No encontramos equipos/i)).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Agregar al carro' })).not.toBeInTheDocument();
  });

});
