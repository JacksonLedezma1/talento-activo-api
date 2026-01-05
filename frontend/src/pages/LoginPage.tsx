import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';
import { Mail, Lock, Loader2, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.data.user, response.data.data.accessToken);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Credenciales incorrectas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-[120px]" />

            <motion.div
                {...({
                    initial: { opacity: 0, scale: 0.95 },
                    animate: { opacity: 1, scale: 1 }
                } as any)}
                className="max-w-md w-full glass-card p-10 rounded-[2.5rem] relative z-10"
            >
                <div className="text-center mb-10">
                    <div className="inline-flex p-3 bg-white rounded-2xl mb-6 shadow-xl">
                        <motion.div
                            {...({
                                animate: { rotate: [0, 10, -10, 0] }
                            } as any)}
                            transition={{ repeat: Infinity, duration: 5 }}
                        >
                            <Lock className="w-8 h-8 text-slate-900" />
                        </motion.div>
                    </div>
                    <h2 className="text-4xl font-extrabold text-white mb-2">Bienvenido</h2>
                    <p className="text-slate-400 font-medium">Ingresa para continuar en TalentoActivo</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    {error && (
                        <motion.div
                            {...({
                                initial: { opacity: 0, y: -10 },
                                animate: { opacity: 1, y: 0 }
                            } as any)}
                            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-sm font-semibold"
                        >
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </motion.div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-400 ml-1">Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-800 rounded-2xl bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                                    placeholder="ejemplo@correo.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-slate-400 ml-1">Contraseña</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-primary-500 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-12 pr-4 py-3.5 border border-slate-800 rounded-2xl bg-slate-900/50 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 transition-all font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-3 py-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white font-extrabold rounded-2xl transition-all shadow-xl shadow-primary-500/20 disabled:opacity-50 active:scale-95 mt-4"
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <span>Iniciar Sesión</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 pt-8 border-t border-slate-800 text-center">
                    <p className="text-slate-400 font-medium">
                        ¿Nuevo aquí?{' '}
                        <Link to="/register" className="text-white font-extrabold hover:text-primary-400 transition-colors underline decoration-primary-500/30 underline-offset-4">
                            Crea una cuenta gratis
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    );
};
