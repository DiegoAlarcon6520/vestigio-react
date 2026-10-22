import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';

/* ==========================================================
   AYUDAS PARA LAS PRUEBAS
   ==========================================================
   Varios componentes usan <Link> o useParams. Esos solo funcionan
   dentro de un router: si se renderizan sueltos, React lanza el error
   "useNavigate() may be used only in the context of a Router".

   MemoryRouter es un router que guarda la ruta en memoria en vez de en
   la barra del navegador. Es el que se usa en pruebas.

   renderConRouter evita repetir ese envoltorio en cada archivo.
   ========================================================== */
export function renderConRouter(componente, { ruta = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[ruta]}>
      {componente}
    </MemoryRouter>
  );
}

/* Producto de mentira para las pruebas.
   Tiene la misma forma que los de data/productos.js, pero con valores
   simples y predecibles, para que las comparaciones sean claras. */
export const productoMock = {
  id: 'equipo-prueba',
  imagen: 'imagen-de-prueba.png',
  nombre: 'Herramienta',
  descripcion: 'Equipo de prueba para los tests.',
  precio: '$10.000',
  valor: 10000,
  valoracion: '★★★★☆',
  alt: 'Imagen de prueba'
};
