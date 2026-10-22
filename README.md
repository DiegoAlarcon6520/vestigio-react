# Vestigio — Migración a React

Migración del sitio estático `vestigio-sitio-rojo-y-verde` (HTML + CSS + JS)
a React con Vite, React Router y React Bootstrap.

## Puesta en marcha

```
npm install
npm run dev
```

## Estado: Fase 4 de 4 — Pruebas unitarias · PROYECTO COMPLETO

### Pruebas

```
npm run test:run   # una sola pasada
npm test           # modo interactivo, escucha cambios
```

```
 Test Files  12 passed (12)
      Tests  27 passed (27)
```

El alcance, la estrategia y el detalle de cada caso están en
`plan_de_pruebas.md`.

### Cuenta de demostración

```
admin@vestigio.cl / vestigio123
```

### Qué cambió respecto de la Fase 3

- **27 pruebas unitarias** en 12 archivos, siguiendo el patrón
  Arrange–Act–Assert.
- Vitest, React Testing Library y jsdom como dependencias de desarrollo.
- El bloque `test` dentro de `vite.config.js`, para que las pruebas usen
  las mismas reglas de compilación que la aplicación.
- `src/test/ayudas.jsx` con el envoltorio de router y el producto de
  prueba compartidos.
- `plan_de_pruebas.md` en la raíz.

No se modificó ningún componente: esta fase solo agrega pruebas sobre lo
ya construido.

### Qué se prueba y por qué

| Área | Casos | Riesgo que cubre |
|---|---|---|
| `useCarrito` | PU-007 a PU-010 | totales equivocados al cliente |
| Validaciones de compra | PU-017 a PU-020 | pedidos con RUT o correo inválidos |
| `RutaPrivada` | PU-023 a PU-025 | el Panel abierto a cualquiera |
| Filtro del catálogo | PU-026, PU-027 | falla silenciosa: no encuentra lo que debería |
| Favoritos | PU-011, PU-013, PU-014 | el ciclo marcar / desmarcar |
| Login | PU-021, PU-022 | credenciales mal validadas |
| Utilidades | PU-001 a PU-006 | se propagan a todo el sitio |

Quedan fuera los estilos y el comportamiento responsivo, que no se
prestan para pruebas unitarias y se verificaron en el navegador. El
resultado de esa revisión está en la sección 6 del plan de pruebas.

### Arquitectura (42 componentes + 12 archivos de prueba)

```
src/
  atoms/        TituloPrincipal, Subtitulo, Precio, Valoracion,
                ImagenProducto, EnlaceMenu, BotonFavorito, BotonTema,
                CampoBusqueda, ContadorCarrito
  molecules/    MenuPrincipal, Seccion, TarjetaProducto,
                CampoFormulario, FiltroCatalogo, LineaCarrito
  organisms/    Header, Footer, Hero, Encabezado, GaleriaProductos,
                FormularioCompra, ResumenCarrito, FormularioLogin,
                FormularioRegistro, FormularioProducto, TablaProductos
  views/        Index, Productos, Producto, Carrito, Login, Registro,
                Perfil, Panel, NoEncontrada
  routes/       RutaPrivada
  hooks/        useCarrito, useFavoritos, useTema, useAuth, useCatalogo
  utils/        formato.js, texto.js
  test/         ayudas.jsx — envoltorios compartidos   ← nueva carpeta
  data/         productos.js — el catálogo inicial
  App.css       todos los estilos del sitio
```

Cada archivo `*.test.jsx` vive junto al componente que prueba.

### Las nueve páginas

| Ruta | Página | Origen | Acceso |
|---|---|---|---|
| `/` | Index | `index.html` | público |
| `/productos` | Productos | `articulos.html` | público |
| `/productos/:id` | Producto | nueva | público |
| `/carrito` | Carrito | `compra.html` | público |
| `/login` | Login | nueva | público |
| `/registro` | Registro | nueva | público |
| `/perfil` | Perfil | nueva | requiere sesión |
| `/panel` | Panel | nueva | requiere rol admin |
| `*` | NoEncontrada | nueva (error 404) | público |

### Recorrido de las cuatro fases

| Fase | Aporte | Componentes |
|---|---|---|
| 1 | Migración fiel y enrutamiento | 18 |
| 2 | Estado e interactividad | 31 |
| 3 | Autenticación, rutas privadas y panel | 42 |
| 4 | Pruebas unitarias | 42 + 12 pruebas |
