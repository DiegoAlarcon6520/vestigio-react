import hero from '../assets/img/hero.png';

import TituloPrincipal from '../atoms/TituloPrincipal';
import Subtitulo from '../atoms/Subtitulo';

/* ORGANISMO: Hero
   La portada de la página de inicio: el <section id="inicio"> con el
   nombre de la tienda, la bajada y la imagen central.

   Va separado del Header porque el Header se muestra en las cuatro
   páginas y esta portada es exclusiva del inicio.

   La imagen se importa en vez de escribir la ruta como texto. Vite
   necesita ese import para incluir el archivo en la compilación y
   reemplazarlo por la ruta final; un src="img/hero.png" escrito a mano
   funcionaría en desarrollo pero quedaría roto al compilar. */
function Hero({ titulo, subtitulo }) {
  return (
    <section id="inicio">

      <TituloPrincipal texto={titulo} />
      <Subtitulo texto={subtitulo} />

      <img
        className="imagen-central"
        src={hero}
        alt="Huellas y lupa de investigación paranormal, estilo visión nocturna"
      />

    </section>
  );
}

export default Hero;
