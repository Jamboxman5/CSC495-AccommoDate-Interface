import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth';

export default function MyApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async() => {
    try {
      if (!email.endsWith("@oswego.edu")) {
        alert("Please use your Oswego email address!");
        return;
      }

      const username = email.split("@")[0];

    //   console.log('Sending request to login:', {
    //     email: email.split('@')[0],
    //     password
    //   });

      const res = await login(username, password);

      localStorage.setItem('jwt', res[0]);
      localStorage.setItem('userID', res[1]);
      navigate('/home');

    } catch (err) {
      const username = email.split("@")[0];

      console.error('Login error: ', err);
      console.log(JSON.stringify({ email: username, password }));
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
</div>
  );
}


