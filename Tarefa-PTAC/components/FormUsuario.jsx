import { useState } from "react";

export default function FormUsuario({
  inicial = { name: '', email: '' },
  rotulo = 'Salvar',
  enviando = false,
  erro = null,
  onSalvar,
  onCancelar,
}) {
  const [dados, setDados] = useState({ name: inicial.name, email: inicial.email });

  function mudar(e) {
    setDados({ ...dados, [e.target.name]: e.target.value });
  }

  function enviar(e) {
    e.preventDefault();
    onSalvar(dados);
  }

  return (
    <form onSubmit={enviar}>
      <label htmlFor="name">Nome: </label>
      <input id="name" name="name" value={dados.name} onChange={mudar} required />
      <label htmlFor="email"> E-mail: </label>
      <input id="email" name="email" type="email" value={dados.email} onChange={mudar} required />
      <button disabled={enviando}>{rotulo}</button>
      <button type="button" onClick={onCancelar} disabled={enviando}>Cancelar</button>
      {enviando && <p>Enviando...</p>}
      {erro && <p>Erro: {erro}</p>}
    </form>
  );
}
