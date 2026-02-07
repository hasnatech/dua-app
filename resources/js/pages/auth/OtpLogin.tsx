import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type OtpLoginForm = {
    email: string;
    otp_arr: string[];
    otp: string;
};

export default function OtpLogin({ status }: { status?: string }) {
    const [otpSent, setOtpSent] = useState(false);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const { data, setData, post, processing, errors } = useForm<Required<OtpLoginForm>>({
        email: '',
        otp_arr: ['', '', '', '', '', ''],
        otp: '',
    });

    const submitOtpRequest: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.otp.store'), {
            onSuccess: () => setOtpSent(true),
        });
    };

    const submitOtpVerify: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login.otp.verify'));
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^\d*$/.test(value) && value.length <= 1) {
            const newOtp = [...data.otp_arr];
            newOtp[index] = value;
            setData('otp_arr', newOtp);
            setData('otp', newOtp.join(''));
            if (value && index < 5) {
                otpInputRefs.current[index + 1]?.focus();
            }
        }
    };

    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && !data.otp_arr[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };

    const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text/plain').trim();
        if (/^\d{6}$/.test(pastedData)) {
            const newOtp = pastedData.split('');
            setData('otp_arr', newOtp);
            setData('otp', newOtp.join(''));
            otpInputRefs.current[5]?.focus();
            post(route('login.otp.verify'));
        }
    };

    return (
        <AuthLayout title="Sign in with OTP" description="Enter your email to receive a one-time password.">
            <Head title="Sign in with OTP" />

            {!otpSent ? (
                <form className="flex flex-col gap-6" onSubmit={submitOtpRequest}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="email@example.com"
                            />
                            <InputError message={errors.email} />
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={2} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Send OTP
                        </Button>
                    </div>
                </form>
            ) : (
                <form className="flex flex-col gap-6" onSubmit={submitOtpVerify}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email address</Label>
                            <Input id="email" type="email" readOnly value={data.email} className="bg-gray-100 cursor-not-allowed" />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="otp">One-Time Password</Label>
                            <div className="flex space-x-2">
                                {data.otp_arr.map((digit, index) => (
                                    <Input
                                        key={index}
                                        id={`otp-${index}`}
                                        type="text"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(e, index)}
                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                        onPaste={index === 0 ? handleOtpPaste : undefined}
                                        ref={(el) => (otpInputRefs.current[index] = el)}
                                        className="w-12 text-center"
                                        tabIndex={index + 1}
                                    />
                                ))}
                            </div>
                            <InputError message={errors.otp} />
                        </div>

                        <Button type="submit" className="mt-4 w-full" tabIndex={7} disabled={processing}>
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            Log in
                        </Button>
                    </div>
                </form>
            )}

            <div className="mt-4 text-center text-sm">
                <TextLink href={route('login')}>Sign in with password</TextLink>
            </div>

            {status && <div className="mb-4 text-center text-sm font-medium text-green-600">{status}</div>}
        </AuthLayout>
    );
}
