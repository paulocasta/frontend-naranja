import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        navigate('/admin'); // o donde desees redirigir
      } else {
        setMensaje('❌ Usuario o contraseña incorrectos');
      }
    } catch (err) {
      setMensaje('❌ Error al conectar con el servidor');
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex justify-center items-center p-4">
      <form onSubmit={handleLogin} className="bg-white shadow-lg p-6 rounded-xl max-w-sm w-full space-y-4">
        <h1 className="text-xl font-bold text-orange-700 text-center">Iniciar sesión</h1>

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded font-semibold">
          Ingresar
        </button>

        {mensaje && <p className="text-sm text-center text-red-600">{mensaje}</p>}
      </form>
    </div>
  );
};

export default Login;
