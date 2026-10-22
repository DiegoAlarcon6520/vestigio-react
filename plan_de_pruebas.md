# Plan de Pruebas Unitarias — Vestigio

**Estudiante:** Diego Alarcón Mercado
<br />

**Proyecto:** Vestigio — migración del sitio estático a React
<br />

**Componentes / Módulos principales:** Carrito, Favoritos, Catálogo, Formulario de Compra, Login, Control de acceso
<br />

**Herramientas:** Vitest + React Testing Library + jsdom
<br />

**Fecha:** 22-10-2026 · versión 2 (incluye las reglas de compra de la Fase 5)

---

## 1. Alcance y criterio de selección

No se prueba todo el proyecto: se priorizan las piezas que, si fallan,
rompen una funcionalidad completa o dejan pasar algo que no debería.
Siguiendo ese criterio se eligieron seis áreas:

| Área | Por qué se prueba |
|---|---|
| **Cálculos del carrito** (`useCarrito`) | Es la lógica más densa del proyecto. Un error acá muestra totales equivocados al cliente. |
| **Validaciones del formulario de compra** | Vienen de la primera entrega y son requisito de la evaluación. Si dejan pasar un RUT mal escrito, el pedido queda inservible. |
| **Control de acceso** (`RutaPrivada`) | Si falla, el Panel de Control queda abierto a cualquiera. |
| **Filtro del catálogo** | Es la funcionalidad con más posibilidades de error silencioso: no revienta, simplemente no encuentra lo que debería. |
| **Favoritos** | Tiene un ciclo de ida y vuelta (marcar / desmarcar) que conviene verificar entero. |
| **Quién puede comprar** | Es una regla de negocio, no un detalle visual: el administrador no compra, el cliente compra con sus datos guardados y el invitado debe escribirlos. |
| **Utilidades de formato y texto** | Son funciones pequeñas usadas en muchos lugares; un fallo se propaga a todo el sitio. |

Quedan **fuera** del alcance: los estilos CSS, el comportamiento
responsivo y el detalle visual de cada página, porque se verifican
mirando la aplicación y no con pruebas unitarias.

## 2. Estrategia

Todas las pruebas siguen el patrón **AAA**:

- **Arrange** — se prepara el escenario: props, datos de mentira, espías.
- **Act** — se ejecuta una sola acción: un clic, un cambio de campo, una llamada.
- **Assert** — se comprueba un resultado observable.

Decisiones técnicas que se repiten en varios archivos:

- **`vi.fn()`** crea funciones espía. Permiten comprobar que un
  componente avisa hacia arriba sin montar la aplicación completa.
- **`vi.spyOn(window, 'alert')`** reemplaza el `alert` del navegador.
  jsdom no lo implementa, y así la prueba puede leer el mensaje exacto.
- **`vi.setSystemTime()`** congela la fecha en las pruebas de edad. Sin
  eso, la prueba daría un resultado distinto cada año y terminaría
  fallando sola.
- **`renderHook` + `act()`** permiten probar los hooks sin interfaz.
- **`MemoryRouter`** envuelve a los componentes que usan `<Link>` o
  `useParams`, que fuera de un router lanzan error.

## 3. Cómo ejecutarlas

```
npm install
npm test          # modo interactivo, se queda escuchando cambios
npm run test:run  # una sola pasada, útil para dejar evidencia
```

## 4. Casos de prueba

