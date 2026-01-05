import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Briefcase, LogOut, User as UserIcon } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-800 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-primary-500 rounded-lg group-hover:bg-primary-400 transition-colors">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-white tracking-tight">Talento<span className="text-primary-500">Activo</span></span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-6">
                        {isAuthenticated ? (
                            <>
                                <Link to="/my-applications" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                    Mis Postulaciones
                                </Link>
                                <div className="flex items-center gap-2 text-slate-300">
                                    <UserIcon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{user?.name}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Salir
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold rounded-lg transition-all shadow-lg shadow-primary-500/20"
                                >
                                    Registrarse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
