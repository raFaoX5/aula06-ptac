import { useEffect, useRef, useState } from "react";
import FormUsuario from "./FormUsuario";
import { API, JSON_HEADERS, requisitar } from "./api";

function ItemUsuario({ usuario, ocupado, erro, onEditar, onExcluir }) {
  return (
    <li>
      {usuario.name} — {usuario.email}{' '}
      <button onClick={() => onEditar(usuario)} disabled={ocupado}>Editar</button>{' '}
      <button onClick={() => onExcluir(usuario.id)} disabled={ocupado}>Excluir</button>
      {ocupado && <span> Excluindo...</span>}
      {erro && <p>Erro: {erro}</p>}
    </li>
  );
}

export default function CrudUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erroLista, setErroLista] = useState(null);

  const [form, setForm] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erroForm, setErroForm] = useState(null);

  const [ocupados, setOcupados] = useState({});
  const [errosItem, setErrosItem] = useState({});

  const controles = useRef(new Set());

  function novoControle() {
    const c = new AbortController();
    controles.current.add(c);
    return c;
  }

  useEffect(() => {
    const pendentes = controles.current;
    return () => {
      pendentes.forEach((c) => c.abort());
      pendentes.clear();
    };
  }, []);

  useEffect(() => {
    const controle = new AbortController();
    async function carregar() {
      try {
        setUsuarios(await requisitar(API, { signal: controle.signal }));
      } catch (e) {
        if (e.name !== 'AbortError') setErroLista(e.message);
      } finally {
        if (!controle.signal.aborted) setCarregando(false);
      }
    }
    carregar();
    return () => controle.abort();
  }, []);

  async function criar(dados) {
    const controle = novoControle();
    setEnviando(true);
    setErroForm(null);
    try {
      const resposta = await requisitar(API, {
        method: 'POST',
        headers: JSON_HEADERS,
        body: JSON.stringify(dados),
        signal: controle.signal,
      });
      setUsuarios((atual) => {
        const proximo = Math.max(0, ...atual.map((u) => u.id)) + 1;
        return [...atual, { ...resposta, id: proximo }];
      });
      setForm(null);
    } catch (e) {
      if (e.name !== 'AbortError') setErroForm(e.message);
    } finally {
      controles.current.delete(controle);
      if (!controle.signal.aborted) setEnviando(false);
    }
  }

  async function atualizar(dados) {
    const original = form.usuario;
    const controle = novoControle();
    setEnviando(true);
    setErroForm(null);
    try {
      const resposta = await requisitar(`${API}/${original.id}`, {
        method: 'PUT',
        headers: JSON_HEADERS,
        body: JSON.stringify({ ...original, ...dados }),
        signal: controle.signal,
      });
      setUsuarios((atual) =>
        atual.map((u) => (u.id === original.id ? { ...u, ...resposta } : u))
      );
      setForm(null);
    } catch (e) {
      if (e.name !== 'AbortError') setErroForm(e.message);
    } finally {
      controles.current.delete(controle);
      if (!controle.signal.aborted) setEnviando(false);
    }
  }

  async function excluir(id) {
    const anterior = usuarios;
    const controle = novoControle();
    setErrosItem((e) => ({ ...e, [id]: null }));
    setOcupados((o) => ({ ...o, [id]: true }));
    setUsuarios((atual) => atual.filter((u) => u.id !== id));
    try {
      await requisitar(`${API}/${id}`, { method: 'DELETE', signal: controle.signal });
      console.log(`Usuário ${id} excluído`);
    } catch (e) {
      if (e.name !== 'AbortError') {
        setUsuarios(anterior);
        setErrosItem((er) => ({ ...er, [id]: e.message }));
      }
    } finally {
      controles.current.delete(controle);
      if (!controle.signal.aborted) {
        setOcupados((o) => ({ ...o, [id]: false }));
      }
    }
  }

  if (carregando) return <p>Carregando lista...</p>;
  if (erroLista) return <p>Erro: {erroLista}</p>;

  return (
    <div>
      <h2>CRUD de usuários (Exercício 5)</h2>
      <button onClick={() => { setErroForm(null); setForm({}); }} disabled={enviando}>
        Novo
      </button>

      {form && (
        <FormUsuario
          key={form.usuario ? form.usuario.id : 'novo'}
          inicial={form.usuario}
          rotulo={form.usuario ? 'Salvar alterações' : 'Cadastrar'}
          enviando={enviando}
          erro={erroForm}
          onSalvar={form.usuario ? atualizar : criar}
          onCancelar={() => setForm(null)}
        />
      )}

      <ul>
        {usuarios.map((u) => (
          <ItemUsuario
            key={u.id}
            usuario={u}
            ocupado={!!ocupados[u.id]}
            erro={errosItem[u.id]}
            onEditar={(usuario) => { setErroForm(null); setForm({ usuario }); }}
            onExcluir={excluir}
          />
        ))}
      </ul>
    </div>
  );
}
