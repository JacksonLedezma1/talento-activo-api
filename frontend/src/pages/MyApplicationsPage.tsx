import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import type { Application } from '../types';
import { Briefcase, Calendar, Clock, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const MyApplicationsPage: React.FC = () => {
    const [applications, setApplications] = useState<Application[]>([]);
    const [loading, setLoading] = useState(true);

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
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Mis Postulaciones</h1>
                <p className="text-slate-400">Seguimiento de tus aplicaciones de trabajo</p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-primary-500 animate-spin" />
                </div>
            ) : applications.length === 0 ? (
                <div className="bg-slate-900/30 border border-slate-800 rounded-3xl p-20 text-center">
                    <div className="inline-flex p-4 rounded-full bg-slate-800 text-slate-500 mb-4">
                        <Briefcase className="w-12 h-12" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Aún no te has postulado</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">
                        Explora las vacantes disponibles y comienza tu carrera hoy mismo.
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
                            className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-slate-700 transition-all"
                        >
                            <div className="flex items-center gap-5">
                                <div className="p-4 bg-primary-500/10 rounded-2xl text-primary-500">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-1">{app.vacancy.title}</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            Postulado el {new Date(app.appliedAt).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock className="w-4 h-4" />
                                            {app.vacancy.modality}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 bg-emerald-500/10 text-emerald-500 px-4 py-2 rounded-xl text-sm font-bold border border-emerald-500/20">
                                <CheckCircle className="w-4 h-4" />
                                En Proceso
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            <div className="mt-12 p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-4 items-start">
                <AlertCircle className="w-6 h-6 text-amber-500 shrink-0" />
                <p className="text-sm text-amber-200/70 leading-relaxed">
                    <strong>Nota:</strong> Recuerda que solo puedes tener hasta 3 postulaciones activas simultáneamente.
                    Si deseas aplicar a una nueva, deberás esperar a que se cierre uno de tus procesos actuales.
                </p>
            </div>
        </div>
    );
};
