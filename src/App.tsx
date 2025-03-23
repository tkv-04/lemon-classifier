import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import { Admin } from './pages/Admin';
import { ProtectedRoute } from './components/ProtectedRoute';
import { StatCard } from './components/StatCard';
import { CurrentLemonStatus } from './components/CurrentLemonStatus';
import { ConnectionStatus } from './components/ConnectionStatus';
import { ThemeToggle } from './components/ThemeToggle';
import { useLemonData } from './hooks/useLemonData';
import { db } from './firebase';
import { useCollectionData } from 'react-firebase-hooks/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { collection, doc } from 'firebase/firestore';

function Dashboard() {
  const { stats, currentReading, loading, error, connected } = useLemonData();
  /*const [stats] = useCollectionData(collection(db, 'stats'));
  const [currentLemon] = useDocumentData(doc(db, 'current/lemon'));
  const [loading] = useDocumentData(doc(db, 'status/loading'));
  const [error] = useDocumentData(doc(db, 'status/error'));
  const [connected] = useDocumentData(doc(db, 'status/connected'));*/

  // Ensure currentReading is complete
  const completeCurrentReading = currentReading
    ? {
        id: 'default-id',
        status: currentReading.state || 'unripe',
        red: currentReading.red || 0,
        green: currentReading.green || 0,
        blue: currentReading.blue || 0,
        timestamp: currentReading.timestamp || new Date(),
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Lemon Classification System</h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">Real-time monitoring and sorting dashboard</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Ripe Lemons"
            value={stats?.ripe ?? 0}
            type="ripe"
            loading={loading}
          />
          <StatCard
            title="Unripe Lemons"
            value={stats?.unripe ?? 0}
            type="unripe"
            loading={loading}
          />
          <StatCard
            title="Damaged Lemons"
            value={stats?.damaged ?? 0}
            type="damaged"
            loading={loading}
          />
        </div>

        <div className="mb-8">
          <CurrentLemonStatus lemon={completeCurrentReading} loading={loading} />
        </div>

        <ConnectionStatus connected={connected} error={error} />
        <ThemeToggle />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;