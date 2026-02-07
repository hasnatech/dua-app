import { ChevronDown } from "lucide-react";
import React from "react";

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly string[];
}

const FormSelect: React.FC<FormSelectProps> = ({ label, options, ...props }) => (
  <div>
    <label htmlFor={props.id} className="block text-sm font-medium text-active mb-1">
      {label}
    </label>
    <div className="relative">
      <select
        {...props}
        className="block w-full appearance-none px-3 py-2 bg-white border border-border rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt || "---"}
          </option>
        ))}
      </select>

      {/* Custom chevron */}
      <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
        <ChevronDown className="w-5 h-5" />
      </span>
    </div>
  </div>

  
);

export default FormSelect;
