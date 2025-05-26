import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

import Jugadores from './pages/Jugadores';
import Rankings from './pages/Rankings';
import Calendario from './pages/Calendario';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import AgregarJugadorIndividual from './pages/AgregarJugadorIndividual';
import DetalleJugador from './pages/DetalleJugador';
import AdminLavados from './pages/AdminLavados';
import EditarPartido from './pages/EditarPartido';

function AppWrapper() {
  const navigate = useNavigate();
  const [logeado, setLogeado] = useState(false);

  useEffect(() => {
    setLogeado(localStorage.getItem('token') === 'admin-token');
  }, []);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setLogeado(false);
    navigate('/');
  };

  return (
    <>
      {/* Barra de navegación */}
      <nav className="bg-orange-600 text-white px-6 py-4 flex flex-wrap gap-4 items-center">
        <Link to="/" className="hover:underline">Jugadores</Link>
        <Link to="/rankings" className="hover:underline">Rankings</Link>
        <Link to="/calendario" className="hover:underline">Calendario</Link>

        {logeado ? (
          <>
            <Link to="/admin" className="hover:underline">Cargar partido</Link>
            <Link to="/agregar-jugador" className="hover:underline">Agregar Jugador</Link>
            <Link to="/lavados" className="hover:underline">Agregar Lavado</Link>
            <Link to="/editar-partido" className="hover:underline">Editar Partido</Link>
            <button
              onClick={cerrarSesion}
              className="ml-auto text-sm bg-white text-orange-700 px-3 py-1 rounded hover:bg-orange-100"
            >
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login" className="ml-auto hover:underline">Login</Link>
        )}
      </nav>

      {/* Rutas */}
      <Routes>
        <Route path="/" element={<Jugadores />} />
        <Route path="/rankings" element={<Rankings />} />
        <Route path="/calendario" element={<Calendario />} />
        <Route path="/jugador/:id" element={<DetalleJugador />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <PrivateRoute>
            <AdminPanel />
          </PrivateRoute>
        } />
        <Route
          path="/agregar-jugador"
          element={
            <PrivateRoute>
              <AgregarJugadorIndividual />
            </PrivateRoute>
          }
        />
        <Route path="/lavados" element={
          <PrivateRoute>
            <AdminLavados />
          </PrivateRoute>
        } />
        <Route path="/editar-partido" element={
          <PrivateRoute>
            <EditarPartido />
          </PrivateRoute>
        } />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
