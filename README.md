# Vestigio — Migración a React

Migración del sitio estático `vestigio-sitio-rojo-y-verde` (HTML + CSS + JS)
a React con Vite, React Router y React Bootstrap.

## Puesta en marcha

```
npm install
npm run dev
```

## Estado: Fase 1 de 4 — Migración fiel y enrutamiento

Se traslada el sitio estático a React sin agregar funcionalidades: misma
apariencia, mismo contenido, ahora en componentes y con rutas.

### Qué trae esta fase

- Estructura de carpetas según Atomic Design.
- Los tres CSS del sitio original unificados en `App.css`, con una capa
  de compatibilidad para el *reboot* de Bootstrap.
- Los doce productos trasladados de `articulos.html` a `data/productos.js`.
- Cuatro páginas con enrutamiento, dos de ellas nuevas.

**Fidelidad verificada:** la portada no presenta diferencias de píxel
contra el `index.html` original; el catálogo difiere un 0,05% por el
redondeo de la cuadrícula.

### Arquitectura (18 componentes)

```
src/
  atoms/        TituloPrincipal, Subtitulo, Precio, Valoracion,
                ImagenProducto, EnlaceMenu
  molecules/    MenuPrincipal, Seccion, TarjetaProducto
  organisms/    Header, Footer, Hero, Encabezado, GaleriaProductos
  views/        Index, Productos, Producto, NoEncontrada
  data/         productos.js — el catálogo
  App.css       los tres CSS del sitio original unificados
```

### Rutas

| Ruta | Página | Origen |
|---|---|---|
| `/` | Index | `index.html` |
| `/productos` | Productos | `articulos.html` |
| `/productos/:id` | Producto | nueva |
| `*` | NoEncontrada | nueva (error 404) |

> El enlace "Comprar" del menú apunta a `/carrito`, que todavía no
> existe: por ahora muestra la página 404. Se habilita en la Fase 2.

### Pendiente

- **Fase 2:** carrito, favoritos, filtro, tema claro/oscuro y la página
  de compra con sus validaciones.
- **Fase 3:** login, registro, rutas privadas, panel de administración
  y perfil.
- **Fase 4:** pruebas con Vitest y plan de pruebas.
