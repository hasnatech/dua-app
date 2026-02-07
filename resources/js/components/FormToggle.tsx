import React from "react";

interface FormToggleProps {
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const FormToggle: React.FC<FormToggleProps> = ({ label, checked, onChange, name }) => (
  <label className="flex items-center cursor-pointer">
    <div className="relative">
      <input
        type="checkbox"
        name={name}
        className="sr-only"
        checked={checked}
        onChange={onChange}
      />
      <div
        className={`block w-14 h-8 rounded-full ${
          checked ? "bg-primary" : "bg-border"
        }`}
      ></div>
      <div
        className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${
          checked ? "transform translate-x-6" : ""
        }`}
      ></div>
    </div>
    <div className="ml-3 text-active font-medium">{label}</div>
  </label>
);

export default FormToggle;
