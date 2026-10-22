import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import FormularioCompra from './FormularioCompra';
import { productoMock } from '../test/ayudas';

/* PU-017 a PU-019
   El formulario de compra concentra las validaciones heredadas de la
   primera entrega, así que es el componente más crítico del proyecto.

   Las validaciones avisan con alert(). jsdom no implementa alert, así
   que se reemplaza por una función espía: así la prueba puede leer el
   mensaje exacto sin que se abra nada. */
describe('FormularioCompra', () => {

  let espiaAlert;

  beforeEach(() => {
    espiaAlert = vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    espiaAlert.mockRestore();
  });

  /* Dibuja el formulario con un catálogo mínimo. */
  const montar = () =>
    render(<FormularioCompra tema="oscuro" catalogo={[productoMock]} />);


  it('PU-017: acepta el texto escrito en el campo Nombre', () => {
    // Arrange
    montar();
    const inputNombre = screen.getByLabelText(/Nombre completo/i);

    // Act
    fireEvent.change(inputNombre, { target: { value: 'Pepito' } });

    // Assert: el campo es controlado, así que el valor viaja al estado
    // y vuelve a la pantalla
    expect(inputNombre).toHaveValue('Pepito');
  });

  it('PU-018: rechaza un nombre con números', () => {
    // Arrange
    montar();
    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: 'Pepito123' }
    });

    // Act
    fireEvent.submit(document.getElementById('formulario-compra'));

    // Assert
    expect(espiaAlert).toHaveBeenCalledWith(
      'El nombre solo debe contener letras y espacios.'
    );
  });

  it('PU-019: rechaza un RUT escrito con puntos', () => {
    // Arrange: el nombre válido, para que la validación llegue al RUT
    montar();
    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: 'Diego Alarcon' }
    });
    fireEvent.change(screen.getByLabelText(/^RUT$/i), {
      target: { value: '12.345.678-9' }
    });

    // Act
    fireEvent.submit(document.getElementById('formulario-compra'));

    // Assert
    expect(espiaAlert).toHaveBeenCalledWith(
      'El RUT debe tener el formato 12345678-9 (sin puntos).'
    );
  });

  it('PU-020: rechaza un correo de un dominio no permitido', () => {
    // Arrange
    montar();
    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: 'Diego Alarcon' }
    });
    fireEvent.change(screen.getByLabelText(/^RUT$/i), {
      target: { value: '12345678-9' }
    });
    fireEvent.change(screen.getByLabelText(/Correo electrónico/i), {
      target: { value: 'diego@yahoo.com' }
    });

    // Act
    fireEvent.submit(document.getElementById('formulario-compra'));

    // Assert
    expect(espiaAlert).toHaveBeenCalledWith(
      expect.stringContaining('dominio permitido')
    );
  });

});
