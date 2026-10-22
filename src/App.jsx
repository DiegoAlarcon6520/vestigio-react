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
     routes/     control de acceso a las rutas
     hooks/      estado y lógica reutilizable
     data/       los datos iniciales, separados de la presentación
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
import RutaPrivada from './routes/RutaPrivada';

import Index from './views/Index';
import Productos from './views/Productos';
import Producto from './views/Producto';
import Carrito from './views/Carrito';
import Login from './views/Login';
import Registro from './views/Registro';
import Panel from './views/Panel';
import Perfil from './views/Perfil';
import NoEncontrada from './views/NoEncontrada';

import { useCarrito } from './hooks/useCarrito';
import { useFavoritos } from './hooks/useFavoritos';
import { useTema } from './hooks/useTema';
import { useAuth } from './hooks/useAuth';
import { useCatalogo } from './hooks/useCatalogo';


function App() {

  /* ===== ESTADO COMPARTIDO =====
     Estos hooks se llaman UNA sola vez, acá arriba, y su resultado baja
     por props hacia las páginas que lo necesitan.

     Van en App y no dentro de cada componente porque son datos que más
     de una página tiene que ver: el número del carro aparece en el menú
     y el detalle en la página de compra; un favorito marcado en el
     catálogo debe seguir marcado en la ficha y en el perfil; el tema
     afecta a todo el sitio; y el catálogo lo modifica el Panel pero lo
     leen el listado, la ficha y el formulario de compra. */
  const carrito = useCarrito();
  const favoritos = useFavoritos();
  const { tema, alternar: alternarTema } = useTema();
  const auth = useAuth();
  const catalogo = useCatalogo();

  /* Quién puede comprar. La regla de negocio es simple: compran los
     invitados y los clientes, pero NO el administrador, cuya cuenta
     existe para mantener el catálogo.

     Se calcula una sola vez acá y baja por props, para que ningún
     componente tenga que volver a razonar sobre roles. */
  const puedeComprar = !auth.esAdmin;

  /* Los cuatro enlaces de siempre, con los mismos textos del sitio
     original. Antes apuntaban a archivos (articulos.html); ahora a
     rutas del router. "Contacto" conserva el ancla #contacto, que la
     página de inicio usa para bajar hasta esa sección. */
  const itemsBase = [
    { destino: '/', texto: 'Inicio' },
    { destino: '/productos', texto: 'Artículos' },
    { destino: '/carrito', texto: 'Comprar' },
    { destino: '/#contacto', texto: 'Contacto' }
  ];

  /* A esos se suman los de cuenta, que dependen de la sesión.
     Se arman acá y no dentro del Header para que ese componente no
     tenga que saber nada de autenticación. */
  const itemsCuenta = auth.autenticado
    ? [
        ...(auth.esAdmin ? [{ destino: '/panel', texto: 'Panel' }] : []),
        { destino: '/perfil', texto: 'Mi perfil' }
      ]
    : [{ destino: '/login', texto: 'Ingresar' }];

  /* Al administrador se le quita "Comprar" del menú: esa página solo
     le mostraría un aviso. filter() devuelve una lista nueva sin ese
     elemento cuando corresponde. */
  const itemsVisibles = puedeComprar
    ? itemsBase
    : itemsBase.filter((item) => item.destino !== '/carrito');

  const itemsMenu = [...itemsVisibles, ...itemsCuenta];

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
        autenticado={auth.autenticado}
        puedeComprar={puedeComprar}
        alCerrarSesion={auth.cerrarSesion}
      />

      <Routes>
        <Route path="/" element={<Index />} />

        <Route
          path="/productos"
          element={<Productos carrito={carrito} favoritos={favoritos} catalogo={catalogo} puedeComprar={puedeComprar} />}
        />

        {/* Los dos puntos marcan un trozo variable de la URL. Cualquier
            cosa que venga después de /productos/ se guarda en "id" y la
            página Producto la lee con useParams. */}
        <Route
          path="/productos/:id"
          element={<Producto carrito={carrito} favoritos={favoritos} catalogo={catalogo} puedeComprar={puedeComprar} />}
        />

        <Route
          path="/carrito"
          element={<Carrito carrito={carrito} auth={auth} tema={tema} />}
        />

        <Route path="/login" element={<Login auth={auth} tema={tema} />} />
        <Route path="/registro" element={<Registro auth={auth} tema={tema} />} />

        {/* ----- RUTAS PRIVADAS -----
            RutaPrivada envuelve a la página y decide si dejarla pasar.
            El Panel además exige rol de administrador. */}
        <Route
          path="/perfil"
          element={
            <RutaPrivada autenticado={auth.autenticado}>
              <Perfil auth={auth} favoritos={favoritos} carrito={carrito} catalogo={catalogo} />
            </RutaPrivada>
          }
        />

        <Route
          path="/panel"
          element={
            <RutaPrivada autenticado={auth.autenticado} permitido={auth.esAdmin}>
              <Panel auth={auth} catalogo={catalogo} tema={tema} />
            </RutaPrivada>
          }
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
