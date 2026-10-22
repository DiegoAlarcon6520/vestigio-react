import { Link } from 'react-router-dom';

import Encabezado from '../organisms/Encabezado';
import Seccion from '../molecules/Seccion';
import { formatearPrecio } from '../utils/formato';

/* PÁGINA: Mi Perfil
   Muestra los datos de la sesión y un resumen de la actividad del
   usuario: sus favoritos y su carro.

   Acá se ve para qué sirvieron los favoritos de la Fase 2: se guardan
   solo los id, así que para mostrar los nombres hay que cruzarlos con
   el catálogo. */
function Perfil({ auth, favoritos, carrito, catalogo }) {

  /* Se recorre la lista de id guardados y, por cada uno, se busca el
     producto en el catálogo. filter(Boolean) descarta los que no se
     encontraron, por ejemplo si el administrador eliminó un producto
     que alguien tenía marcado. */
  const productosFavoritos = favoritos.ids
    .map((id) => catalogo.buscarPorId(id))
    .filter(Boolean);

  return (
    <>
      <Encabezado
        titulo="MI PERFIL"
        subtitulo={auth.usuario.nombre}
      />

      <Seccion titulo="Datos de la cuenta">
        <p>Nombre: {auth.usuario.nombre}</p>
        <p>Correo: {auth.usuario.email}</p>
        <p>Tipo de cuenta: {auth.usuario.rol === 'admin' ? 'Administrador' : 'Cliente'}</p>

        {/* Estos datos solo existen en las cuentas creadas desde el
            registro: la del administrador no los tiene, por eso se
            dibujan únicamente si están presentes. */}
        {auth.usuario.rut && (
          <>
            <p>RUT: {auth.usuario.rut}</p>
            <p>Teléfono: {auth.usuario.fono}</p>
            <p>Despacho: {auth.usuario.direccion}, {auth.usuario.comuna}</p>
            <p className="nota-formulario">
              Estos son los datos con los que se completan tus compras.
            </p>
          </>
        )}

        {/* El Panel solo se ofrece a quien puede entrar. */}
        {auth.esAdmin && (
          <p><Link to="/panel">Ir al Panel de Control →</Link></p>
        )}

        <button className="btn-limpiar" onClick={auth.cerrarSesion}>
          Cerrar sesión
        </button>
      </Seccion>

      {/* El perfil de investigador: los campos propios de Vestigio que
          se piden al registrarse. */}
      {auth.usuario.perfil && (
        <Seccion titulo="Perfil de investigador">
          <p>Tipo de investigador: {auth.usuario.perfil}</p>
          <p>Nivel de experiencia: {auth.usuario.experiencia}</p>
          <p>Fenómeno de interés: {auth.usuario.fenomeno}</p>
          <p>Equipamiento actual: {auth.usuario.equipamiento}</p>
        </Seccion>
      )}

      <Seccion titulo={'Mis favoritos (' + productosFavoritos.length + ')'}>
        {productosFavoritos.length === 0 ? (
          <p>
            Todavía no marcaste ningún equipo.{' '}
            <Link to="/productos">Explora el catálogo →</Link>
          </p>
        ) : (
          <ul className="lista-perfil">
            {productosFavoritos.map((producto) => (
              <li key={producto.id}>
                <Link to={'/productos/' + producto.id}>{producto.nombre}</Link>
                {' — '}{producto.precio}
              </li>
            ))}
          </ul>
        )}
      </Seccion>

      <Seccion titulo="Mi carro">
        {carrito.items.length === 0 ? (
          <p>
            Tu carro está vacío.{' '}
            <Link to="/productos">Ver el catálogo →</Link>
          </p>
        ) : (
          <>
            <p>
              {carrito.totalUnidades} artículos por un total de{' '}
              {formatearPrecio(carrito.totalPrecio)}.
            </p>
            <p><Link to="/carrito">Ir a pagar →</Link></p>
          </>
        )}
      </Seccion>
    </>
  );
}

export default Perfil;
