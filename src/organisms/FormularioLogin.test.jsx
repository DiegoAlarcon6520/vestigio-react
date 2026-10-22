import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import FormularioLogin from './FormularioLogin';

/* PU-021 y PU-022
   El login muestra sus errores en pantalla, no con alert, así que se
   comprueban leyendo el texto que aparece. */
describe('FormularioLogin', () => {

  it('PU-021: avisa si la contraseña es demasiado corta', () => {
    // Arrange
    const alEnviar = vi.fn();
    render(<FormularioLogin tema="oscuro" alEnviar={alEnviar} />);

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: 'admin@vestigio.cl' }
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: '123' }
    });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    // Assert: se muestra el error y NO se intenta iniciar sesión
    expect(screen.getByRole('alert')).toHaveTextContent(
      'La contraseña debe tener al menos 6 caracteres.'
    );
    expect(alEnviar).not.toHaveBeenCalled();
  });

  it('PU-022: muestra el mensaje que devuelve el intento de sesión', () => {
    // Arrange: alEnviar simula un rechazo del hook useAuth
    const alEnviar = vi.fn(() => ({
      ok: false,
      mensaje: 'La contraseña no coincide.'
    }));

    render(<FormularioLogin tema="oscuro" alEnviar={alEnviar} />);

    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: 'admin@vestigio.cl' }
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: 'claveincorrecta' }
    });

    // Act
    fireEvent.click(screen.getByRole('button', { name: 'Entrar' }));

    // Assert
    expect(alEnviar).toHaveBeenCalledWith('admin@vestigio.cl', 'claveincorrecta');
    expect(screen.getByRole('alert')).toHaveTextContent('La contraseña no coincide.');
  });

});
