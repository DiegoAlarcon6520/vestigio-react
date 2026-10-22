import EnlaceMenu from '../atoms/EnlaceMenu';

/* MOLÉCULA: MenuPrincipal
   Agrupa varios átomos EnlaceMenu dentro del <nav>.

   La lista de enlaces no está escrita acá: llega por props desde App.jsx.
   Así el menú se puede reutilizar o cambiar sin tocar este archivo.

   map() recorre el arreglo y devuelve un EnlaceMenu por cada elemento.
   La prop "key" es obligatoria en React cuando se genera una lista: le
   sirve para saber qué elemento cambió sin volver a dibujarlos todos. */
function MenuPrincipal({ itemsMenu }) {
  return (
    <>
      {itemsMenu.map((item) => (
        <EnlaceMenu
          key={item.destino}
          destino={item.destino}
          texto={item.texto}
        />
      ))}
    </>
  );
}

export default MenuPrincipal;
