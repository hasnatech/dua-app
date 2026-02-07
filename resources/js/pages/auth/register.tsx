import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Link, useForm } from '@inertiajs/react';
import { LoaderIcon } from 'lucide-react';
import { FormEventHandler } from 'react';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: 'candidate' | 'company';
};

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: 'candidate',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="bg-primary-light flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-lg space-y-8 rounded-xl bg-white p-10 shadow-lg">
                <div>
                    <h2 className="text-dark mt-6 text-center font-serif text-3xl font-bold">Create an account</h2>
                    <p className="mt-2 text-center text-sm text-gray-600">Enter your details below to create your account</p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={submit}>
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                value={data.name}
                                onChange={(e) => setData((d) => ({ ...d, name: e.target.value }))}
                                disabled={processing}
                                className={"relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary focus:outline-none sm:text-sm"
                                    + (errors.name ? ' border-red-500' : '')
                                }
                                placeholder="Full name"
                            />
                            <InputError message={errors.name} />
                        </div>
                        <div>
                            <label htmlFor="email-address-register" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email-address-register"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                                disabled={processing}
                                className={"relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary focus:outline-none sm:text-sm"
                                    + (errors.email ? ' border-red-500' : '')
                                }
                                placeholder="Email address"
                            />
                            <InputError message={errors.email} />
                        </div>
                        <div>
                            <label htmlFor="password-register" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password-register"
                                name="password"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password}
                                onChange={(e) => setData((d) => ({ ...d, password: e.target.value }))}
                                disabled={processing}
                                className={"relative block w-full appearance-none rounded-none border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary focus:outline-none sm:text-sm"
                                    + (errors.password ? ' border-red-500' : '')
                                }
                                placeholder="Password"
                            />
                            <InputError message={errors.password} />
                        </div>
                        <div>
                            <label htmlFor="password_confirmation" className="sr-only">
                                Confirm Password
                            </label>
                            <input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                required
                                autoComplete="new-password"
                                value={data.password_confirmation}
                                onChange={(e) => setData((d) => ({ ...d, password_confirmation: e.target.value }))}
                                disabled={processing}
                                className={"relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary focus:outline-none sm:text-sm"
                                    + (errors.password_confirmation ? ' border-red-500' : '')
                                }
                                placeholder="Confirm Password"
                            />
                            
                            <InputError message={errors.password_confirmation} />
                        </div>
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={processing}
                            className="group relative flex w-full justify-center rounded-full border border-transparent bg-primary px-4 py-3 text-sm font-medium text-white hover:bg-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:outline-none disabled:bg-slate-300"
                        >
                            {processing && <LoaderIcon className="mr-3 -ml-1 h-5 w-5 animate-spin text-white" />}
                            Create account
                        </Button>
                    </div>
                </form>
                <div className="text-center">
                    <p className="text-sm">
                        Already have an account?{' '}
                        <Link href={route('login')} className="font-medium text-primary hover:text-green-700">
                            Log in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
