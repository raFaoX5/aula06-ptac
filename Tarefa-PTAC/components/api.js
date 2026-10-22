export const API = 'https://jsonplaceholder.typicode.com/users';

export const JSON_HEADERS = { 'Content-Type': 'application/json' };

export async function requisitar(url, opcoes) {
  const resp = await fetch(url, opcoes);
  if (!resp.ok) throw new Error(`Erro HTTP: ${resp.status}`);
  return resp.json();
}
