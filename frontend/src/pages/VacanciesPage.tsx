import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Vacancy } from '../types';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Tag, Users, Search, PlusCircle, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const VacanciesPage: React.FC = () => {
    const navigate = useNavigate();
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { isGestor, isAuthenticated } = useAuth();

    useEffect(() => {
        fetchVacancies();
    }, []);

    const fetchVacancies = async () => {
        try {
            const response = await api.get('/vacancies');
            setVacancies(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleApply = async (vacancyId: number) => {
        if (!isAuthenticated) {
            alert('Debes iniciar sesión para postularte.');
            return;
        }
        try {
            await api.post('/applications', { vacancyId });
            alert('¡Postulación exitosa!');
        } catch (err: any) {
            alert(err.response?.data?.message || 'Error al postularse');
        }
    };

    const filteredVacancies = vacancies.filter(v =>
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.technologies.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                <motion.div
                    {...({
                        initial: { opacity: 0, x: -20 },
                        animate: { opacity: 1, x: 0 }
                    } as any)}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Sparkles className="w-3 h-3" />
                        Explora oportunidades
                    </div>
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
                        Encuentra tu próximo <br />
                        <span className="text-gradient">gran desafío</span>
                    </h1>
                </motion.div>

                <motion.div
                    {...({
                        initial: { opacity: 0, y: 20 },
                        animate: { opacity: 1, y: 0 }
                    } as any)}
                    transition={{ delay: 0.2 }}
                    className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto"
                >
                    <div className="relative w-full sm:w-80 group">
                        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-slate-500 group-focus-within:text-primary-400 transition-colors" />
                        </div>
                        <input
                            type="text"
                            placeholder="Tecnología, cargo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all backdrop-blur-sm"
                        />
                    </div>
                    {isGestor && (
                        <button
                            onClick={() => navigate('/create-vacancy')}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-emerald-500/20 w-full sm:w-auto active:scale-95"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>Publicar Vacante</span>
                        </button>
                    )}
                </motion.div>
            </header>

            {loading ? (
                <div className="flex flex-col justify-center items-center py-32 gap-4">
                    <Loader2 className="w-12 h-12 text-primary-500 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Cargando vacantes...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <AnimatePresence>
                        {filteredVacancies.map((vacancy, index) => (
                            <motion.div
                                key={vacancy.id}
                                {...({
                                    initial: { opacity: 0, y: 20 },
                                    animate: { opacity: 1, y: 0 },
                                    exit: { opacity: 0, scale: 0.95 }
                                } as any)}
                                transition={{ delay: index * 0.05 }}
                                className="glass-card p-7 rounded-3xl flex flex-col h-full group"
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-primary-500/10 rounded-2xl border border-primary-500/10 group-hover:scale-110 transition-transform duration-500">
                                        <Briefcase className="w-6 h-6 text-primary-400" />
                                    </div>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] ${vacancy.modality === 'remote' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                        }`}>
                                        {vacancy.modality}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors leading-tight">
                                    {vacancy.title}
                                </h3>

                                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">
                                    {vacancy.description}
                                </p>

                                <div className="grid grid-cols-1 gap-3 mb-8">
                                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                                        <div className="p-1.5 bg-slate-800/50 rounded-lg">
                                            <Tag className="w-3.5 h-3.5" />
                                        </div>
                                        <span className="font-semibold text-slate-300">{vacancy.technologies}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                                        <div className="p-1.5 bg-slate-800/50 rounded-lg">
                                            <MapPin className="w-3.5 h-3.5" />
                                        </div>
                                        <span>{vacancy.location}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-slate-400 text-xs">
                                        <div className="p-1.5 bg-slate-800/50 rounded-lg">
                                            <Users className="w-3.5 h-3.5" />
                                        </div>
                                        <span>Postulantes máx: {vacancy.maxApplicants}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleApply(vacancy.id)}
                                    className="w-full py-4 bg-slate-800/50 hover:bg-primary-600 text-white font-bold rounded-2xl transition-all active:scale-[0.98] border border-slate-700 hover:border-primary-500 hover:shadow-lg hover:shadow-primary-500/20"
                                >
                                    Postularme ahora
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
