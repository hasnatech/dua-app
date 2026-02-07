@component('mail::message')
# New Job Application Received

A new job application has been submitted.

@component('mail::panel')
**Job Title:** {{ $job_application->opening->title }}  

**Name:** {{ $job_application->user->name }}  
**Email:** {{ $job_application->user->email }}  
**Phone:** {{ $job_application->user->phone }}  

**Cover:** {{ $job_application->cover_intro }}  
**Current CTC:** {{ $job_application->current_ctc }}  
**Expected CTC:** {{ $job_application->expected_ctc }}  


{{ config('app.name') }}
@endcomponent
