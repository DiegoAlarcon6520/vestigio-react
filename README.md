# Vestigio — Migración a React

Migración del sitio estático `vestigio-sitio-rojo-y-verde` (HTML + CSS + JS)
a React con Vite, React Router y React Bootstrap.

## Puesta en marcha

```
npm install
npm run dev
```

## Estado: Fase 5 de 5 — Reglas de compra por tipo de usuario · PROYECTO COMPLETO

La Fase 4 dejaba comprar a cualquiera y el formulario volvía a preguntar
qué producto y cuántas unidades, dato que el carro ya tenía. Esta fase
corrige esa lógica de negocio.

### Qué cambió respecto de la Fase 4

**Quién puede comprar**

| Usuario | Puede comprar | Qué ve en `/carrito` |
|---|---|---|
| Invitado (sin sesión) | sí | Formulario completo |
| Cliente (con sesión) | sí | Ficha con sus datos + formulario corto |
| Administrador | **no** | Aviso; no se monta el formulario |

Al administrador se le quita además el botón "Agregar al carro" de las
tarjetas y de la ficha, el contador del menú y el enlace "Comprar".
La decisión se calcula una vez en `App.jsx` (`puedeComprar = !esAdmin`)
y baja por props: ningún componente vuelve a razonar sobre roles.

**El carro manda sobre el formulario**

Salieron los campos "Seleccione producto" y "Cantidad". Las dos
validaciones que dependían de ellos no se perdieron, se trasladaron:

| Validación original | Dónde vive ahora |
|---|---|
| "Debes seleccionar un producto del catálogo" | El carro no puede estar vacío |
| "La cantidad debe estar entre 1 y 99" | `MAX_POR_LINEA` en `useCarrito` |

Si el carro está vacío, el formulario ni siquiera aparece.

**El registro guarda lo necesario para comprar**

Pasó de 7 a 13 campos, agrupados en identificación, despacho y perfil de
investigador. La razón es concreta: con esos datos guardados, el cliente
con sesión compra sin volver a escribirlos.

Campos propios de la temática de la tienda:

- Tipo de investigador
- Nivel de experiencia
- Fenómeno que le interesa registrar
- Equipamiento con que ya cuenta
- Horario de despacho (en la compra; las investigaciones son nocturnas)
- Tipo de investigación del pedido

**Otros ajustes**

- Las listas desplegables compartidas se movieron a `data/opciones.js`,
  para no mantener dos copias de las mismas comunas.
- La sesión guarda la ficha completa del cliente, menos la contraseña.
- El ejemplo del campo de correo pasó de `nombre@duocuc.cl` a
  `nombre@gmail.com`.

### Pruebas

```
npm test           # modo interactivo, escucha cambios
npm run test:run   # una sola pasada
```

```
 Test Files  1 failed | 13 passed (14)
      Tests  3 failed | 38 passed (41)
```

El reporte está en modo `verbose`: lista las 41 pruebas una por una con
su nombre, marca cada una con ✓ o ×, y para las que fallan imprime el
motivo. El detalle de cada caso está en `plan_de_pruebas.md`.

**Hay tres pruebas que fallan a propósito**, en
`src/limitaciones-conocidas.test.jsx`. No son errores: están escritas
contra el comportamiento ideal y documentan lo que el proyecto todavía
no hace.

| ID | Qué pide | Por qué falla |
|---|---|---|
| PU-039 | Que el carro sobreviva a la recarga | Está en memoria, como pide la evaluación |
| PU-040 | Que los equipos del Panel persistan | El CRUD es temporal por diseño |
| PU-041 | Que las contraseñas no queden legibles | Sin servidor no hay dónde guardar un hash |

Se quedan dentro de la batería a propósito: así la limitación queda a la
vista en cada ejecución, y el día que se implemente la funcionalidad, la
prueba pasa a verde sola.

**No confundirlas con las pruebas de rechazo.** PU-018, PU-019, PU-020,
PU-029, PU-032 y PU-033 verifican que el sistema *rechaza* datos
inválidos, y por eso **pasan**: lo que se comprueba es que el rechazo
ocurrió. Si PU-019 saliera en rojo, significaría que el formulario
aceptó un RUT con puntos.

### Cuentas

```
Administrador   admin@vestigio.cl / vestigio123
Cliente         se crea desde /registro
```

El administrador es la única cuenta con credenciales fijas. Los clientes
se registran, y la cuenta creada permite iniciar sesión de inmediato.

### Arquitectura (43 componentes + 14 archivos de prueba)

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
  test/         ayudas.jsx — envoltorios compartidos
  data/         productos.js — el catálogo inicial
                opciones.js — las listas de los formularios
  App.css       todos los estilos del sitio
  limitaciones-conocidas.test.jsx — las 3 pruebas que fallan a propósito
```

Cada archivo `*.test.jsx` vive junto al componente que prueba.

### Las nueve páginas

| Ruta | Página | Origen | Acceso |
|---|---|---|---|
| `/` | Index | `index.html` | público |
| `/productos` | Productos | `articulos.html` | público |
| `/productos/:id` | Producto | nueva | público |
| `/carrito` | Carrito | `compra.html` | público, salvo administrador |
| `/login` | Login | nueva | público |
| `/registro` | Registro | nueva | público |
| `/perfil` | Perfil | nueva | requiere sesión |
| `/panel` | Panel | nueva | requiere rol admin |
| `*` | NoEncontrada | nueva (error 404) | público |

### Recorrido de las cinco fases

| Fase | Aporte | Componentes | Pruebas |
|---|---|---|---|
| 1 | Migración fiel y enrutamiento | 18 | — |
| 2 | Estado e interactividad | 31 | — |
| 3 | Autenticación, rutas privadas y panel | 42 | — |
| 4 | Pruebas unitarias | 42 | 27 |
| 5 | Reglas de compra por tipo de usuario | 43 | 41 (38 ✓ · 3 × intencionales) |
