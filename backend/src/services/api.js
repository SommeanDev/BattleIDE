// src/services/api.js
export async function submitCode({ source_code, language_id, stdin }) {
  const response = await fetch('http://localhost:4000/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_code, language_id, stdin }),
  });
  return response.json();
}