import { Candidate } from '@/types/candidate';
import { useForm } from '@inertiajs/react';
import { useCallback, useState } from 'react';

// Custom hook for managing editing state
export const useEditing = (initialData: Candidate, onSave: () => void) => {
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm<Candidate>(initialData);

    const handleEdit = useCallback(() => {
        if (isEditing) {
            onSave();
        }
        setIsEditing(!isEditing);
    }, [isEditing, onSave]);

    return { isEditing, handleEdit, ...form };
};
