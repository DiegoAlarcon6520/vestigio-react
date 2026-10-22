import { describe, it, expect, vi } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';

import Productos from './Productos';
import { renderConRouter } from '../test/ayudas';
import { productos } from '../data/productos';

/* PU-026 y PU-027
   Esta es una prueba de integración pequeña: monta la página completa
   del catálogo y comprueba que el filtro realmente reduce las tarjetas
   que se ven.

   El catálogo y los hooks llegan como objetos de mentira con la misma
   forma que los reales, para no tener que montar toda la aplicación. */
const catalogoFalso = {
  productos,
  buscarPorId: (id) => productos.find((p) => p.id === id)
};

const carritoFalso = { agregar: vi.fn() };
const favoritosFalsos = { esFavorito: () => false, alternar: vi.fn() };

function montar() {
  return renderConRouter(
    <Productos
      carrito={carritoFalso}
      favoritos={favoritosFalsos}
      catalogo={catalogoFalso}
      puedeComprar={true}
    />
  );
}

describe('Página Productos', () => {

  it('PU-026: muestra los doce equipos del catálogo al entrar', () => {
    // Arrange + Act
    montar();

    // Assert
    expect(screen.getAllByRole('button', { name: 'Agregar al carro' })).toHaveLength(12);
    expect(screen.getByText(/Mostrando 12 de 12 equipos/i)).toBeInTheDocument();
  });

  it('PU-027: el buscador filtra sin necesidad de escribir tildes', () => {
    // Arrange
    montar();
    const buscador = screen.getByPlaceholderText(/Buscar equipo/i);

    // Act: se escribe "camara", sin tilde
    fireEvent.change(buscador, { target: { value: 'camara' } });

    // Assert: quedan solo las dos cámaras del catálogo
    expect(screen.getByText('Cámara Espectro Completo')).toBeInTheDocument();
    expect(screen.getByText('Cámara Trampa Infrarroja')).toBeInTheDocument();
    expect(screen.queryByText('Spirit Box')).not.toBeInTheDocument();
    expect(screen.getByText(/Mostrando 2 de 12 equipos/i)).toBeInTheDocument();
  });

});
