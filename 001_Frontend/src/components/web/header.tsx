
import React from 'react';
import { Link } from '@inertiajs/react';

const Header: React.FC = () => {
    return (
        <header className="bg-white border-b border-slate-200">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="font-bold text-xl text-emerald-600">
                    Dua App
                </Link>
                <nav>
                    {/* Add navigation items here */}
                </nav>
            </div>
        </header>
    );
};

export default Header;
