import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Modality } from '../types';
import { Input } from '../components/Input';
import {
    PlusCircle,
    MapPin,
    Code,
    Briefcase,
    DollarSign,
    Users,
    ArrowLeft,
    Loader2,
    CheckCircle2,
    Star,
    Building2
} from 'lucide-react';
import { motion } from 'framer-motion';

export const CreateVacancyPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        technologies: '',
        seniority: '',
        softSkills: '',
        location: '',
        modality: Modality.REMOTE as Modality,
        maxApplicants: 10,
        salaryRange: '',
        company: '',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/vacancies', formData);
            setSuccess(true);
            setTimeout(() => navigate('/'), 2000);
        } catch (err) {
            console.error(err);
            alert('Error al crear la vacante. Asegúrate de completar todos los campos obligatorios.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <motion.div
                    {...({
                        initial: { opacity: 0, scale: 0.9 },
                        animate: { opacity: 1, scale: 1 }
                    } as any)}
                    className="text-center space-y-4"
                >
                    <div className="inline-flex p-4 rounded-full bg-emerald-500/10 text-emerald-500">
                        <CheckCircle2 className="w-12 h-12" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">¡Vacante creada con éxito!</h2>
                    <p className="text-slate-400">Redirigiendo al dashboard...</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-12 px-4 max-w-3xl mx-auto">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group"
            >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Volver
            </button>

            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <PlusCircle className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Nueva Vacante</h1>
                        <p className="text-sm text-slate-400">Completa los detalles para publicar una nueva oferta</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Título de la vacante"
                            required
                            value={formData.title}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Ej: Sr. Fullstack Developer"
                            icon={<Briefcase className="w-4 h-4" />}
                        />
                        <Input
                            label="Empresa"
                            value={formData.company}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, company: e.target.value })}
                            placeholder="Ej: TalentoActivo Tech"
                            icon={<Building2 className="w-4 h-4" />}
                        />
                    </div>

                    <Input
                        label="Descripción del puesto"
                        required
                        isTextArea
                        rows={4}
                        value={formData.description}
                        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Describe las responsabilidades y beneficios..."
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Tecnologías (separadas por coma)"
                            required
                            value={formData.technologies}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, technologies: e.target.value })}
                            placeholder="React, NestJS, AWS..."
                            icon={<Code className="w-4 h-4" />}
                        />
                        <Input
                            label="Soft Skills"
                            required
                            value={formData.softSkills}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, softSkills: e.target.value })}
                            placeholder="Liderazgo, comunicación, trabajo en equipo..."
                            icon={<Star className="w-4 h-4" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-slate-300 ml-1">Modalidad</label>
                            <select
                                className="block w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                                value={formData.modality}
                                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFormData({ ...formData, modality: e.target.value as Modality })}
                            >
                                <option value={Modality.REMOTE}>Remoto</option>
                                <option value={Modality.HYBRID}>Híbrido</option>
                                <option value={Modality.OFFICE}>Presencial</option>
                            </select>
                        </div>
                        <Input
                            label="Sueldo estimado"
                            value={formData.salaryRange}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, salaryRange: e.target.value })}
                            placeholder="Ej: $3000 - $4500 USD"
                            icon={<DollarSign className="w-4 h-4" />}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Input
                            label="Ubicación"
                            required
                            value={formData.location}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="Ej: Bogotá, Colombia"
                            icon={<MapPin className="w-4 h-4" />}
                        />
                        <Input
                            label="Cupo máximo"
                            type="number"
                            required
                            value={formData.maxApplicants}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, maxApplicants: parseInt(e.target.value) || 1 })}
                            icon={<Users className="w-4 h-4" />}
                        />
                        <Input
                            label="Seniority"
                            required
                            value={formData.seniority}
                            onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, seniority: e.target.value })}
                            placeholder="Ej: Senior"
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-50 flex justify-center items-center gap-2 active:scale-95"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Publicar Vacante'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
