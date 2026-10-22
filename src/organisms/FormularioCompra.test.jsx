import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';

import FormularioCompra from './FormularioCompra';
import { productoMock } from '../test/ayudas';

/* El formulario de compra concentra las validaciones heredadas de la
   primera entrega, así que es el componente más crítico del proyecto.

   Desde la Fase 5 tiene dos modos: invitado y cliente con sesión. Se
   prueban los dos, porque las reglas que aplican no son las mismas.

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

  /* Un carro con un equipo dentro. Sin esto el formulario se detiene
     antes de revisar nada más, porque no hay nada que comprar. */
  const carroConUnEquipo = {
    items: [{ producto: productoMock, cantidad: 1 }],
    totalUnidades: 1,
    totalPrecio: productoMock.valor
  };

  /* Ficha de un cliente con sesión, tal como la guarda useAuth. */
  const clienteMock = {
    nombre: 'Diego Alarcon',
    rut: '12345678-9',
    email: 'diego@gmail.com',
    fono: '+56912345678',
    direccion: 'Av. Concha y Toro 1234',
    comuna: 'Puente Alto',
    experiencia: 'Intermedio',
    rol: 'cliente'
  };

  const montarInvitado = (carro = carroConUnEquipo) =>
    render(
      <FormularioCompra tema="oscuro" usuario={null} resumenCarrito={carro} />
    );

  const montarCliente = () =>
    render(
      <FormularioCompra
        tema="oscuro"
        usuario={clienteMock}
        resumenCarrito={carroConUnEquipo}
      />
    );

  const enviar = () =>
    fireEvent.submit(document.getElementById('formulario-compra'));


  /* ===== MODO INVITADO ===== */

  it('PU-017: acepta el texto escrito en el campo Nombre', () => {
    // Arrange
    montarInvitado();
    const inputNombre = screen.getByLabelText(/Nombre completo/i);

    // Act
    fireEvent.change(inputNombre, { target: { value: 'Pepito' } });

    // Assert: el campo es controlado, así que el valor viaja al estado
    // y vuelve a la pantalla
    expect(inputNombre).toHaveValue('Pepito');
  });

  it('PU-018: rechaza un nombre con números', () => {
    // Arrange
    montarInvitado();
    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: 'Pepito123' }
    });

    // Act
    enviar();

    // Assert
    expect(espiaAlert).toHaveBeenCalledWith(
      'El nombre solo debe contener letras y espacios.'
    );
  });

  it('PU-019: rechaza un RUT escrito con puntos', () => {
    // Arrange: nombre válido, para que la validación llegue al RUT
    montarInvitado();
    fireEvent.change(screen.getByLabelText(/Nombre completo/i), {
      target: { value: 'Diego Alarcon' }
    });
    fireEvent.change(screen.getByLabelText(/^RUT$/i), {
      target: { value: '12.345.678-9' }
    });

    // Act
    enviar();

    // Assert
    expect(espiaAlert).toHaveBeenCalledWith(
      'El RUT debe tener el formato 12345678-9 (sin puntos).'
    );
  });

  it('PU-020: rechaza un correo de un dominio no permitido', () => {
    // Arrange
    montarInvitado();
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
    enviar();

    // Assert
    expect(espiaAlert).toHaveBeenCalledWith(
      expect.stringContaining('dominio permitido')
    );
  });


  /* ===== EL CARRO MANDA ===== */

  it('PU-029: no deja comprar con el carro vacío', () => {
    // Arrange: un carro sin equipos
    const carroVacio = { items: [], totalUnidades: 0, totalPrecio: 0 };
    montarInvitado(carroVacio);

    // Act
    enviar();

    // Assert: esta validación reemplaza a la antigua "debes seleccionar
    // un producto del catálogo"
    expect(espiaAlert).toHaveBeenCalledWith(
      'Debes agregar al menos un equipo al carro antes de comprar.'
    );
  });

  it('PU-030: ya no pregunta qué producto ni cuántas unidades', () => {
    // Arrange
    montarInvitado();

    // Act: no hay acción

    // Assert: esos dos campos salieron del formulario en la Fase 5,
    // porque ahora los decide el carro
    expect(screen.queryByLabelText(/Seleccione producto/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^Cantidad$/i)).not.toBeInTheDocument();
  });


  /* ===== MODO CLIENTE ===== */

  it('PU-031: con sesión iniciada no vuelve a pedir los datos personales', () => {
    // Arrange
    montarCliente();

    // Act: no hay acción

    // Assert: los campos de identidad desaparecen y en su lugar se
    // muestra la ficha con los datos guardados en la cuenta
    expect(screen.queryByLabelText(/Nombre completo/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/^RUT$/i)).not.toBeInTheDocument();
    expect(screen.getByText('Comprando como')).toBeInTheDocument();
    expect(screen.getByText(/Av\. Concha y Toro 1234/)).toBeInTheDocument();
  });

  it('PU-032: al cliente igual le exige los datos propios del pedido', () => {
    // Arrange: no elige tipo de investigación
    montarCliente();

    // Act
    enviar();

    // Assert
    expect(espiaAlert).toHaveBeenCalledWith(
      'Cuéntanos en qué tipo de investigación usarás los equipos.'
    );
  });

});
