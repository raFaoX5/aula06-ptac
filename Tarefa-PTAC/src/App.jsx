import { useState } from "react";
import NovoUsuario from "../components/novousuario";
import ListaUsuarios from "../components/ListaUsuarios";
import CrudUsuarios from "../components/CrudUsuarios";

export default function App() {
  const [pagina, setPagina] = useState('lista');

  return (
    <>
      <nav>
        <button onClick={() => setPagina('cadastro')}>Cadastro (Aula 05)</button>{' '}
        <button onClick={() => setPagina('lista')}>Lista (Ex. 1–4)</button>{' '}
        <button onClick={() => setPagina('crud')}>CRUD (Ex. 5)</button>
      </nav>
      {pagina === 'cadastro' && <NovoUsuario />}
      {pagina === 'lista' && <ListaUsuarios />}
      {pagina === 'crud' && <CrudUsuarios />}
    </>
  );
}
