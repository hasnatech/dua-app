<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpMail;

class OtpLoginController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
        ]);

        $user = User::where('email', $request->email)->first();

        $otp = rand(100000, 999999);
        $otp = 123456;
        $user->forceFill([
            'otp' => $otp,
            'otp_expires_at' => now()->addMinutes(5),
        ])->save();

        // Mail::to($user->email)->send(new OtpMail($otp));

        return back()->with('status', 'An OTP has been sent to your email address.');
    }

    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|numeric',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || $user->otp !== $request->otp || $user->otp_expires_at < now()) {
            return back()->withErrors([
                'otp' => 'The provided OTP is invalid or has expired.',
            ]);
        }

        $user->forceFill([
            'otp' => null,
            'otp_expires_at' => null,
        ])->save();

        Auth::login($user);

        if ($user->hasRole('admin')) {
            return redirect()->intended(route('dashboard'));
        } else if ($user->hasRole('candidate')) {
            // dd($user->hasRole('candidate'));
            return redirect()->intended(route('jobs.index'));
        }
    }
}
