import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import Hero from '../organisms/Hero';
import Seccion from '../molecules/Seccion';

/* PÁGINA: Index
   Equivale al index.html del sitio original: la portada con la imagen
   central y las tres secciones de texto (bienvenida, sobre nosotros y
   contacto). El contenido es palabra por palabra el mismo.

   El único agregado es el efecto de abajo. En el sitio estático el
   enlace "Contacto" era un ancla normal (index.html#contacto) y el
   navegador bajaba solo. Con el router eso no ocurre: cambiar la URL no
   mueve la página. Entonces leemos el # con useLocation y hacemos el
   scroll a mano.

   useEffect ejecuta ese código después de que la página se dibuja. El
   arreglo [location] del final indica cuándo repetirlo: cada vez que
   cambie la ubicación. Sin ese arreglo se ejecutaría en cada render. */
function Index() {

  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      /* location.hash llega como "#contacto"; substring(1) le quita
         el # para poder buscar el id "contacto". */
      const destino = document.getElementById(location.hash.substring(1));
      if (destino) destino.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  return (
    <>
      <Hero
        titulo="VESTIGIO"
        subtitulo="Equipos para quienes buscan lo que otros no ven"
      />

      {/* BIENVENIDA */}
      <Seccion titulo="Bienvenidos a nuestra tienda">
        <p>
          En Vestigio encontrarás instrumentos y accesorios diseñados para la
          investigación de fenómenos paranormales: detectores de campo
          electromagnético, cámaras de espectro completo, grabadoras EVP y
          mucho más.
        </p>
      </Seccion>

      {/* SOBRE NOSOTROS */}
      <Seccion titulo="Sobre nosotros">
        <p>
          Somos una tienda online exclusiva, especializada en la venta de
          equipamiento para investigación paranormal. Todos nuestros productos
          son seleccionados con altos estándares de calidad y confiabilidad,
          para que cuentes con las herramientas adecuadas en tu propia
          experiencia de investigación paranormal.
        </p>
      </Seccion>

      {/* CONTACTO */}
      <Seccion id="contacto" titulo="Contacto">
        <p>¿Tienes dudas sobre nuestros equipos? Escríbenos.</p>
        <p>Correo: contacto@vestigio.cl</p>
        <p>Instagram: @vestigio.paranormal</p>
      </Seccion>
    </>
  );
}

export default Index;
