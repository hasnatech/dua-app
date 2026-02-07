import { Link, router, usePage } from '@inertiajs/react';
import { Badge, CalendarIcon, Dot, Globe, Menu, MessageSquare, PawPrint, Plus, Search, Sparkles, User, Users } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import StatCard from '../stats-card';
import CircularTimer from './Timer';

interface HeaderProps {
    onNewRequestClick: () => void;
    activePage: string;
    setActivePage: (page: string) => void;
    stats?: {
        total: number;
        individual: number;
        collective: number;
        ceremonies: number;
    };
}

const NavButton: React.FC<{
    label: string;
    isActive: boolean;
    href: string;
}> = ({ label, isActive, href }) => (
    <Link
        href={route(href)}
        className={`rounded-md px-3 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${isActive ? 'bg-primary text-white' : 'text-active hover:bg-panel'
            }`}
    >
        {label}
    </Link>
);

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        { code: 'en', name: 'English' },
        { code: 'nl', name: 'Dutch' },
    ];

    const currentLanguage = languages.find((lang) => lang.code === i18n.language.split('-')[0]) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-active hover:bg-panel flex w-full items-center justify-center rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium"
            >
                <Globe className="mr-2 h-5 w-5" />
                {currentLanguage.code.toUpperCase()}
            </button>
            {isOpen && (
                <div className="ring-opacity-5 absolute right-0 z-20 mt-2 w-40 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className="text-active hover:bg-panel block w-full px-4 py-2 text-left text-sm"
                        >
                            {lang.name}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};



const SearchBar: React.FC = () => {
    const { url } = usePage();
    const searchParams = new URLSearchParams(url.split('?')[1]);
    const initialQuery = searchParams.get('search') || '';

    const [searchQuery, setSearchQuery] = useState(initialQuery);

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.get(route('search'), { search: searchQuery.trim() });
        }
    };

    return (
        <div className="hidden md:flex items-center justify-center flex-1">
            <div className="relative w-full max-w-md">
                <input
                    type="text"
                    className="w-full rounded-lg border border-border px-4 py-2 pl-10 text-sm focus:border-primary focus:ring-primary focus:outline-none"
                    placeholder="Search pets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSearch();
                    }}
                />

                <button
                    onClick={handleSearch}
                    className="absolute left-3 top-2.5 text-active hover:text-primary"
                >
                    <Search className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
};


const Header: React.FC<HeaderProps> = ({ stats }) => {
    const { t } = useTranslation();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const activePage = route().current() || '';



    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
            if (
                mobileMenuRef.current &&
                !mobileMenuRef.current.contains(event.target as Node) &&
                !(event.target as HTMLElement).closest('#mobile-menu-button')
            ) {
                setIsMobileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const navItems = [
        { page: 'home', label: t('nav.home') },
        { page: 'adminroom', label: t('adminroom.title') },
        { page: 'preparationroom', label: t('nav.preparation') },
        { page: 'cremationroom', label: t('nav.cremation') },
    ];

    return (
        <header className="relative flex h-20 flex-shrink-0 items-center justify-between border-b border-border bg-white px-4 md:px-6 lg:px-8">
            <div className="flex items-center">
                {/* Mobile menu button */}
                <div className="mr-6 md:hidden">
                    <button
                        id="mobile-menu-button"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-active hover:bg-panel rounded-md p-2 transition-colors"
                        aria-label="Open main menu"
                        aria-expanded={isMobileMenuOpen}
                    >
                        <Menu className="h-6 w-6" />
                    </button>
                </div>

                {/* Logo */}
                <div className="mr-6 flex h-12 w-12 items-center justify-center rounded-lg">
                    <img src="/images/logo.png" alt="Logo" className="w-18" />
                </div>

                {/* Desktop navigation */}
                <nav className="ml-4 hidden items-center space-x-2 md:flex">
                    {navItems.map((item) => (
                        <NavButton key={item.page} label={item.label} isActive={route().current(item.page)} href={item.page} />
                    ))}
                </nav>
            </div>


            {/* Right section */}
            <div className="flex items-center space-x-2 md:space-x-4">
                {activePage !== 'home' && stats && (
                    <div className="grid grid-cols-1 gap-6 border-x pr-2 pl-4 sm:grid-cols-2 lg:grid-cols-4">
                        <StatCard label="Total Requests" value={stats.total} icon={<PawPrint className="h-6 w-6" />} />
                        <StatCard label="Individual" value={stats.individual} icon={<Sparkles className="h-6 w-6" />} />
                        <StatCard label="Collective" value={stats.collective} icon={<Users className="h-6 w-6" />} />
                        <StatCard label="Ceremonies" value={stats.ceremonies} icon={<CalendarIcon className="h-6 w-6" />} />
                    </div>
                )}

                <SearchBar />

                <LanguageSwitcher />

                {/* New Request */}
                <Link
                    href={route('cremation.index')}
                    className="hover:bg-active flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-semibold whitespace-nowrap text-white transition-colors"
                >
                    <Plus className="h-5 w-5 md:mr-2" />
                    <span className="hidden md:inline">{t('new_request')}</span>
                </Link>

                {/* Profile + Alerts */}
                <div className="relative flex gap-3" ref={profileRef}>
                    {/* <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="p-1 rounded-full bg-red-600 text-white hover:bg-active mr-3">
            <AlertCircle className="w-8 h-8" />
          </button> */}
                    {/* <NotificationBell opened={isProfileOpen} /> */}
                    {/* {activePage} */}
                    {(activePage != 'cremation.index' && activePage != 'cremation.edit') && (
                        <CircularTimer />
                    )}
                    <button
                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="hover:bg-active rounded-full border border-primary p-1 text-white"
                    >
                        <User className="h-8 w-8 stroke-primary" />
                    </button>

                    {isProfileOpen && (
                        <div
                            className="animate-fadeIn absolute top-10 right-0 z-50 mt-2 w-56 rounded-xl border border-gray-200 bg-white shadow-lg"
                            role="menu"
                        >
                            <div className="border-b border-gray-100 p-3">
                                <h3 className="text-sm font-semibold text-gray-800">My Account</h3>
                            </div>
                            <div className="py-1">
                                <Link
                                    href={route('whatsapp-inbox.index')}
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                                >
                                    <div className="flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        <div>
                                            WhatsApp Inbox
                                        </div>
                                        <span className="-mt-2 -ml-1 h-2 w-2 rounded-full bg-green-500">

                                        </span>
                                    </div>
                                </Link>
                                <Link
                                    href={route('admin.dashboard')}
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                                >
                                    Admin
                                </Link>
                                <Link
                                    href={route('export.index')}
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                                >
                                    Export
                                </Link>
                                <Link
                                    href={route('admin.settings.index')}
                                    className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 hover:text-primary"
                                >
                                    Settings
                                </Link>
                            </div>
                            <div className="border-t border-gray-100">
                                <Link method="post" href="/logout" className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50">
                                    Logout
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div ref={mobileMenuRef} className="animate-fade-in-down absolute top-20 left-0 z-20 w-full bg-white shadow-lg md:hidden">
                    <nav className="flex flex-col space-y-1 p-4">
                        {navItems.map((item) => (
                            <NavButton
                                key={item.page}
                                label={item.label}
                                isActive={route().current(item.page)}
                                href={item.page}
                            />
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
};

export default Header;
