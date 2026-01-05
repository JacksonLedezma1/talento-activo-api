import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Briefcase, LogOut, User as UserIcon, LayoutDashboard, Send } from 'lucide-react';

export const Navbar: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 w-full z-50 px-4 py-4">
            <div className="max-w-7xl mx-auto glass rounded-2xl border border-white/5 border-b-white/10 shadow-2xl overflow-hidden">
                <div className="px-6 sm:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center gap-3 group">
                            <div className="p-2.5 bg-gradient-to-br from-primary-500 to-indigo-600 rounded-xl shadow-lg group-hover:shadow-primary-500/30 group-hover:scale-105 transition-all">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-extrabold text-white tracking-tight">
                                Talento<span className="text-gradient">Activo</span>
                            </span>
                        </Link>
                    </div>

                    <div className="flex items-center gap-8">
                        {isAuthenticated ? (
                            <>
                                <div className="hidden md:flex items-center gap-6">
                                    <Link
                                        to="/"
                                        className={`text-sm font-semibold transition-all flex items-center gap-2 px-3 py-2 rounded-xl ${location.pathname === '/'
                                            ? 'text-white bg-white/10'
                                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <LayoutDashboard className="w-4 h-4" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/my-applications"
                                        className={`text-sm font-semibold transition-all flex items-center gap-2 px-3 py-2 rounded-xl ${location.pathname === '/my-applications'
                                            ? 'text-white bg-white/10'
                                            : 'text-slate-300 hover:text-white hover:bg-white/5'
                                            }`}
                                    >
                                        <Send className="w-4 h-4" />
                                        Mis Postulaciones
                                    </Link>
                                </div>

                                <div className="h-6 w-px bg-slate-800 hidden md:block" />

                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2.5 px-3 py-1.5 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                        <div className="w-6 h-6 rounded-full bg-primary-500/20 flex items-center justify-center border border-primary-500/20">
                                            <UserIcon className="w-3.5 h-3.5 text-primary-400" />
                                        </div>
                                        <span className="text-xs font-bold text-slate-200">{user?.name}</span>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all active:scale-90"
                                        title="Cerrar Sesión"
                                    >
                                        <LogOut className="w-5 h-5" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center gap-5">
                                <Link to="/login" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                                    Acceso
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-6 py-2.5 bg-white text-slate-950 text-sm font-extrabold rounded-xl transition-all hover:bg-slate-200 active:scale-95 shadow-lg shadow-white/5"
                                >
                                    Unirse
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
