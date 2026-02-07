import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Save } from 'lucide-react';
import { ReactNode } from 'react';

interface ProfileSectionProps {
    title: string;
    children: ReactNode;
    onEdit: () => void;
    isEditing: boolean;
}

export const ProfileSection = ({ title, children, onEdit, isEditing }: ProfileSectionProps) => (
    <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>{title}</CardTitle>
            <Button variant="ghost" size="icon" onClick={onEdit}>
                {isEditing ? <Save className="h-4 w-4" /> : <Pencil className="h-4 w-4" />}
            </Button>
        </CardHeader>
        <CardContent>{children}</CardContent>
    </Card>
);
