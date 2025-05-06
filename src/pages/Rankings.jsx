import { useEffect, useState } from 'react';
import RankingTable from '../components/RankingTable';
import {
  Goal,
  Hand,
  Users,
  CircleAlert,
  CircleSlash
} from 'lucide-react';

const tabs = [
  { id: 'goleadores', label: 'Goleadores', icon: Goal },
  { id: 'asistencias', label: 'Asistencias', icon: Hand },
  { id: 'amarillas', label: 'Amarillas', icon: CircleAlert },
  { id: 'rojas', label: 'Rojas', icon: CircleSlash },
  { id: 'partidos', label: 'Partidos', icon: Users }
];

const Rankings = () => {
  const [activeTab, setActiveTab] = useState('goleadores');
  const [data, setData] = useState({
    goleadores: [],
    asistencias: [],
    amarillas: [],
    rojas: [],
    partidos: []
  });

  useEffect(() => {
    const fetchAll = async () => {
      const endpoints = {
        goleadores: 'goleadores',
        asistencias: 'asistencias',
        amarillas: 'amarillas',
        rojas: 'rojas',
        partidos: 'partidos'
      };

      const results = {};
      for (const key in endpoints) {
        const res = await fetch(`/api/rankings/${endpoints[key]}`);
        results[key] = await res.json();
      }
      setData(results);
    };

    fetchAll();
  }, []);

  const currentTab = tabs.find((t) => t.id === activeTab);
  const currentData = data[activeTab];

  return (
    <div className="min-h-screen bg-orange-50 p-6">
      <h1 className="text-3xl font-bold text-orange-700 text-center mb-6">🏆 Rankings</h1>

      {/* Tabs */}
      <div className="flex flex-wrap justify-center gap-4 mb-8">
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${
              activeTab === id
                ? 'bg-orange-600 text-white border-orange-600'
                : 'bg-white text-orange-700 border-orange-300 hover:bg-orange-100'
            }`}
          >
            <Icon size={16} />
            {label}
          </button>
        ))}
      </div>

      {/* Ranking actual */}
      <div className="flex justify-center">
        <RankingTable
          titulo={currentTab.label}
          icono={currentTab.icon}
          datos={currentData}
          campoValor={currentTab.label}
        />
      </div>
    </div>
  );
};

export default Rankings;
