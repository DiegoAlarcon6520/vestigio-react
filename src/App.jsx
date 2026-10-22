/* ==========================================================
   VESTIGIO — Componente raíz
   ==========================================================
   Arma el esqueleto que comparten todas las páginas, define qué
   componente se muestra en cada dirección y es el dueño del estado
   que varias páginas necesitan ver.

   La estructura sigue Atomic Design:

     atoms/      piezas mínimas (un título, un precio, un botón)
     molecules/  varios átomos juntos (una tarjeta, un campo de form.)
     organisms/  bloques completos (el menú, la galería, el formulario)
     views/      las páginas, que combinan organismos
     hooks/      estado y lógica reutilizable (carrito, favoritos, tema)
     data/       los datos, separados de la presentación
     utils/      funciones sueltas de apoyo

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
import Carrito from './views/Carrito';
import NoEncontrada from './views/NoEncontrada';

import { useCarrito } from './hooks/useCarrito';
import { useFavoritos } from './hooks/useFavoritos';
import { useTema } from './hooks/useTema';


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

  /* ===== ESTADO COMPARTIDO =====
     Estos tres hooks se llaman UNA sola vez, acá arriba, y su resultado
     baja por props hacia las páginas que lo necesitan.

     Van en App y no dentro de cada componente porque son datos que más
     de una página tiene que ver: el número del carro aparece en el menú
     y el detalle en la página de compra; un favorito marcado en el
     catálogo debe seguir marcado en la ficha del producto; y el tema
     afecta a todo el sitio a la vez. */
  const carrito = useCarrito();
  const favoritos = useFavoritos();
  const { tema, alternar: alternarTema } = useTema();

  return (
    <>
      {/* Header y Footer quedan FUERA de <Routes>. Eso significa que se
          dibujan una sola vez y se mantienen fijos: al cambiar de página
          solo se reemplaza lo que hay entre medio. */}
      <Header
        itemsMenu={itemsMenu}
        totalCarrito={carrito.totalUnidades}
        tema={tema}
        alAlternarTema={alternarTema}
      />

      <Routes>
        <Route path="/" element={<Index />} />

        <Route
          path="/productos"
          element={<Productos carrito={carrito} favoritos={favoritos} />}
        />

        {/* Los dos puntos marcan un trozo variable de la URL. Cualquier
            cosa que venga después de /productos/ se guarda en "id" y la
            página Producto la lee con useParams. */}
        <Route
          path="/productos/:id"
          element={<Producto carrito={carrito} favoritos={favoritos} />}
        />

        <Route
          path="/carrito"
          element={<Carrito carrito={carrito} tema={tema} />}
        />

        {/* El asterisco atrapa todo lo que no coincidió con las rutas de
            arriba. Siempre va al final. */}
        <Route path="*" element={<NoEncontrada />} />
      </Routes>

      <Footer texto="© 2026 Vestigio — Lo que no se ve, también existe." />
    </>
  );
}

export default App;
