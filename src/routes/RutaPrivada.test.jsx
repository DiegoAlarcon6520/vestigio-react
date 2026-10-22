import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

import RutaPrivada from './RutaPrivada';

/* PU-023 a PU-025
   RutaPrivada es el control de acceso del sitio. Si falla, el Panel de
   Control queda abierto a cualquiera, así que se prueban sus tres
   caminos.

   Se monta un router de verdad con dos rutas para poder comprobar a
   dónde termina yendo el usuario. */
function montar({ autenticado, permitido }) {
  return render(
    <MemoryRouter initialEntries={['/panel']}>
      <Routes>
        <Route
          path="/panel"
          element={
            <RutaPrivada autenticado={autenticado} permitido={permitido}>
              <p>Contenido del panel</p>
            </RutaPrivada>
          }
        />
        <Route path="/login" element={<p>Página de login</p>} />
        <Route path="/perfil" element={<p>Página de perfil</p>} />
      </Routes>
    </MemoryRouter>
  );
}

describe('RutaPrivada', () => {

  it('PU-023: sin sesión redirige al login', () => {
    // Arrange + Act
    montar({ autenticado: false, permitido: true });

    // Assert
    expect(screen.getByText('Página de login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido del panel')).not.toBeInTheDocument();
  });

  it('PU-024: con sesión pero sin permiso redirige al perfil', () => {
    // Arrange + Act: un cliente intentando entrar al Panel
    montar({ autenticado: true, permitido: false });

    // Assert
    expect(screen.getByText('Página de perfil')).toBeInTheDocument();
    expect(screen.queryByText('Contenido del panel')).not.toBeInTheDocument();
  });

  it('PU-025: con sesión y permiso deja ver la página', () => {
    // Arrange + Act
    montar({ autenticado: true, permitido: true });

    // Assert
    expect(screen.getByText('Contenido del panel')).toBeInTheDocument();
  });

});
