import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { type NavItem } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavItem[] }) {
    const page = usePage();
    return (
        <SidebarGroup className="px-2 py-0">
            <SidebarGroupLabel>Platform</SidebarGroupLabel>
            <SidebarMenu className='space-y-3'>
                {items.map((item) => (
                    item.type === 'divider' ? (
                        <SidebarMenuItem key={item.title} className="my-2">
                            <hr className="border-gray-200 dark:border-gray-700" />
                        </SidebarMenuItem>
                    ) : item.type === 'title' ? (
                        <SidebarGroupLabel key={item.title}>{item.title}</SidebarGroupLabel>
                    ) : (
                        <SidebarMenuItem key={item.title}>
                            <SidebarMenuButton asChild isActive={page.url.startsWith(item.href)} tooltip={{ children: item.title }}>
                                <Link href={item.href} prefetch className='text-primary active:font-bold active:text-primary'>
                                    {item.icon && <item.icon />}
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}
