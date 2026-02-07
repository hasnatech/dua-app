import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import * as React from 'react';

interface Column<T> {
    key: keyof T | string;
    label: string;
    render?: (row: T) => React.ReactNode;
    sortable?: boolean;
    filterable?: boolean;
    filterOptions?: { value: string; label: string }[];
}

interface DataTableProps<T> {
    columns: Column<T>[];
    data: T[];
    total: number;
    page: number;
    perPage: number;
    onPageChange: (page: number) => void;
    onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
    sortKey?: string;
    sortDirection?: 'asc' | 'desc';
    onSearch?: (value: string) => void;
    searchValue?: string;
    filters?: Record<string, string>;
    onFilterChange?: (key: string, value: string) => void;
    loading?: boolean;
    ButtonLink?: string;
    ButtonLabel?: string;
}

export function DataTable<T extends { id: number | string }>({
    columns,
    data,
    total,
    page,
    perPage,
    onPageChange,
    onSortChange,
    sortKey,
    sortDirection,
    onSearch,
    searchValue,
    filters = {},
    onFilterChange,
    loading = false,
    ButtonLink = '',
    ButtonLabel = 'New',
}: DataTableProps<T>) {
    const totalPages = Math.ceil(total / perPage);

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center gap-2">
                    {onSearch && (
                        <Input placeholder="Search..." value={searchValue || ''} 
                        onChange={(e) => onSearch(e.target.value)} className="w-64 bg-slate-100 border-slate-200 " />
                    )}
                    {columns
                        .filter((col) => col.filterable && col.filterOptions)
                        .map((col) => (
                            <Select
                                key={col.key as string}
                                value={filters[col.key as string] || ''}
                                onValueChange={(val) => onFilterChange && onFilterChange(col.key as string, val)}
                            >
                                <SelectTrigger className="w-40">{col.label}</SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="">All</SelectItem>
                                    {col.filterOptions!.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        ))}
                    <div className="flex-1" />
                    {ButtonLink && (
                        <Link
                            href={ButtonLink}
                            className="inline-flex items-center justify-center rounded bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            {ButtonLabel}
                        </Link>
                    )}
                </div>
        <Card className="overflow-x-auto rounded shadow-sm">
            <CardContent>
                
                <table className="min-w-full divide-y divide-border">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.key as string}
                                    className="cursor-pointer px-4 py-2 text-left text-xs font-medium text-muted-foreground select-none"
                                    onClick={() =>
                                        col.sortable &&
                                        onSortChange &&
                                        onSortChange(col.key as string, sortKey === col.key && sortDirection === 'asc' ? 'desc' : 'asc')
                                    }
                                >
                                    {col.label}
                                    {col.sortable && sortKey === col.key && <span className="ml-1">{sortDirection === 'asc' ? '▲' : '▼'}</span>}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columns.length} className="py-8 text-center">
                                    Loading...
                                </td>
                            </tr>
                        ) : data == null || data.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="py-8 text-center">
                                    No data found.
                                </td>
                            </tr>
                        ) : (
                            data.map((row) => (
                                <tr key={row.id} className="border-b">
                                    {columns.map((col) => (
                                        <td key={col.key as string} className="px-4 py-2 text-sm">
                                            {col.render ? col.render(row) : (row[col.key as keyof T] as React.ReactNode)}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                        {data && (
                            <span>
                                {' '}
                                Page {page} of {totalPages} ({total} items)
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
                            Previous
                        </Button>
                        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
                            Next
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
        </div>
    );
}