| ID | Componente<br>*(describe)* | Caso de Prueba<br>*(it / test)* | Preparación<br>*(Arrange)* | Acción<br>*(Act)* | Resultado Esperado<br>*(Assert)* | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-001 | formatearPrecio | Agrega el signo peso y el separador de miles | El número 34990 | Llamar a `formatearPrecio(34990)` | Devuelve `"$34.990"` | Pasa |
| PU-002 | formatearPrecio | Funciona con montos de seis cifras | El número 129990 | Llamar a `formatearPrecio(129990)` | Devuelve `"$129.990"` | Pasa |
| PU-003 | normalizar | Quita tildes y pasa a minúsculas | El texto `"Cámara Espectro Completo"` | Llamar a `normalizar(texto)` | Devuelve `"camara espectro completo"` | Pasa |
| PU-004 | normalizar | Un texto sin tildes solo baja a minúsculas | El texto `"Spirit Box"` | Llamar a `normalizar(texto)` | Devuelve `"spirit box"` | Pasa |
| PU-005 | calcularEdad | Calcula la edad cuando el cumpleaños ya pasó | Reloj congelado en 21-10-2026; nacimiento 20-05-2000 | Llamar a `calcularEdad("2000-05-20")` | Devuelve `26` | Pasa |
| PU-006 | calcularEdad | Resta un año si el cumpleaños no ha llegado | Reloj congelado en 21-10-2026; nacimiento 31-12-2000 | Llamar a `calcularEdad("2000-12-31")` | Devuelve `25`, no 26 | Pasa |
| PU-007 | useCarrito | El carrito parte vacío | Montar el hook con `renderHook` | Ninguna | `items` vacío, `totalUnidades` y `totalPrecio` en 0 | Pasa |
| PU-008 | useCarrito | Agregar dos veces el mismo producto sube la cantidad | Hook montado y un `productoMock` | Llamar a `agregar(producto)` dos veces dentro de `act()` | Una sola línea con `cantidad: 2` y `totalUnidades: 2` | Pasa |
| PU-009 | useCarrito | El total multiplica precio por cantidad | Hook montado; producto de valor 10.000 | `agregar(producto)` y `cambiarCantidad(id, 3)` | `totalPrecio` es `30000` | Pasa |
| PU-010 | useCarrito | Bajar la cantidad a cero saca el producto | Hook montado con un producto agregado | `cambiarCantidad(id, 0)` | `items` queda vacío | Pasa |
| PU-011 | useFavoritos | Alternar marca y desmarca el mismo producto | Hook montado, sin favoritos | `alternar("spirit-box")` dos veces | Primero `esFavorito` es `true` y `total` 1; luego `false` y 0 | Pasa |
| PU-012 | TarjetaProducto | Avisa el producto al agregarlo al carro | Espía `alAgregar` y un `productoMock`, dentro de `MemoryRouter` | Clic en el botón "Agregar al carro" | `alAgregar` llamado una vez, con el producto completo | Pasa |
| PU-013 | TarjetaProducto | El botón de favoritos refleja su estado | Tarjeta renderizada con `esFavorito` en `true` | Ninguna, se revisa el render inicial | Existe el botón "★ Guardado en favoritos" | Pasa |
| PU-014 | BotonFavorito | Llama a `alAlternar` al hacer clic | Espía `alAlternar`, botón en estado inactivo | Clic en "☆ Agregar a favoritos" | `alAlternar` llamado una vez | Pasa |
| PU-015 | GaleriaProductos | Dibuja una tarjeta por producto | Lista de tres productos con id distinto | Renderizar la galería | Hay 3 botones "Agregar al carro" y se ve "Equipo Dos" | Pasa |
| PU-016 | GaleriaProductos | Avisa cuando la lista llega vacía | Lista vacía | Renderizar la galería | Aparece "No encontramos equipos..." y ningún botón de carro | Pasa |
| PU-017 | FormularioCompra | Acepta el texto escrito en Nombre | Formulario montado con un catálogo mínimo | `fireEvent.change` sobre el campo Nombre con "Pepito" | El campo tiene el valor "Pepito" | Pasa |
| PU-018 | FormularioCompra | Rechaza un nombre con números | `alert` espiado; nombre "Pepito123" | Enviar el formulario | `alert` recibe "El nombre solo debe contener letras y espacios." | Pasa |
| PU-019 | FormularioCompra | Rechaza un RUT con puntos | Nombre válido y RUT "12.345.678-9" | Enviar el formulario | `alert` recibe el mensaje de formato de RUT | Pasa |
| PU-020 | FormularioCompra | Rechaza un correo de dominio no permitido | Nombre y RUT válidos; correo "diego@yahoo.com" | Enviar el formulario | `alert` recibe un mensaje que contiene "dominio permitido" | Pasa |
| PU-021 | FormularioLogin | Avisa si la contraseña es muy corta | Espía `alEnviar`; correo válido y clave "123" | Clic en "Entrar" | Se muestra el error en pantalla y `alEnviar` NO se llama | Pasa |
| PU-022 | FormularioLogin | Muestra el mensaje que devuelve el intento | `alEnviar` simulado devolviendo `{ ok: false, mensaje }` | Clic en "Entrar" con datos de forma correcta | `alEnviar` recibe correo y clave; se muestra "La contraseña no coincide." | Pasa |
| PU-023 | RutaPrivada | Sin sesión redirige al login | Router con las rutas `/panel`, `/login` y `/perfil`; `autenticado: false` | Entrar a `/panel` | Se ve la página de login, no el contenido del panel | Pasa |
| PU-024 | RutaPrivada | Con sesión pero sin permiso redirige al perfil | `autenticado: true`, `permitido: false` | Entrar a `/panel` | Se ve la página de perfil, no el contenido del panel | Pasa |
| PU-025 | RutaPrivada | Con sesión y permiso deja pasar | `autenticado: true`, `permitido: true` | Entrar a `/panel` | Se ve "Contenido del panel" | Pasa |
| PU-026 | Página Productos | Muestra los doce equipos al entrar | Catálogo real y hooks simulados, dentro de `MemoryRouter` | Renderizar la página | Hay 12 botones de carro y el texto "Mostrando 12 de 12 equipos" | Pasa |
| PU-027 | Página Productos | El buscador filtra sin escribir tildes | Página montada con el catálogo completo | Escribir "camara" (sin tilde) en el buscador | Quedan las dos cámaras, desaparece "Spirit Box", y el contador dice 2 de 12 | Pasa |

