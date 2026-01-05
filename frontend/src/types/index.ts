export enum Role {
    ADMIN = 'admin',
    GESTOR = 'gestor',
    CODER = 'coder',
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    isActive: boolean;
    createdAt: string;
}

export interface AuthResponse {
    accessToken: string;
    user: User;
}

export enum Modality {
    OFFICE = 'office',
    REMOTE = 'remote',
    HYBRID = 'hybrid',
}

export interface Vacancy {
    id: number;
    title: string;
    description: string;
    technologies: string;
    seniority: string;
    softSkills: string;
    location: string;
    modality: Modality;
    salaryRange?: string;
    company?: string;
    maxApplicants: number;
    isActive: boolean;
    createdAt: string;
}

export interface Application {
    id: number;
    appliedAt: string;
    user: User;
    vacancy: Vacancy;
}
