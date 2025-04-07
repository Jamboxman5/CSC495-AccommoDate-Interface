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
      return [data.token, data.id ];
}

export function storeToken(token: string) { localStorage.setItem('jwt', token); }
export function getToken(): string | null { return localStorage.getItem('jwt'); }

  export function logout() { localStorage.removeItem('jwt'); } 
  