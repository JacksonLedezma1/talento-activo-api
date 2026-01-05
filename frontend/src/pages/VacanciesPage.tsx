import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import type { Vacancy, Application } from '../types';
import { ApplicationStatus } from '../types';
import { useAuth } from '../hooks/useAuth';
import { Briefcase, MapPin, Tag, Users, Search, PlusCircle, Loader2, Sparkles, DollarSign, Star, Info, CheckCircle, ClipboardList } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Modal } from '../components/Modal';

export const VacanciesPage: React.FC = () => {
    const navigate = useNavigate();
    const [vacancies, setVacancies] = useState<Vacancy[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedVacancy, setSelectedVacancy] = useState<Vacancy | null>(null);
    const [activeAppsCount, setActiveAppsCount] = useState(0);
    const [userApplications, setUserApplications] = useState<Application[]>([]);
    const { isGestor, isAuthenticated } = useAuth();

    useEffect(() => {
        fetchData();
    }, [isAuthenticated]);

    const getStatusBadge = (status?: ApplicationStatus) => {
        if (!status) return null;
        const styles = {
            [ApplicationStatus.ACTIVA]: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
            [ApplicationStatus.EN_PROCESO]: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
            [ApplicationStatus.APROBADA]: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
            [ApplicationStatus.RECHAZADA]: 'bg-red-500/10 text-red-500 border-red-500/20',
        };
        const colors = {
            [ApplicationStatus.ACTIVA]: 'bg-blue-500',
            [ApplicationStatus.EN_PROCESO]: 'bg-amber-500',
            [ApplicationStatus.APROBADA]: 'bg-emerald-500',
            [ApplicationStatus.RECHAZADA]: 'bg-red-500',
        };

        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border ${styles[status]}`}>
                <div className={`w-1.5 h-1.5 rounded-full ${colors[status]} ${status === ApplicationStatus.ACTIVA || status === ApplicationStatus.EN_PROCESO ? 'animate-pulse' : ''}`} />
                {status}
            </div>
        );
    };

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch applications first if user is authenticated
            let applications: Application[] = [];
            if (isAuthenticated && !isGestor) {
                applications = await fetchActiveApplications();
            }
            // Then fetch vacancies with applications data
            await fetchVacancies(applications);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchVacancies = async (applications?: Application[]) => {
        const response = await api.get('/vacancies');
        const vacanciesData = response.data.data;
        
        // Use provided applications or state
        const appsToUse = applications || userApplications;
        
        // Map vacancies with application status if user is authenticated
        if (isAuthenticated && !isGestor && appsToUse.length > 0) {
            const enrichedVacancies = vacanciesData.map((vacancy: Vacancy) => {
                const userApp = appsToUse.find(app => app.vacancy.id === vacancy.id);
                return {
                    ...vacancy,
                    hasApplied: !!userApp,
                    applicationStatus: userApp?.status
                };
            });
            setVacancies(enrichedVacancies);
        } else {
            setVacancies(vacanciesData);
        }
    };

    const fetchActiveApplications = async (): Promise<Application[]> => {
        try {
            const response = await api.get('/applications');
            const applications = response.data.data || response.data;
            setUserApplications(applications);
            
            const activeCount = applications.filter((app: Application) =>
                app.status === ApplicationStatus.ACTIVA || app.status === ApplicationStatus.EN_PROCESO
            ).length;
            setActiveAppsCount(activeCount);
            
            return applications;
        } catch (error) {
            console.error('Error fetching applications count:', error);
            return [];
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
            
            // Refresh applications first, then vacancies with updated applications
            const updatedApplications = await fetchActiveApplications();
            await fetchVacancies(updatedApplications);
            
            // Update selected vacancy if modal is open
            if (selectedVacancy && selectedVacancy.id === vacancyId) {
                const userApp = updatedApplications.find(app => app.vacancy.id === vacancyId);
                setSelectedVacancy({
                    ...selectedVacancy,
                    hasApplied: true,
                    applicationStatus: userApp?.status
                });
            }
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

                    {!isGestor && isAuthenticated && (
                        <div className={`px-4 py-3 rounded-2xl border flex items-center gap-3 w-full sm:w-auto ${activeAppsCount >= 3
                            ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                            : 'bg-slate-800/50 border-slate-700 text-slate-400'
                            }`}>
                            <div className={`w-2 h-2 rounded-full ${activeAppsCount >= 3 ? 'bg-amber-500 animate-pulse' : 'bg-primary-500'}`} />
                            <span className="text-xs font-bold">
                                {activeAppsCount}/3 Activas
                            </span>
                        </div>
                    )}
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
            ) : filteredVacancies.length === 0 ? (
                <motion.div
                    {...({
                        initial: { opacity: 0, scale: 0.9 },
                        animate: { opacity: 1, scale: 1 }
                    } as any)}
                    className="flex flex-col items-center justify-center py-32 text-center"
                >
                    <div className="p-6 bg-slate-900/50 rounded-full border border-slate-800 mb-6">
                        <Search className="w-12 h-12 text-slate-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No encontramos vacantes</h3>
                    <p className="text-slate-500 max-w-sm">
                        No hay ofertas que coincidan con "{searchTerm}". Intenta con otros términos.
                    </p>
                    <button
                        onClick={() => setSearchTerm('')}
                        className="mt-6 text-primary-400 font-bold hover:text-primary-300 transition-colors"
                    >
                        Limpiar búsqueda
                    </button>
                </motion.div>
            ) : (
                <>
                    <div className="mb-8 flex items-center gap-2">
                        <span className="text-slate-500 text-sm font-medium">Mostrando</span>
                        <span className="px-2.5 py-0.5 bg-slate-800 text-slate-300 rounded-md text-sm font-bold border border-slate-700">
                            {filteredVacancies.length}
                        </span>
                        <span className="text-slate-500 text-sm font-medium">resultados</span>
                    </div>

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
                                    <div
                                        onClick={() => setSelectedVacancy(vacancy)}
                                        className="cursor-pointer flex-grow"
                                    >
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="p-3 bg-primary-500/10 rounded-2xl border border-primary-500/10 group-hover:bg-primary-500/20 transition-all duration-500">
                                                <Briefcase className="w-6 h-6 text-primary-400" />
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-[0.1em] ${vacancy.modality === 'remote' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    }`}>
                                                    {vacancy.modality}
                                                </span>
                                                {vacancy.hasApplied && (
                                                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg text-[9px] font-black uppercase tracking-tighter flex items-center gap-1.5">
                                                        <CheckCircle className="w-3 h-3" />
                                                        Postulado
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-primary-400 transition-colors leading-tight">
                                            {vacancy.title}
                                        </h3>

                                        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2">
                                            {vacancy.description}
                                        </p>

                                        <div className="grid grid-cols-1 gap-3 mb-8">
                                            <div className="flex items-center gap-3 text-slate-400 text-xs">
                                                <div className="p-1.5 bg-slate-800/50 rounded-lg">
                                                    <Tag className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="font-semibold text-slate-300 truncate">{vacancy.technologies}</span>
                                            </div>
                                            <div className="flex items-center gap-3 text-slate-400 text-xs">
                                                <div className="p-1.5 bg-slate-800/50 rounded-lg">
                                                    <MapPin className="w-3.5 h-3.5" />
                                                </div>
                                                <span className="truncate">{vacancy.location}</span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center justify-between text-xs">
                                                    <div className="flex items-center gap-3 text-slate-400">
                                                        <div className="p-1.5 bg-slate-800/50 rounded-lg">
                                                            <Users className="w-3.5 h-3.5" />
                                                        </div>
                                                        <span className="font-medium">
                                                            {vacancy.maxApplicants - (vacancy.applicantsCount || 0)} cupos libres
                                                        </span>
                                                    </div>
                                                    <span className="text-slate-500 font-bold">
                                                        {vacancy.applicantsCount || 0} / {vacancy.maxApplicants}
                                                    </span>
                                                </div>
                                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                    <motion.div
                                                        {...({
                                                            initial: { width: 0 },
                                                            animate: { width: `${Math.min(((vacancy.applicantsCount || 0) / vacancy.maxApplicants) * 100, 100)}%` }
                                                        } as any)}
                                                        className={`h-full rounded-full transition-all duration-1000 ${(vacancy.applicantsCount || 0) >= vacancy.maxApplicants
                                                            ? 'bg-red-500'
                                                            : (vacancy.applicantsCount || 0) >= vacancy.maxApplicants * 0.8
                                                                ? 'bg-amber-500'
                                                                : 'bg-emerald-500'
                                                            }`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {isGestor ? (
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    navigate(`/manage-vacancy/${vacancy.id}`);
                                                }}
                                                className="flex-grow py-4 font-bold rounded-2xl transition-all active:scale-[0.98] bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-500 flex items-center justify-center gap-2"
                                            >
                                                <ClipboardList className="w-5 h-5" />
                                                Gestionar Postulaciones
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => !vacancy.hasApplied && handleApply(vacancy.id)}
                                                disabled={vacancy.hasApplied || (vacancy.applicantsCount || 0) >= vacancy.maxApplicants}
                                                className={`flex-grow py-4 font-bold rounded-2xl transition-all active:scale-[0.98] border ${vacancy.hasApplied
                                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                                                    : (vacancy.applicantsCount || 0) >= vacancy.maxApplicants
                                                        ? 'bg-slate-800/20 border-slate-800 text-slate-600 cursor-not-allowed'
                                                        : 'bg-primary-600 hover:bg-primary-500 text-white border-primary-400/20 hover:shadow-lg hover:shadow-primary-500/20'
                                                    }`}
                                            >
                                                {vacancy.hasApplied
                                                    ? 'Ya Postulado'
                                                    : (vacancy.applicantsCount || 0) >= vacancy.maxApplicants
                                                        ? 'Cupo Agotado'
                                                        : 'Postularme'}
                                            </button>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedVacancy(vacancy);
                                            }}
                                            className="p-4 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl border border-slate-700 transition-all active:scale-90"
                                            title="Ver detalles"
                                        >
                                            <Info className="w-6 h-6" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}
            <Modal
                isOpen={!!selectedVacancy}
                onClose={() => setSelectedVacancy(null)}
                title="Detalles de la Vacante"
            >
                {selectedVacancy && (
                    <div className="space-y-8">
                        <div className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                            <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">{selectedVacancy.title}</h4>
                                <p className="text-primary-400 font-bold">{selectedVacancy.company || 'Empresa Confidencial'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800 flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-300 font-medium">{selectedVacancy.location}</span>
                            </div>
                            <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800 flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-300 font-medium">{selectedVacancy.salaryRange || 'A convenir'}</span>
                            </div>
                            <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800 flex items-center gap-3">
                                <Users className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-300 font-medium font-capitalize">{selectedVacancy.modality}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                                <h5>Sobre el puesto</h5>
                            </div>
                            <p className="text-slate-400 leading-relaxed font-medium bg-slate-800/10 p-6 rounded-2xl">
                                {selectedVacancy.description}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <Tag className="w-4 h-4 text-primary-400" />
                                    <h5>Tecnologías</h5>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedVacancy.technologies.split(',').map(tech => (
                                        <span key={tech} className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg text-xs font-bold border border-slate-700">
                                            {tech.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <Star className="w-4 h-4 text-amber-400" />
                                    <h5>Soft Skills</h5>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedVacancy.softSkills.split(',').map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-bold border border-amber-500/20">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 border-t border-slate-800">
                            <button
                                onClick={() => {
                                    if (!selectedVacancy.hasApplied) {
                                        handleApply(selectedVacancy.id);
                                        setSelectedVacancy(null);
                                    }
                                }}
                                disabled={selectedVacancy.hasApplied || (selectedVacancy.applicantsCount || 0) >= selectedVacancy.maxApplicants}
                                className={`w-full py-4 font-bold rounded-2xl transition-all active:scale-[0.98] border ${selectedVacancy.hasApplied
                                    ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-500'
                                    : (selectedVacancy.applicantsCount || 0) >= selectedVacancy.maxApplicants
                                        ? 'bg-slate-800/20 border-slate-800 text-slate-600 cursor-not-allowed'
                                        : 'bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white border-white/10 hover:shadow-xl hover:shadow-primary-500/20'
                                    }`}
                            >
                                {selectedVacancy.hasApplied ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <span>Postulado</span>
                                        {getStatusBadge(selectedVacancy.applicationStatus)}
                                    </div>
                                ) : (selectedVacancy.applicantsCount || 0) >= selectedVacancy.maxApplicants ? (
                                    'Cupo Agotado'
                                ) : (
                                    'Postularme a esta vacante'
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
