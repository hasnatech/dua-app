import React from 'react';
import InputError from './input-error';
import clsx from 'clsx';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    icon?: React.ReactNode;
    error?: string;

}

const FormInput: React.FC<FormInputProps> = ({ label, icon, error, className, ...props }) => {
    // Define your internal default classes for the container
    const defaultContainerClasses = '';

    // Combine the default classes with the passed className
    const containerClasses = clsx(defaultContainerClasses, className);
    return (
        <div className={containerClasses}>
            <label htmlFor={props.id} className="text-active mb-1 block text-sm font-medium">
                {label}
            </label>
            <div className="relative">
                {icon && <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">{icon}</div>}
                <input
                    {...props}
                    className={`block w-full rounded-md border border-border bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-primary focus:ring-primary focus:outline-none sm:text-sm ${icon ? 'pl-10' : ''}`}
                />
            </div>
            {error &&
                <InputError message={error} className="mt-2" />
            }
        </div>
    )
};

export default FormInput;
