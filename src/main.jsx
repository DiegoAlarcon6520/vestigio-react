/* ==========================================================
   VESTIGIO — Punto de entrada de la aplicación
   ==========================================================
   Este archivo es lo primero que ejecuta el navegador.
   Su única tarea es montar <App /> dentro del div#root del
   index.html y envolverlo en el router.
   ========================================================== */

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './App.jsx'

/* BrowserRouter habilita las rutas (/, /productos, ...). Tiene que
   envolver a App para que cualquier componente de adentro pueda usar
   <Link>, useParams o useLocation.

   StrictMode es una ayuda de desarrollo: React monta los componentes
   dos veces para detectar efectos mal escritos. No afecta a producción. */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
