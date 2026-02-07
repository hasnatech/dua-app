<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Mail\OtpMail;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;

class OtpController extends Controller
{
    public function create()
    {
        return Inertia::render('auth/OtpLogin');
    }

    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();
        $otp = rand(100000, 999999);

        $user->update([
            'otp' => $otp,
            'otp_created_at' => now(),
        ]);

        Mail::to($user->email)->send(new OtpMail($otp));

        return back()->with('success', 'OTP has been sent to your email.');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user->otp || $request->otp != $user->otp) {
            return back()->withErrors(['otp' => 'Invalid OTP.']);
        }

        if (now()->diffInMinutes($user->otp_created_at) > 10) {
            return back()->withErrors(['otp' => 'OTP has expired.']);
        }

        Auth::login($user);
        $user->update(['otp' => null, 'otp_created_at' => null]);
        $request->session()->regenerate();

        return redirect()->intended('/');
    }
}
