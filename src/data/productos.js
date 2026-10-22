/* ==========================================================
   VESTIGIO — Catálogo de productos
   ==========================================================
   En el sitio original los doce productos estaban escritos a mano
   dentro de articulos.html, y repetidos otra vez como <option> en el
   formulario de compra. Si cambiaba un precio había que corregirlo en
   dos lugares.

   Acá viven una sola vez. El catálogo, el detalle de producto y (desde
   la Fase 2) el selector del formulario leen todos de este archivo.

   Cada producto tiene:
     id          texto corto y sin espacios que identifica al producto.
                 Es el que viaja en la URL: /productos/spirit-box
     imagen      la foto, importada arriba para que Vite la incluya
     nombre      el título que se ve en la tarjeta
     descripcion la línea que aparece bajo el nombre
     precio      ya formateado como texto, igual que en el HTML original
     valor       el mismo precio pero como número, para poder sumarlo
                 en el carrito (no se puede sumar "$34.990" como texto)
     valoracion  las estrellas como texto
     alt         el texto alternativo de la imagen, para accesibilidad
   ========================================================== */

/* Las imágenes se importan una por una. Vite las procesa en la
   compilación y reemplaza cada import por la ruta final del archivo. */
import detectorEMF from '../assets/img/productos/detector-emf.png';
import camaraEspectro from '../assets/img/productos/camara-espectro-completo.png';
import grabadoraEVP from '../assets/img/productos/grabadora-evp.png';
import termometro from '../assets/img/productos/termometro-infrarrojo.jpg';
import linterna from '../assets/img/productos/linterna-ultravioleta.jpg';
import microfono from '../assets/img/productos/microfono-direccional.jpg';
import visor from '../assets/img/productos/visor-nocturno.jpg';
import pendulo from '../assets/img/productos/pendulo-investigacion.jpg';
import spiritBox from '../assets/img/productos/spirit-box.jpg';
import camaraTrampa from '../assets/img/productos/camara-trampa-infrarroja.jpg';
import sales from '../assets/img/productos/kit-sales-protectoras.png';
import bitacora from '../assets/img/productos/bitacora-campo.png';


export const productos = [
  {
    id: 'detector-emf',
    imagen: detectorEMF,
    nombre: 'Detector EMF',
    descripcion: 'Mide fluctuaciones del campo electromagnético.',
    precio: '$34.990',
    valor: 34990,
    valoracion: '★★★★☆',
    alt: 'Detector EMF portátil con pantalla de lectura de campo electromagnético'
  },
  {
    id: 'camara-espectro-completo',
    imagen: camaraEspectro,
    nombre: 'Cámara Espectro Completo',
    descripcion: 'Captura registros más allá del espectro visible.',
    precio: '$89.990',
    valor: 89990,
    valoracion: '★★★★★',
    alt: 'Cámara de espectro completo con lente de gran apertura'
  },
  {
    id: 'grabadora-evp',
    imagen: grabadoraEVP,
    nombre: 'Grabadora EVP',
    descripcion: 'Diseñada para capturar fenómenos de voz electrónica.',
    precio: '$27.990',
    valor: 27990,
    valoracion: '★★★★☆',
    alt: 'Grabadora de audio digital para captura de fenómenos de voz electrónica'
  },
  {
    id: 'termometro-infrarrojo',
    imagen: termometro,
    nombre: 'Termómetro Infrarrojo',
    descripcion: 'Detecta variaciones bruscas de temperatura ambiente.',
    precio: '$19.990',
    valor: 19990,
    valoracion: '★★★☆☆',
    alt: 'Termómetro infrarrojo de mano con puntero láser'
  },
  {
    id: 'linterna-ultravioleta',
    imagen: linterna,
    nombre: 'Linterna Ultravioleta',
    descripcion: 'Revela rastros y marcas invisibles a simple vista.',
    precio: '$15.990',
    valor: 15990,
    valoracion: '★★★★☆',
    alt: 'Linterna ultravioleta encendida proyectando luz violeta'
  },
  {
    id: 'microfono-direccional',
    imagen: microfono,
    nombre: 'Micrófono Direccional',
    descripcion: 'Capta sonidos débiles y lejanos con precisión.',
    precio: '$42.990',
    valor: 42990,
    valoracion: '★★★★☆',
    alt: 'Micrófono direccional tipo cañón sobre soporte'
  },
  {
    id: 'visor-nocturno',
    imagen: visor,
    nombre: 'Visor Nocturno',
    descripcion: 'Visión nocturna infrarroja para entornos sin luz.',
    precio: '$129.990',
    valor: 129990,
    valoracion: '★★★★★',
    alt: 'Visor de visión nocturna monocular con lente infrarroja'
  },
  {
    id: 'pendulo-investigacion',
    imagen: pendulo,
    nombre: 'Péndulo de Investigación',
    descripcion: 'Herramienta clásica de exploración dowsing.',
    precio: '$8.990',
    valor: 8990,
    valoracion: '★★★☆☆',
    alt: 'Péndulo de cristal colgando de una cadena metálica'
  },
  {
    id: 'spirit-box',
    imagen: spiritBox,
    nombre: 'Spirit Box',
    descripcion: 'Escaneo de frecuencias de radio en tiempo real.',
    precio: '$54.990',
    valor: 54990,
    valoracion: '★★★★☆',
    alt: 'Spirit box con display de frecuencias de radio'
  },
  {
    id: 'camara-trampa-infrarroja',
    imagen: camaraTrampa,
    nombre: 'Cámara Trampa Infrarroja',
    descripcion: 'Grabación automática activada por movimiento.',
    precio: '$69.990',
    valor: 69990,
    valoracion: '★★★★★',
    alt: 'Cámara trampa infrarroja con carcasa de camuflaje'
  },
  {
    id: 'kit-sales-protectoras',
    imagen: sales,
    nombre: 'Kit de Sales Protectoras',
    descripcion: 'Set tradicional utilizado en rituales de protección.',
    precio: '$12.990',
    valor: 12990,
    valoracion: '★★★★☆',
    alt: 'Frascos de vidrio con sales protectoras y etiquetas'
  },
  {
    id: 'bitacora-campo',
    imagen: bitacora,
    nombre: 'Bitácora de Campo',
    descripcion: 'Cuaderno resistente para registrar cada investigación.',
    precio: '$6.990',
    valor: 6990,
    valoracion: '★★★☆☆',
    alt: 'Cuaderno de tapa dura usado como bitácora de campo'
  }
];

/* Se exporta de las dos formas:
     - con nombre  → import { productos } from '../data/productos'
     - por defecto → import productos from '../data/productos'
   La exportación con nombre es la que usarán las pruebas de Vitest. */
export default productos;
