import React from 'react';
import InputError from './input-error';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    description?: string;
    error?: string;
}

const FormTextarea: React.FC<FormTextareaProps> = ({ label, description, error, ...props }) => (
    <div {...props}>
        <label htmlFor={props.id} className="text-active mb-1 block text-sm font-medium">
            {label}
        </label>
        <textarea
            {...props}
            className="block w-full rounded-md border border-border bg-white px-3 py-2 placeholder-slate-400 shadow-sm focus:border-primary focus:ring-primary focus:outline-none sm:text-sm"
        />
        {description && <p className="text-active/80 mt-2 text-xs">{description}</p>}
        {error && <InputError message={error} className="mt-2" />}
    </div>
);

export default FormTextarea;
