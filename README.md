# Vestigio — Migración a React

Migración del sitio estático `vestigio-sitio-rojo-y-verde` (HTML + CSS + JS)
a React con Vite, React Router y React Bootstrap.

## Puesta en marcha

```
npm install
npm run dev
```

## Estado: Fase 2 de 4 — Estado e interactividad

El sitio deja de ser estático: aparecen las cuatro funcionalidades con
`useState` y la página de compra.

### Qué cambió respecto de la Fase 1

- **13 componentes nuevos** (de 18 a 31) y la carpeta `hooks/`.
- El carrito, los favoritos y el tema pasan a hooks propios, porque los
  comparte más de una vista.
- `TarjetaProducto` y `GaleriaProductos` dejan de ser estáticas: reciben
  las acciones por props.
- Primer uso de React Bootstrap, solo en el formulario de compra.
- El catálogo gana buscador, orden y contador de resultados.
- `data/productos.js` gana un campo `valor` numérico, porque no se puede
  sumar `"$34.990"` como texto.

### Arquitectura (31 componentes)

```
src/
  atoms/        TituloPrincipal, Subtitulo, Precio, Valoracion,
                ImagenProducto, EnlaceMenu
                + BotonFavorito, BotonTema, CampoBusqueda, ContadorCarrito
  molecules/    MenuPrincipal, Seccion, TarjetaProducto
                + CampoFormulario, FiltroCatalogo, LineaCarrito
  organisms/    Header, Footer, Hero, Encabezado, GaleriaProductos
                + FormularioCompra, ResumenCarrito
  views/        Index, Productos, Producto, NoEncontrada
                + Carrito
  hooks/        useCarrito, useFavoritos, useTema          ← nueva carpeta
  utils/        formato.js, texto.js                       ← nueva carpeta
  data/         productos.js — el catálogo
  App.css       los tres CSS originales + los estilos de lo interactivo
```

### Rutas

| Ruta | Página | Origen |
|---|---|---|
| `/` | Index | `index.html` |
| `/productos` | Productos | `articulos.html` |
| `/productos/:id` | Producto | nueva |
| `/carrito` | Carrito | `compra.html` |
| `*` | NoEncontrada | nueva (error 404) |

### Funcionalidades con estado

| Funcionalidad | Dónde vive el estado | Dónde se ve |
|---|---|---|
| Carrito de compras | `useCarrito` en App | menú, catálogo, ficha, `/carrito` |
| Favoritos | `useFavoritos` en App | catálogo y ficha |
| Filtro y orden del catálogo | `useState` en Productos | `/productos` |
| Tema claro / oscuro | `useTema` en App | todo el sitio |

### Validaciones del formulario de compra

Las ocho de la primera entrega (nombre, RUT, correo, teléfono, mayoría de
edad, producto, cantidad y forma de pago) más cinco campos propios de la
tienda: dirección, comuna, tipo de investigación, nivel de experiencia y
aceptación de condiciones.

### Pendiente

- **Fase 3:** login, registro, rutas privadas, panel de administración
  y perfil.
- **Fase 4:** pruebas con Vitest y plan de pruebas.
