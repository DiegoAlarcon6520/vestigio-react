import { Navigate, useLocation } from 'react-router-dom';

/* ==========================================================
   RutaPrivada
   ==========================================================
   Envuelve a una página para que solo se vea si hay sesión iniciada.

   No dibuja nada propio: o deja pasar a sus children, o redirige al
   login. Por eso vive en routes/ y no en atoms/molecules/organisms:
   es infraestructura de enrutamiento, no interfaz.

   Se usa así en App.jsx:

     <Route path="/panel" element={
       <RutaPrivada autenticado={...}>
         <Panel />
       </RutaPrivada>
     } />

   El atributo "replace" del Navigate hace que la redirección
   REEMPLACE la entrada en el historial en vez de agregar una nueva.
   Sin eso, el botón Atrás del navegador devolvería al usuario a la
   ruta protegida y quedaría rebotando.

   state={{ volverA }} le pasa al login la dirección que el usuario
   quería visitar, para devolverlo ahí después de entrar.
   ========================================================== */
function RutaPrivada({ autenticado, permitido = true, children }) {

  const location = useLocation();

  /* Caso 1: no hay sesión → al login. */
  if (!autenticado) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ volverA: location.pathname }}
      />
    );
  }

  /* Caso 2: hay sesión pero el rol no alcanza (por ejemplo, un cliente
     intentando entrar al Panel). Se le manda a su perfil. */
  if (!permitido) {
    return <Navigate to="/perfil" replace />;
  }

  /* Caso 3: todo en orden → se muestra la página. */
  return children;
}

export default RutaPrivada;
