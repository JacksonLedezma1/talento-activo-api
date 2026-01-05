import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { VacanciesPage } from './pages/VacanciesPage';
import { CreateVacancyPage } from './pages/CreateVacancyPage';
import { MyApplicationsPage } from './pages/MyApplicationsPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-[#0f172a] text-slate-200">
          <Navbar />
          <Routes>
            <Route path="/" element={<VacanciesPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/create-vacancy" element={<CreateVacancyPage />} />
            <Route path="/my-applications" element={<MyApplicationsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
