@component('mail::message')
Thanks for applying for the job!

@component('mail::panel')
**Job Title:** {{ $job_application->opening->title }}  

**Name:** {{ $job_application->user->name }}  
**Cover:** {{ $job_application->cover_intro }}  

Our team will be in contacting you soon!
Thanks,
{{ config('app.name') }}
@endcomponent
