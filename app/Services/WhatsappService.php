<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WhatsappService
{
    protected $phoneNumberId;

    protected $accessToken;

    public function __construct()
    {
        $this->phoneNumberId = env('WABA_PHONE_NUMBER_ID');
        $this->accessToken = env('WABA_ACCESS_TOKEN');
    }

    /**
     * Send WhatsApp message directly using Meta WABA Cloud API
     *
     * @param  string  $to  E.g. "917000000000" (NO whatsapp: prefix)
     * @return array
     */
    public function sendMessage(string $to, string $message)
    {
        $url = "https://graph.facebook.com/v23.0/{$this->phoneNumberId}/messages";

        $payload = [
            'messaging_product' => 'whatsapp',
            'to' => $to,
            'type' => 'text',
            'text' => [
                'preview_url' => false,
                'body' => $message,
            ],
        ];

        $response = Http::withToken($this->accessToken)
            ->post($url, $payload);

        // Log::info('WhatsApp API Request', [
        //     'url' => $url,
        //     'payload' => $payload,
        //     'response' => $response->json(),
        // ]);

        return $response->json();
    }
}

/*namespace App\Services;

use Twilio\Rest\Client;

class WhatsappService
{
    protected $twilio;

    public function __construct()
    {
        $this->twilio = new Client(
            env('TWILIO_SID'),
            env('TWILIO_AUTH_TOKEN')
        );
    }


    public function sendMessage(string $to, string $message)
    {
        // dd($to, $message);
        $msg = $this->twilio->messages->create(
            'whatsapp:' . $to,
            [
                'from' => env('TWILIO_WHATSAPP_FROM'),
                'body' => $message,
            ]
        );

        // Convert the response to array
        return [
            'sid' => $msg->sid,
            'status' => $msg->status,
            'to' => $msg->to,
            'from' => $msg->from,
            'body' => $msg->body,
            'date_created' => $msg->dateCreated->format('Y-m-d H:i:s'),
        ];
    }
}
*/