| PU-028 | TarjetaProducto | No ofrece el botón de carro a quien no puede comprar | Tarjeta con `puedeComprar` en `false` | Ninguna, se revisa el render | No existe "Agregar al carro", pero sí el botón de favoritos | Pasa |
| PU-029 | FormularioCompra | No deja comprar con el carro vacío | Formulario con un carro de 0 unidades | Enviar el formulario | `alert` recibe "Debes agregar al menos un equipo al carro antes de comprar." | Pasa |
| PU-030 | FormularioCompra | Ya no pregunta qué producto ni cuántas unidades | Formulario en modo invitado | Ninguna, se revisa el render | No existen los campos "Seleccione producto" ni "Cantidad" | Pasa |
| PU-031 | FormularioCompra | Con sesión no vuelve a pedir los datos personales | Formulario con la ficha de un cliente | Ninguna, se revisa el render | No hay campos de nombre ni RUT; se ve "Comprando como" y la dirección guardada | Pasa |
| PU-032 | FormularioCompra | Al cliente igual le exige los datos del pedido | Cliente con sesión, sin elegir tipo de investigación | Enviar el formulario | `alert` pide el tipo de investigación | Pasa |
| PU-033 | Página Carrito | El administrador no puede comprar | `auth` con `esAdmin` en `true` | Renderizar la página | Se ve "COMPRAS NO DISPONIBLES" y no existe el formulario | Pasa |
| PU-034 | Página Carrito | El invitado ve el formulario completo | `auth` sin sesión | Renderizar la página | Existe el formulario y pide el nombre completo | Pasa |
| PU-035 | Página Carrito | El cliente ve el formulario corto | `auth` con sesión de cliente | Renderizar la página | Existe el formulario, sin campo de nombre, con la ficha "Comprando como" | Pasa |
| PU-036 | Página Carrito | Con el carro vacío no se muestra el formulario | Carro con `estaVacio` en `true` | Renderizar la página | No existe el formulario; se ve "Nada que comprar todavía" | Pasa |
| PU-037 | useCarrito | No deja pasar del tope de unidades por línea | Hook con un producto agregado | `cambiarCantidad(id, 500)` | La cantidad queda en `MAX_POR_LINEA` (99) | Pasa |
| PU-038 | useCarrito | `estaVacio` refleja si hay equipos en el carro | Hook recién montado | Agregar un producto | Pasa de `true` a `false` | Pasa |

