/* ==========================================================
   VESTIGIO — Componente raíz
   ==========================================================
   Arma el esqueleto que comparten todas las páginas y define qué
   componente se muestra en cada dirección.

   La estructura sigue Atomic Design:

     atoms/      piezas mínimas (un título, un precio, un enlace)
     molecules/  varios átomos juntos (una tarjeta, una sección)
     organisms/  bloques completos (el menú, la galería, el pie)
     views/      las páginas, que combinan organismos
     data/       los datos, separados de la presentación

   ========================================================== */

/* El CSS de Bootstrap va ANTES que App.css. Bootstrap trae un "reboot"
   que redefine body, los títulos y los párrafos, así que nuestro CSS
   tiene que cargarse después para poder ganarle. Si se invierten estas
   dos líneas, el sitio pierde el fondo oscuro. */
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import { Route, Routes } from 'react-router-dom';

import Header from './organisms/Header';
import Footer from './organisms/Footer';

import Index from './views/Index';
import Productos from './views/Productos';
import Producto from './views/Producto';
import NoEncontrada from './views/NoEncontrada';


function App() {

  /* Los enlaces del menú, con los mismos textos del sitio original.
     Antes apuntaban a archivos (articulos.html); ahora a rutas del
     router. "Contacto" conserva el ancla #contacto, que la página de
     inicio usa para bajar hasta esa sección. */
  const itemsMenu = [
    { destino: '/', texto: 'Inicio' },
    { destino: '/productos', texto: 'Artículos' },
    { destino: '/carrito', texto: 'Comprar' },
    { destino: '/#contacto', texto: 'Contacto' }
  ];

  return (
    <>
      {/* Header y Footer quedan FUERA de <Routes>. Eso significa que se
          dibujan una sola vez y se mantienen fijos: al cambiar de página
          solo se reemplaza lo que hay entre medio. */}
      <Header itemsMenu={itemsMenu} />

      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/productos" element={<Productos />} />

        {/* Los dos puntos marcan un trozo variable de la URL. Cualquier
            cosa que venga después de /productos/ se guarda en "id" y la
            página Producto la lee con useParams. */}
        <Route path="/productos/:id" element={<Producto />} />

        {/* El asterisco atrapa todo lo que no coincidió con las rutas de
            arriba. Siempre va al final. */}
        <Route path="*" element={<NoEncontrada />} />
      </Routes>

      <Footer texto="© 2026 Vestigio — Lo que no se ve, también existe." />
    </>
  );
}

export default App;
