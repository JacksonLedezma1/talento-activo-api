import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Application } from '../types';
import { Briefcase, Calendar, Clock, AlertCircle, Loader2, Users, ArrowRight, MapPin, Tag, Star, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';
import { Modal } from '../components/Modal';
import { ApplicationStatus } from '../types';

export const MyApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedApp, setSelectedApp] = useState<Application | null>(null);

    const getStatusBadge = (status: ApplicationStatus) => {
        switch (status) {
            case ApplicationStatus.ACTIVA:
                return (
                    <div className="flex items-center gap-3 bg-blue-500/10 text-blue-500 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-blue-500/20">
                        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Activa
                    </div>
                );
            case ApplicationStatus.EN_PROCESO:
                return (
                    <div className="flex items-center gap-3 bg-amber-500/10 text-amber-500 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-amber-500/20">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                        En Proceso
                    </div>
                );
            case ApplicationStatus.APROBADA:
                return (
                    <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-500 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-emerald-500/20">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        Aprobada
                    </div>
                );
            case ApplicationStatus.RECHAZADA:
                return (
                    <div className="flex items-center gap-3 bg-red-500/10 text-red-500 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest border border-red-500/20">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Rechazada
                    </div>
                );
            default:
                return null;
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const response = await api.get('/applications');
            setApplications(response.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-24 pb-12 px-4 max-w-5xl mx-auto">
            <div className="mb-10 text-center md:text-left">
                <motion.div
                    {...({
                        initial: { opacity: 0, x: -10 },
                        animate: { opacity: 1, x: 0 }
                    } as any)}
                >
                    <h1 className="text-4xl font-extrabold text-white mb-2">Mis Postulaciones</h1>
                    <p className="text-slate-400 font-medium">Gestiona y haz seguimiento a tus sueños profesionales</p>
                </motion.div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-slate-900/30 border border-slate-800 rounded-[2.5rem] p-20 text-center backdrop-blur-sm">
                    <div className="inline-flex p-6 rounded-3xl bg-slate-800/50 text-slate-500 mb-6 border border-slate-700/50">
                        <Briefcase className="w-16 h-16" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">Aún no te has postulado</h3>
                    <p className="text-slate-400 max-w-sm mx-auto font-medium">
                        Tu próximo gran desafío te está esperando. Explora las vacantes y da el primer paso.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {applications.map((app, index) => (
                        <motion.div
                            key={app.id}
                            {...({
                                initial: { opacity: 0, x: -20 },
                                animate: { opacity: 1, x: 0 }
                            } as any)}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedApp(app)}
                            className="glass-card group p-6 rounded-[2rem] flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer"
                        >
                            <div className="flex items-center gap-6">
                                <div className="p-5 bg-gradient-to-br from-primary-500/10 to-indigo-600/10 rounded-2xl text-primary-500 border border-primary-500/20 group-hover:scale-110 transition-transform">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1.5 group-hover:text-primary-400 transition-colors">{app.vacancy.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <Calendar className="w-4 h-4" />
                                            {new Date(app.appliedAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 font-medium">
                                            <Clock className="w-4 h-4" />
                                            <span className="capitalize">{app.vacancy.modality}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-emerald-400 font-extrabold uppercase tracking-wider text-[10px]">
                                            <Users className="w-3.5 h-3.5" />
                                            {app.vacancy.maxApplicants - (app.vacancy.applicantsCount || 0)} cupos libres
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-end gap-6">
                                {getStatusBadge(app.status)}
                                <div className="p-3 bg-slate-800 rounded-xl text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all group-hover:translate-x-1">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-16 p-8 bg-gradient-to-br from-amber-500/5 to-orange-600/5 border border-amber-500/10 rounded-[2rem] flex gap-6 items-start relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 blur-3xl rounded-full" />
                <div className="p-4 bg-amber-500/10 rounded-2xl">
                    <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                </div>
                <div className="space-y-2 relative z-10">
                    <h4 className="text-lg font-bold text-amber-500">Información Importante</h4>
                    <p className="text-sm text-slate-400 leading-relaxed font-medium">
                        Mantente optimista y prepárate para las entrevistas. Recuerda que puedes tener hasta
                        <span className="text-white font-bold px-1.5">3 postulaciones activas</span> simultáneamente.
                        ¡Mucho éxito en tu camino!
                    </p>
                </div>
            </div>

            <Modal
                isOpen={!!selectedApp}
                onClose={() => setSelectedApp(null)}
                title="Detalles de la Postulación"
            >
                {selectedApp && (
                    <div className="space-y-8">
                        <div className="flex items-start gap-4 p-6 bg-slate-800/30 rounded-3xl border border-slate-700/50">
                            <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-400">
                                <Briefcase className="w-6 h-6" />
                            </div>
                            <div>
                                <h4 className="text-2xl font-bold text-white mb-1">{selectedApp.vacancy.title}</h4>
                                <p className="text-primary-400 font-bold">{selectedApp.vacancy.company || 'Empresa Confidencial'}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800 flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-300 font-medium">{selectedApp.vacancy.location}</span>
                            </div>
                            <div className="p-4 bg-slate-800/20 rounded-2xl border border-slate-800 flex items-center gap-3">
                                <DollarSign className="w-5 h-5 text-slate-500" />
                                <span className="text-slate-300 font-medium">{selectedApp.vacancy.salaryRange || 'A convenir'}</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-white font-bold">
                                <div className="w-1.5 h-6 bg-primary-500 rounded-full" />
                                <h5>Descripción del Puesto</h5>
                            </div>
                            <p className="text-slate-400 leading-relaxed font-medium bg-slate-800/10 p-4 rounded-2xl italic">
                                "{selectedApp.vacancy.description}"
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-white font-bold">
                                    <Tag className="w-4 h-4 text-primary-400" />
                                    <h5>Tecnologías</h5>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {selectedApp.vacancy.technologies.split(',').map(tech => (
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
                                    {selectedApp.vacancy.softSkills.split(',').map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-bold border border-amber-500/20">
                                            {skill.trim()}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="text-sm text-slate-500 font-medium">
                                Postulado el {new Date(selectedApp.appliedAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                            </div>
                            <button
                                onClick={() => setSelectedApp(null)}
                                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all"
                            >
                                Cerrar Detalles
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
