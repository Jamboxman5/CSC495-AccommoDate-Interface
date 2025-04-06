import { useState } from 'react';

export default function MyApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [userID, setUserID] = useState<string | null>(null);

  const handleLogin = async() => {
    try {
      if (!email.endsWith("@oswego.edu")) {
        alert("Please use your Oswego email address!");
        return;
      }

      const username = email.split("@")[0];

      console.log('Sending request to login:', {
        email: email.split('@')[0],
        password
      });

      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: username, password })
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || 'Login failed!');
      }

      const data = await response.json();
      setToken(data.token);
      setUserID(data.id)
      localStorage.setItem('jwt', data.token);
      localStorage.setItem('userID', data.id);
      alert('Login successful!');

    } catch (err) {
      const username = email.split("@")[0];

      console.error('Login error: ', err);
      // alert(JSON.stringify({ email: username, password }));
      alert(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Your Oswego Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
    />
    <br />
    <input
      type="password"
      placeholder='Password'
      value={password}
      onChange={e => setPassword(e.target.value)}
      />
      <br/>
      <button onClick={handleLogin}>Login</button>

    {token && (
      <p style={{ marginTop: '1rem' }}>
        <strong>Token:</strong> {token}
      </p>
    )}
</div>
  );
}


