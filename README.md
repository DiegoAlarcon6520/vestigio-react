# Vestigio — Migración a React

Migración del sitio estático `vestigio-sitio-rojo-y-verde` (HTML + CSS + JS)
a React con Vite, React Router y React Bootstrap.

## Puesta en marcha

```
npm install
npm run dev
```

## Estado: Fase 3 de 4 — Autenticación, rutas privadas y panel

Quedan las nueve páginas completas, con sesión persistente y CRUD del
catálogo.

### Cuenta de demostración

```
admin@vestigio.cl / vestigio123
```

También se pueden crear cuentas desde `/registro`. Esas quedan con rol
`cliente`: entran a su perfil, pero no al Panel de Control.

### Qué cambió respecto de la Fase 2

- **11 componentes nuevos** (de 31 a 42) y la carpeta `routes/`.
- Cuatro páginas nuevas: Login, Registro, Perfil y Panel de Control.
- `useAuth` guarda la sesión en `localStorage`, de modo que sobrevive a
  la recarga.
- `useCatalogo` convierte el catálogo en estado: hasta ahora era una
  lista fija importada; ahora el Panel puede crear, editar y eliminar.
- `RutaPrivada` controla el acceso en un solo lugar, con dos niveles:
  haber iniciado sesión, y tener rol de administrador.
- El menú cambia según la sesión.
- `FormularioCompra` deja de importar el catálogo y lo recibe por props,
  para que los equipos creados en el Panel aparezcan en su selector.

### Arquitectura (42 componentes)

```
src/
  atoms/        TituloPrincipal, Subtitulo, Precio, Valoracion,
                ImagenProducto, EnlaceMenu, BotonFavorito, BotonTema,
                CampoBusqueda, ContadorCarrito
  molecules/    MenuPrincipal, Seccion, TarjetaProducto,
                CampoFormulario, FiltroCatalogo, LineaCarrito
  organisms/    Header, Footer, Hero, Encabezado, GaleriaProductos,
                FormularioCompra, ResumenCarrito
                + FormularioLogin, FormularioRegistro,
                  FormularioProducto, TablaProductos
  views/        Index, Productos, Producto, Carrito, NoEncontrada
                + Login, Registro, Perfil, Panel
  routes/       RutaPrivada                                ← nueva carpeta
  hooks/        useCarrito, useFavoritos, useTema
                + useAuth, useCatalogo
  utils/        formato.js, texto.js
  data/         productos.js — el catálogo inicial
  App.css       los tres CSS originales + lo interactivo + el panel
```

### Rutas

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

### Qué se guarda y qué no

| Dato | Dónde vive | ¿Sobrevive al F5? |
|---|---|---|
| Sesión y cuentas registradas | `localStorage` | sí |
| Carrito y favoritos | memoria | no |
| Cambios del catálogo (Panel) | memoria | no |

Que el catálogo se pierda al recargar es intencional: la evaluación pide
un CRUD temporal. El propio Panel lo advierte en pantalla.

### Pendiente

- **Fase 4:** pruebas con Vitest y plan de pruebas.
