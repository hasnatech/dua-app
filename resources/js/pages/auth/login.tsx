import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, LoaderIcon } from 'lucide-react';
import { FormEventHandler, useRef, useState } from 'react';

import InputError from '@/components/input-error';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AuthLayout from '@/layouts/auth-layout';

type LoginForm = {
  email: string;
  password: string;
  remember: boolean;
  otp_arr: string[];
  otp: string;
};

interface LoginProps {
  status?: string;
  canResetPassword: boolean;
}

export default function Login({ status, canResetPassword }: LoginProps) {
  const [isOtpLogin, setIsOtpLogin] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
    email: '',
    password: '',
    remember: false,
    otp_arr: ['', '', '', '', '', ''],
    otp: '',
  });

  const submit: FormEventHandler = (e) => {
    e.preventDefault();
    post(route('login'), {
      onFinish: () => reset('password'),
    });
  };

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
      if (value) {
        if (index < 5) {
          otpInputRefs.current[index + 1]?.focus();
        }
        // else {
        //     // Last digit entered, submit OTP
        //     setData('otp', newOtp.join(''));
        //     console.log("newOtp", newOtp, data.otp_arr)
        //     setTimeout(() => {
        //         console.log("newOtp", newOtp, data.otp_arr)
        //         post(route('login.otp.verify'));
        //     }, 2000)
        // }
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
      otpInputRefs.current[5]?.focus(); // Focus on the last input after pasting
      post(route('login.otp.verify'));
    }
  };


  const renderPasswordForm = () => (
    <div>



      <form className="space-y-6" onSubmit={submit}>
        <div className="space-y-4">
          <div>
            <label htmlFor="email-address" className="">Email address</label>
            <input id="email-address" name="email" type="email" autoComplete="email" required
              className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Email address" value={data.email} onChange={(e) => setData(d => ({ ...d, email: e.target.value }))} disabled={processing} />



          </div>
          <div>
            <label htmlFor="password" className="">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required
              className="w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Password" value={data.password} onChange={(e) => setData(d => ({ ...d, password: e.target.value }))} disabled={processing} />
          </div>
          {errors.email && <InputError message={errors.email} />}
        </div>
        {/* <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            checked={data.remember} onChange={(e) => setData(d => ({...d, remember: e.target.checked}))} />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
        </div>
        <div className="text-sm">
          <button type="button" className="font-medium text-primary hover:text-green-700">Forgot your password?</button>
        </div>
      </div> */}
        <button type="submit" disabled={processing} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-primary hover:bg-highlight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-slate-300">
          {processing && <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
          Sign in
        </button>
        <div className='space-y-8'></div>
      </form>

    </div>
  );

  const renderOtpRequestForm = () => (
    <form className="space-y-6" onSubmit={submitOtpRequest}>
      <div>
        <label htmlFor="email-otp-request" className="sr-only">Email address</label>
        <input id="email-otp-request" name="email" type="email" autoComplete="email" required
          className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          placeholder="email@example.com" value={data.email} onChange={(e) => setData(d => ({ ...d, email: e.target.value }))} disabled={processing} autoFocus
        />
      </div>
      <button type="submit" disabled={processing} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-green-300">
        {processing && <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
        Send OTP
      </button>
    </form>
  );

  const renderOtpVerifyForm = () => (
    <form className="space-y-6" onSubmit={submitOtpVerify}>
      <div className="text-center">
        <p className="text-sm text-gray-600">Enter the 6-digit code sent to:</p>
        <p className="font-medium text-dark">{data.email}</p>
      </div>
      <div>
        <label className="sr-only">OTP</label>
        <div className="flex justify-center space-x-2">
          {data.otp_arr.map((digit, index) => (
            <input key={index} id={`otp-${index}`} type="text" inputMode="numeric" maxLength={1} value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleOtpKeyDown(e, index)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              ref={(el) => { otpInputRefs.current[index] = el; }}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-md focus:ring-primary focus:border-primary"
              disabled={processing} required
            />
          ))}
        </div>
      </div>
      <button type="submit" disabled={processing} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-full text-white bg-primary hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:bg-green-300">
        {processing && <LoaderIcon className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
        Verify & Sign In
      </button>
    </form>
  );

  return (
    <div className="bg-emerald-50 min-h-screen flex items-start justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-10 rounded-xl shadow-lg">
        <div className="flex justify-center">
          <img src="/images/logo.png" alt="" className='w-32' />
        </div>
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-dark font-serif">
            {isOtpLogin ? 'Sign in with OTP' : 'Sign in to your account'}
          </h2>
        </div>

        {isOtpLogin ? (otpSent ? renderOtpVerifyForm() : renderOtpRequestForm()) : renderPasswordForm()}

        {/* <div className="text-center">
            <button onClick={() => { setIsOtpLogin(!isOtpLogin); setOtpSent(false); }} className="font-medium text-primary hover:text-green-700 text-sm">
                {isOtpLogin ? 'Sign in with password' : 'Sign in with OTP'}
            </button>
        </div> */}

        {/* <div className="text-center">
          <p className="text-sm">
            Don't have an account?{' '}
            <Link href={route('register')} className="font-medium text-primary hover:text-green-700">
              Register here
            </Link>
          </p>
        </div> */}
      </div>
    </div>
  );
};

