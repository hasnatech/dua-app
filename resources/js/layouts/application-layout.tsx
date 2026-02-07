import Header from '@/components/web/header';
import React from 'react';
import { Toaster } from "@/components/ui/sonner"

const ApplicationLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="text-dark-light bg-background font-sans">
            <Header />
            <main className='min-height-screen py-4 px-8'>{children}</main>
            <Toaster />
        </div>
    );
};

export default ApplicationLayout;
