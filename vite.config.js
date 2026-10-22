import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  /* Configuración de Vitest. Va dentro del mismo archivo de Vite para
     que las pruebas usen exactamente las mismas reglas de compilación
     que la aplicación (JSX, imports de imágenes, rutas). */
  test: {
    // Permite usar describe, it y expect sin importarlos en cada archivo
    globals: true,

    // jsdom simula un navegador: da document, window y los eventos.
    // Sin esto, render() no tendría dónde dibujar.
    environment: 'jsdom',

    // Se ejecuta antes de cada archivo de pruebas
    setupFiles: './src/setupTests.js',

    // "verbose" lista UNA POR UNA las pruebas con su nombre completo,
    // en vez de mostrar solo el archivo y cuántas pasaron. Así el
    // reporte sirve como inventario de lo que se está validando.
    reporters: ['verbose'],

    // Todas las pruebas viven dentro de src/, junto al código que
    // verifican. Eso incluye las tres de limitaciones-conocidas.test.jsx,
    // que fallan a propósito y documentan lo que el proyecto todavía
    // no hace: deben aparecer en el mismo reporte que las demás.
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
})
