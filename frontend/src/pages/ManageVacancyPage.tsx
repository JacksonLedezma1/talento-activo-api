import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trash2, AlertCircle, Sparkles } from 'lucide-react';
import api from '../api/axios';
import { ApplicationStatus } from '../types';
import type { Application, Vacancy } from '../types';
import { useAuth } from '../context/AuthContext';

export const ManageVacancyPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isGestor, loading: authLoading } = useAuth();
    const [vacancy, setVacancy] = useState<Vacancy | null>(null);
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('ManageVacancyPage debugging:', { id, isGestor, authLoading });
        if (authLoading) return;

        if (!isGestor) {
            console.log('User is not gestor, redirecting...');
            navigate('/');
            return;
        }

        console.log('Auth check passed, fetching data for vacancy:', id);
        fetchData();
    }, [id, isGestor, authLoading]);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        console.log('Starting fetch...');
        try {
            const [vacancyRes, appsRes] = await Promise.all([
                api.get<Vacancy>(`/vacancies/${id}`),
                api.get<Application[]>(`/applications?vacancyId=${id}`)
            ]);
            console.log('Fetch successful:', { vacancy: vacancyRes.data, apps: appsRes.data });
            setVacancy((vacancyRes.data as any).data);
            setApplications((appsRes.data as any).data);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error al cargar la vacante o las postulaciones. Revisa la consola.');
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (applicationId: number, newStatus: ApplicationStatus) => {
        try {
            await api.patch(`/applications/${applicationId}/status`, { status: newStatus });
            setApplications(apps => apps.map(app =>
                app.id === applicationId ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error al actualizar el estado');
        }
    };

    const handleDelete = async (applicationId: number) => {
        if (!window.confirm('¿Estás seguro de que deseas eliminar esta postulación?')) return;
        try {
            await api.delete(`/applications/${applicationId}`);
            setApplications(apps => apps.filter(app => app.id !== applicationId));
        } catch (error) {
            console.error('Error deleting application:', error);
            alert('No se pudo eliminar la postulación. Asegúrate de que esté en estado "Activa".');
        }
    };

    const getStatusColor = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.ACTIVA: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
            case ApplicationStatus.EN_PROCESO: return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
            case ApplicationStatus.APROBADA: return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
            case ApplicationStatus.RECHAZADA: return 'text-red-400 bg-red-400/10 border-red-400/20';
            default: return 'text-slate-400 bg-slate-400/10 border-slate-400/20';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-primary-400 gap-4">
                <div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin" />
                <p className="font-bold animate-pulse text-lg">Cargando datos...</p>
                <div className="text-xs text-slate-600 font-mono">
                    ID: {id} | AuthLoading: {String(authLoading)} | Gestor: {String(isGestor)}
                </div>
            </div>
        );
    }

    if (!vacancy) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-slate-400 gap-4">
                <div className="p-4 bg-slate-800/50 rounded-full">
                    <AlertCircle className="w-8 h-8 text-red-500" />
                </div>
                <h2 className="text-xl font-bold text-white">No se encontró la vacante</h2>
                <button
                    onClick={() => navigate('/')}
                    className="text-primary-400 hover:text-primary-300 font-bold"
                >
                    Volver al inicio
                </button>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
            <motion.div
                {...({
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 }
                } as any)}
                className="mb-8"
            >
                <button
                    onClick={() => navigate('/')}
                    className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Volver al listado
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4">
                            <Sparkles className="w-3 h-3" />
                            Gestión de Candidatos
                        </div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                            {vacancy.title}
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Gestiona las postulaciones para esta vacante
                        </p>
                    </div>
                </div>
            </motion.div>

            <motion.div
                {...({
                    initial: { opacity: 0, y: 20 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.1 }
                } as any)}
                className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden p-6"
            >
                {applications.length === 0 ? (
                    <div className="text-center py-12 flex flex-col items-center gap-4">
                        <div className="p-4 bg-slate-800/50 rounded-full">
                            <AlertCircle className="w-8 h-8 text-slate-500" />
                        </div>
                        <p className="text-slate-400">No hay postulaciones para esta vacante aún.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800/50">
                        {applications.map(app => (
                            <div key={app.id} className="py-6 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/20">
                                        {app.user?.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-white mb-1">{app.user?.name}</h4>
                                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
                                            <span>{app.user?.email}</span>
                                            <span className="w-1 h-1 rounded-full bg-slate-700" />
                                            <span>Postulado el {new Date(app.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-slate-950/30 p-2 rounded-xl border border-slate-800/50">
                                    <div className="relative">
                                        <select
                                            value={app.status}
                                            onChange={(e) => handleStatusUpdate(app.id, e.target.value as ApplicationStatus)}
                                            className={`appearance-none pl-4 pr-10 py-2.5 rounded-lg text-sm font-bold border outline-none cursor-pointer bg-slate-900 transition-all ${getStatusColor(app.status)}`}
                                        >
                                            {Object.values(ApplicationStatus).map(status => (
                                                <option key={status} value={status}>{status}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {app.status === ApplicationStatus.ACTIVA && (
                                        <button
                                            onClick={() => handleDelete(app.id)}
                                            className="p-2.5 hover:bg-red-500/10 text-slate-500 hover:text-red-500 rounded-lg transition-colors"
                                            title="Eliminar postulación"
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
};
