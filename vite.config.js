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
  },
})
