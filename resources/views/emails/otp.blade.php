@component('mail::message')
# Your OTP Code

Your one-time password (OTP) is:

@component('mail::panel')
{{ $otp }}
@endcomponent

This code is valid for 10 minutes.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
