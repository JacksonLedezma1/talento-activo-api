import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Vacancy } from '../types';
import { Modality } from '../types';
import { useAuth } from '../context/AuthContext';
import { Briefcase, MapPin, Tag, Users, Search, PlusCircle, Loader2 } from 'lucide-react';
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                        Vacantes <span className="text-primary-500">Disponibles</span>
                    </h1>
                    <p className="text-slate-400">Encuentra tu próximo desafío profesional</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input
                            type="text"
                            placeholder="Buscar por tecnología o título..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-primary-500 w-full md:w-80 transition-all"
                        />
                    </div>
                    {isGestor && (
                        <button
                            onClick={() => navigate('/create-vacancy')}
                            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span>Nueva Vacante</span>
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-24">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredVacancies.map((vacancy, index) => (
                            <motion.div
                                key={vacancy.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl hover:border-primary-500/50 transition-all group flex flex-col"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-primary-500/10 rounded-xl">
                                        <Briefcase className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${vacancy.modality === 'remote' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-amber-500/10 text-amber-400'
                                        }`}>
                                        {vacancy.modality}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary-400 transition-colors">
                                    {vacancy.title}
                                </h3>
                                <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-grow">
                                    {vacancy.description}
                                </p>

                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                                        <Tag className="w-4 h-4 text-slate-500" />
                                        <span className="font-medium text-slate-400">Techs:</span> {vacancy.technologies}
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                                        <MapPin className="w-4 h-4 text-slate-500" />
                                        <span>{vacancy.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                                        <Users className="w-4 h-4 text-slate-500" />
                                        <span>Max {vacancy.maxApplicants} postulantes</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleApply(vacancy.id)}
                                    className="w-full py-3 bg-slate-800 hover:bg-primary-600 text-white font-bold rounded-xl transition-all active:scale-[0.98]"
                                >
                                    Postularse ahora
                                </button>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};
