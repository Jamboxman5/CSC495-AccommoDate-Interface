import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, } from '../services/auth';
import "./tailwind.css"
export default function MyApp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
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

      await login(username, password);
      navigate('/home');

    } catch (err) {
      const username = email.split("@")[0];

      console.error('Login error: ', err);
      console.log(JSON.stringify({ email: username, password }));
      alert(err);
    }
  };

  return (
    <div className="bg-gradient-to-br from-indigo-600 to-orange-400 w-screen h-screen flex items-center justify-center min-h-screen bg-gray-200">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-6 text-center text-gray-800">Login</h1>
        <div className="space-y-4">
          <input
            type="email"
            placeholder="Your Oswego Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder='Password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleLogin}
            className="w-full !bg-gradient-to-r from-blue-500 to-indigo-700 hover:text-gray-100 text-white py-2 px-4 rounded-lg hover:!bg-blue-600 transition-colors">Login</button>
        </div>
      </div>
    </div>

  );
}


