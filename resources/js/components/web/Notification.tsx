import axios from 'axios';
import { Bell, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const NotificationBell = ({ opened }: { opened: boolean }) => {
    const [isOpen, setIsOpen] = useState(opened || false);
    const [hasNew, setHasNew] = useState(true); // trigger animation when new notifications come

    const [notifications, setNotifications] = useState([]);

    const unreadCount = notifications.length;

    // stop the bell animation a few seconds after open
    useEffect(() => {
        if (isOpen) setHasNew(false);
    }, [isOpen]);

    let notifInterval: any;

    useEffect(() => {
        fetchNotifications();
        if (notifInterval) clearInterval(notifInterval);
        notifInterval = setInterval(fetchNotifications, 10000);
    }, []);

    const fetchNotifications = () => {
        axios.get('/admin/notifications/unread').then((response) => {
            // console.log(response.data.data)
            setNotifications(response.data.data);
        });
    };

    return (
        <div className="relative">
           {/* <pre>{JSON.stringify(notifications, null, 2)}</pre> */}
            {/* Bell Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="relative rounded-full border border-primary p-2 transition hover:bg-gray-100">
                {/* Animated bell */}

                <Bell className={`h-6 w-6 stroke-primary text-gray-700 transition-transform ${hasNew ? 'animate-bell-shake' : ''}`} />
                {/* Red badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-3 rounded-full bg-red-600 px-1.5 py-0.5 text-xs font-semibold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="animate-fadeIn absolute right-0 z-50 mt-2 w-80 rounded-xl border border-gray-200 bg-white shadow-lg">
                    <div className="flex items-center justify-between border-b border-gray-100 p-3">
                        <h3 className="text-sm font-semibold text-primary">Notifications</h3>
                        <button onClick={() => setIsOpen(false)} className="text-xs text-primary hover:underline">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                    <ul className="max-h-96 overflow-y-auto">
                        {notifications.slice(0, 10).map((n) => (
                            <li key={n.id} className="cursor-pointer border-b border-gray-100 px-4 py-2 last:border-b-0 hover:bg-gray-50">
                                <p className="text-sm text-gray-900">{n.title}</p>
                                <p className="text-sm text-gray-900">{n.message}</p>
                                <p className="text-xs text-gray-500">{n.created_at}</p>
                            </li>
                        ))}
                    </ul>
                    <div className="border-t border-gray-100 p-3 text-center">
                        <a href="/notifications" className="text-sm font-medium text-primary hover:underline">
                            View All
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
