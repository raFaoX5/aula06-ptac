import { useState } from "react";

export default function NovoUsuario() {
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [enviando, setEnviando] = useState(false);
    const [erro, setErro] = useState(null);
    const [criado, setCriado] = useState(null);

    async function enviar(evento) {
        evento.preventDefault();
        setEnviando(true);
        setErro(null);
        setCriado(null);

        try {
            const resp = await fetch("https://jsonplaceholder.typicode.com/users", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: nome, email: email })
            });
            if (!resp.ok) throw new Error(`Erro HTTP: ${resp.status}`);
            const data = await resp.json();
            setCriado(data);
            setNome('');
            setEmail('');
        } catch (error) {
            setErro(error.message);
        } finally {
            setEnviando(false);
        }
    }

    return (
        <form onSubmit={enviar}>
            <label htmlFor="nome">Nome: </label>
            <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Digite seu nome"
            />
            <label htmlFor="email">E-mail: </label>
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Digite seu e-mail"
            />
            <button disabled={enviando}>Cadastrar </button>
            {enviando && <p>Enviando...</p>}
            {erro && <p>Erro: {erro}</p>}
            {criado && <p>Criado com id={criado.id} e nome = {criado.name}</p>}
        </form>
    );
}
