
import type { PropsWithChildren } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome

export default function PublicLayout({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-slate-100 flex justify-center">
            <div className="w-full max-w-md bg-slate-50 min-h-screen relative shadow-2xl shadow-slate-200 overflow-hidden">
                {children}
            </div>
        </div>
    );
}