### Limitaciones conocidas — estas pruebas fallan a propósito

| ID | Componente | Caso de Prueba | Preparación | Acción | Resultado Esperado | Estado |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| PU-039 | useCarrito | El carro debería sobrevivir a la recarga | Hook montado con un equipo agregado | Montar un hook nuevo, que equivale a recargar | El carro debería conservar el equipo | **Falla (intencional)** |
| PU-040 | useCatalogo | Los equipos creados en el Panel deberían persistir | Hook montado; se crea un equipo nuevo | Montar un hook nuevo | El catálogo debería conservar el equipo creado | **Falla (intencional)** |
| PU-041 | useAuth | Las contraseñas no deberían guardarse legibles | Hook montado; se registra una cuenta | Leer `localStorage` | La contraseña no debería aparecer tal cual | **Falla (intencional)** |

## 5. Resultado de la ejecución

```
 Test Files  1 failed | 13 passed (14)
      Tests  3 failed | 38 passed (41)
```

El reporte está configurado como `verbose`, así que lista una por una
las 41 pruebas con su nombre completo, marcando cada una con ✓ o ×, y
para las que fallan imprime el motivo:

```
× PU-039 (INTENCIONAL): el carro debería sobrevivir a la recarga
  → El carro se vacía al recargar: useCarrito guarda su estado en
    memoria y no en localStorage: expected +0 to be 1
× PU-040 (INTENCIONAL): los equipos creados en el Panel deberían persistir
  → El catálogo vuelve a su estado original al recargar: useCatalogo
    no persiste los cambios: expected [...] to have a length of 13
    but got 12
× PU-041 (INTENCIONAL): las contraseñas no deberían guardarse legibles
  → La contraseña se guarda tal cual en localStorage: un proyecto sin
    servidor no puede protegerla de verdad: expected true to be false
```

## 5.1 Dos tipos de prueba que conviene no confundir

**Pruebas de rechazo (pasan).** Comprueban que el sistema dice que no
cuando corresponde: un RUT con puntos, un correo de dominio no
permitido, un menor de edad, un administrador intentando comprar. Si
PU-019 apareciera en rojo significaría que el formulario ACEPTÓ el RUT
mal escrito, o sea que el sistema está roto. Son PU-018, PU-019,
PU-020, PU-029, PU-032 y PU-033, y están todas en verde.

**Pruebas de limitación conocida (fallan).** Están escritas contra el
comportamiento ideal, no contra el actual. Documentan algo que el
sistema todavía no hace, por qué no lo hace y qué haría falta para
resolverlo. Son PU-039, PU-040 y PU-041.

El valor de dejarlas dentro de la batería, y no borrarlas, es que
quedan a la vista en cada ejecución: nadie puede olvidar la limitación.
Y el día que la funcionalidad se implemente, la prueba pasa a verde
sola y deja de ser una limitación.

## 6. Verificaciones hechas fuera de Vitest

El comportamiento responsivo no se presta para pruebas unitarias, así
que se verificó en el navegador a cuatro anchos. En ninguno aparece
scroll horizontal.

| Ancho | Catálogo | Barra de filtros | Menú | Botones del formulario |
|---|---|---|---|---|
| 1100px | 3 columnas | en fila | una línea | en fila |
| 760px | 2 columnas | en fila | una línea | en fila |
| 600px | 2 columnas | en fila | una línea | en fila |
| 420px | 1 columna | apilada | dos líneas | apilados |

A esto se suman la fila del carrito, que se reacomoda bajo los 600px, y
la tabla del Panel de Control, que pasa de cuatro columnas a dos filas
bajo los 760px.
