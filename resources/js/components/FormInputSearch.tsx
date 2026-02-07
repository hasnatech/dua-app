import React, { useState, useEffect } from "react";
import axios from "axios";
import { Loader2, Search } from "lucide-react";
import InputError from "./input-error";

interface FormInputSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  searchUrl: string; // URL to fetch results
  value: string;
  onChange?: (e: any) => void;
  onSelectResult?: (result: any) => void; // Callback when user selects a result
}

const FormInputSearch: React.FC<FormInputSearchProps> = ({
  label,
  searchUrl,
  onSelectResult,
  onChange,
  value,
  ...props
}) => {
  const [query, setQuery] = useState(value || "");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Trigger search after typing more than 3 letters
  useEffect(() => {
    const fetchResults = async () => {
      if (query.length < 3) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await axios.get(`${searchUrl}?q=${encodeURIComponent(query)}`);
        setResults(response.data || []);
      } catch (error) {
        console.error("Search failed:", error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchResults, 400); // debounce 400ms
    return () => clearTimeout(debounceTimer);
  }, [query, searchUrl]);

  return (
    <div className="relative">
      <label htmlFor={props.id} className="block text-sm font-medium text-active mb-1">
        {label}
      </label>

      <div className="relative">
        <input
          {...props}
          value={query}
          onChange={(e) => {
            onChange?.(e);
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onBlur={() => setTimeout(() => setShowResults(false), 150)} // hide results after small delay
          className="block w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm pr-10"
          placeholder="Type to search..."
        />

        {/* Right-side icon */}
        <span className="absolute inset-y-0 right-3 flex items-center">
          {loading ? (
            <Loader2 className="animate-spin text-gray-500 w-4 h-4" />
          ) : (
            <Search className="text-gray-400 w-4 h-4" />
          )}
        </span>
      </div>

      {/* Dropdown results */}
      {showResults && results.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-lg max-h-48 overflow-auto">
          {results.map((item, idx) => (
            <li
              key={idx}
              onClick={() => {
                onSelectResult?.(item);
                setQuery(item.name || item.label || String(item)); // set selected text
                setShowResults(false);
              }}
              className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer"
            >
              {item.name || item.label || item.toString()}
            </li>
          ))}
        </ul>
      )}

      {/* No results */}
      {showResults && !loading && query.length >= 3 && results.length === 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-border rounded-md shadow-sm text-sm text-gray-500 px-3 py-2">
          No results found
        </div>
      )}



    </div>
  );
};

export default FormInputSearch;
