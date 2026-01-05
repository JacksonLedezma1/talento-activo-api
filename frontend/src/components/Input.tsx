import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
    label: string;
    error?: string;
    icon?: React.ReactNode;
    isTextArea?: boolean;
    rows?: number;
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    icon,
    isTextArea,
    className = '',
    ...props
}) => {
    const Component = isTextArea ? 'textarea' : 'input';

    return (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-300 ml-1">
                {label}
            </label>
            <div className="relative group">
                {icon && (
                    <div className="absolute left-3 top-3 text-slate-500 group-focus-within:text-primary-500 transition-colors">
                        {icon}
                    </div>
                )}
                <Component
                    {...(props as any)}
                    className={`
            block w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2.5 
            text-white placeholder-slate-500 focus:outline-none focus:ring-2 
            focus:ring-primary-500/50 focus:border-primary-500 transition-all
            ${icon ? 'pl-10' : 'pl-4'}
            ${error ? 'border-red-500/50 ring-2 ring-red-500/20' : ''}
            ${className}
          `}
                />
            </div>
            {error && (
                <p className="text-xs text-red-500 mt-1 ml-1 font-medium animate-in fade-in slide-in-from-top-1">
                    {error}
                </p>
            )}
        </div>
    );
};
