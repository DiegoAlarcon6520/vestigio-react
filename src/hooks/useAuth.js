import { useState } from 'react';

/* ==========================================================
   HOOK: useAuth
   ==========================================================
   Maneja la sesión del usuario: quién inició sesión, cómo entra y
   cómo sale.

   A diferencia del carrito o los favoritos, la sesión se guarda en
   localStorage. La diferencia importa:

     useState      vive en la memoria de la página. Si el usuario
                   recarga (F5), se pierde.
     localStorage  vive en el navegador. Sobrevive a la recarga y a
                   cerrar la pestaña.

   Una sesión tiene que sobrevivir a la recarga, por eso va en
   localStorage. El carrito, al ser una demostración, se deja en
   memoria a propósito.

   localStorage solo guarda TEXTO, así que para guardar un objeto hay
   que convertirlo con JSON.stringify y recuperarlo con JSON.parse.
   ========================================================== */

/* Las llaves con que se guardan los datos. Se definen como constantes
   para no escribirlas a mano en cada lugar y arriesgar una errata. */
const LLAVE_SESION = 'vestigio-sesion';
const LLAVE_USUARIOS = 'vestigio-usuarios';

/* Credenciales fijas del administrador, como pide la evaluación.
   En un sistema real esto JAMÁS iría en el código del navegador: la
   contraseña se verifica en el servidor. Acá es una simulación. */
const ADMIN = {
  email: 'admin@vestigio.cl',
  password: 'vestigio123',
  nombre: 'Administrador Vestigio',
  rol: 'admin'
};


/* Lee una llave de localStorage y la convierte a objeto.
   Va dentro de un try porque si el texto guardado está corrupto,
   JSON.parse lanza un error y rompería toda la aplicación. */
function leerDeStorage(llave, porDefecto) {
  try {
    const texto = localStorage.getItem(llave);
    return texto ? JSON.parse(texto) : porDefecto;
  } catch {
    return porDefecto;
  }
}


export function useAuth() {

  /* El valor inicial se pasa como FUNCIÓN y no como valor directo.
     Escrito así, React la ejecuta una sola vez al montar el
     componente; si se pasara leerDeStorage(...) sin envolver, se
     leería el localStorage en cada render sin necesidad. */
  const [usuario, setUsuario] = useState(() => leerDeStorage(LLAVE_SESION, null));

  /* Lista de cuentas creadas desde la página de Registro. */
  const [usuarios, setUsuarios] = useState(() => leerDeStorage(LLAVE_USUARIOS, []));


  /* ----- INICIAR SESIÓN -----
     Devuelve un objeto { ok, mensaje } en vez de solo true/false, para
     que la página de login pueda mostrar el motivo exacto del rechazo. */
  const iniciarSesion = (email, password) => {

    const correo = email.trim().toLowerCase();

    /* Primero se prueba con el administrador fijo.
       Se comprueba el correo y la contraseña por separado: si el correo
       es el del administrador pero la clave está mal, hay que decir
       justamente eso, y no "no existe esa cuenta". */
    if (correo === ADMIN.email) {
      if (password !== ADMIN.password) {
        return { ok: false, mensaje: 'La contraseña no coincide.' };
      }
      const sesion = { email: ADMIN.email, nombre: ADMIN.nombre, rol: ADMIN.rol };
      localStorage.setItem(LLAVE_SESION, JSON.stringify(sesion));
      setUsuario(sesion);
      return { ok: true };
    }

    /* Si no, se busca entre las cuentas registradas. */
    const encontrado = usuarios.find((u) => u.email === correo);

    if (!encontrado) {
      return { ok: false, mensaje: 'No existe una cuenta con ese correo.' };
    }

    if (encontrado.password !== password) {
      return { ok: false, mensaje: 'La contraseña no coincide.' };
    }

    /* La sesión guarda la ficha completa menos la contraseña, para que
       el formulario de compra pueda rellenarse con esos datos sin tener
       que volver a buscarlos. El destructuring separa password del
       resto; "password" queda sin usar a propósito. */
    const { password: _, ...ficha } = encontrado;
    const sesion = ficha;
    localStorage.setItem(LLAVE_SESION, JSON.stringify(sesion));
    setUsuario(sesion);
    return { ok: true };
  };


  /* ----- REGISTRAR UNA CUENTA NUEVA ----- */
  const registrar = (datos) => {

    const correo = datos.email.trim().toLowerCase();

    if (correo === ADMIN.email || usuarios.some((u) => u.email === correo)) {
      return { ok: false, mensaje: 'Ya existe una cuenta con ese correo.' };
    }

    /* rol "cliente": solo el administrador entra al Panel de Control. */
    const nuevo = { ...datos, email: correo, rol: 'cliente' };
    const actualizados = [...usuarios, nuevo];

    setUsuarios(actualizados);
    localStorage.setItem(LLAVE_USUARIOS, JSON.stringify(actualizados));

    return { ok: true };
  };


  /* ----- CERRAR SESIÓN ----- */
  const cerrarSesion = () => {
    localStorage.removeItem(LLAVE_SESION);
    setUsuario(null);
  };


  /* Dos atajos que las páginas usan para decidir qué mostrar.
     La doble negación (!!) convierte el objeto o el null en true/false. */
  const autenticado = !!usuario;
  const esAdmin = usuario?.rol === 'admin';

  return { usuario, autenticado, esAdmin, iniciarSesion, registrar, cerrarSesion };
}
