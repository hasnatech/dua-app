<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class JobApplicationMail extends Mailable
{
    use Queueable, SerializesModels;
    public $job_application;
    /**
     * Create a new message instance.
     */
    public function __construct($job_application)
    {
        $this->job_application = $job_application;
    }

    
    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        // return $this->view('emails.otp');
        return $this->markdown('emails.job_application')->subject('New Job Application Received');
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
