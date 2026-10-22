import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';

import Carrito from './Carrito';
import { renderConRouter, productoMock } from '../test/ayudas';

/* La página Carrito es la que decide QUIÉN puede comprar. Es una regla
   de negocio, no un detalle visual, así que conviene fijarla con
   pruebas: si mañana alguien la cambia sin querer, estas avisan.

   Las tres situaciones posibles son administrador, cliente con sesión
   e invitado. */
describe('Página Carrito', () => {

  const carroConUnEquipo = {
    items: [{ producto: productoMock, cantidad: 1 }],
    estaVacio: false,
    totalUnidades: 1,
    totalPrecio: productoMock.valor,
    agregar: vi.fn(),
    quitar: vi.fn(),
    cambiarCantidad: vi.fn(),
    vaciar: vi.fn()
  };

  const authAdmin = {
    autenticado: true,
    esAdmin: true,
    usuario: { nombre: 'Administrador Vestigio', rol: 'admin' }
  };

  const authCliente = {
    autenticado: true,
    esAdmin: false,
    usuario: {
      nombre: 'Diego Alarcon', rut: '12345678-9', email: 'diego@gmail.com',
      fono: '+56912345678', direccion: 'Av. Siempre Viva 742',
      comuna: 'Ñuñoa', experiencia: 'Intermedio', rol: 'cliente'
    }
  };

  const authInvitado = { autenticado: false, esAdmin: false, usuario: null };

  const montar = (auth, carro = carroConUnEquipo) =>
    renderConRouter(<Carrito carrito={carro} auth={auth} tema="oscuro" />);


  it('PU-033: el administrador no puede comprar', () => {
    // Arrange + Act
    montar(authAdmin);

    // Assert: ve un aviso y no se monta el formulario
    expect(screen.getByText(/COMPRAS NO DISPONIBLES/i)).toBeInTheDocument();
    expect(document.getElementById('formulario-compra')).toBeNull();
  });

  it('PU-034: el invitado ve el formulario completo', () => {
    // Arrange + Act
    montar(authInvitado);

    // Assert
    expect(document.getElementById('formulario-compra')).not.toBeNull();
    expect(screen.getByLabelText(/Nombre completo/i)).toBeInTheDocument();
  });

  it('PU-035: el cliente con sesión ve el formulario corto', () => {
    // Arrange + Act
    montar(authCliente);

    // Assert: hay formulario, pero sin los campos de identidad
    expect(document.getElementById('formulario-compra')).not.toBeNull();
    expect(screen.queryByLabelText(/Nombre completo/i)).not.toBeInTheDocument();
    expect(screen.getByText('Comprando como')).toBeInTheDocument();
  });

  it('PU-036: con el carro vacío no se muestra el formulario', () => {
    // Arrange
    const carroVacio = { ...carroConUnEquipo, items: [], estaVacio: true, totalUnidades: 0, totalPrecio: 0 };

    // Act
    montar(authInvitado, carroVacio);

    // Assert
    expect(document.getElementById('formulario-compra')).toBeNull();
    expect(screen.getByText(/Nada que comprar todavía/i)).toBeInTheDocument();
  });

});
