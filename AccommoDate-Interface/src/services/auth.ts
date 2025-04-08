export async function login(email: string, password: string) {
  const response = await fetch('http://localhost:8080/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Login failed!');
  }

  const data = await response.json();
  storeID(data.id);
  storeToken(data.token);
}

export function storeToken(token: string) { localStorage.setItem('jwt', token); }
export function getToken(): string | null { return localStorage.getItem('jwt'); }
export function storeID(id: string) { localStorage.setItem('userID', id); }
export function getID(): string | null { return localStorage.getItem('userID'); }

export function logout() {
  localStorage.removeItem('jwt');
  localStorage.removeItem('userID');
}

export function getUserRole(): string | null {
  const token = getToken();
  if (!token) return null;

  try {
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload.role || null;
  } catch (e) {
    console.error("Failed to fetch role: ", e);
    return null;
  }
}

