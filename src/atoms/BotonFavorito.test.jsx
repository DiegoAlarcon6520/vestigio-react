import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import BotonFavorito from './BotonFavorito';

/* PU-014
   El botón de favoritos es un componente "controlado": no guarda el
   estado, lo recibe. Esta prueba comprueba que avisa el clic hacia
   arriba, que es toda su responsabilidad. */
describe('BotonFavorito', () => {

  it('PU-014: llama a alAlternar cuando el usuario hace clic', () => {
    // Arrange
    const alAlternar = vi.fn();
    render(<BotonFavorito activo={false} alAlternar={alAlternar} />);

    // Act
    fireEvent.click(screen.getByRole('button', { name: '☆ Agregar a favoritos' }));

    // Assert
    expect(alAlternar).toHaveBeenCalledTimes(1);
  });

});
