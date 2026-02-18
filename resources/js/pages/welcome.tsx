import { type SharedData } from '@/types';
import { Head, usePage } from '@inertiajs/react';
// import HomePage from './Home/HomePage';

export default function Welcome({ pets }: any) {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome" />
            <h1>Welcome to Dua App</h1>
            {/* <HomePage/> */}
        </>
    );
}
