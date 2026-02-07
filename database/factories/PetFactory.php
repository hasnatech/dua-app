<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class PetFactory extends Factory
{
    private static $sequence = 9201;

    public function definition(): array
    {
        return [
            'petNumber' => self::$sequence++,
            'tagNumber' =>  (string) rand(100000000000000, 999999999999999),
            'date' => now()->toDateString(),
            'user_id' => 1,
            'status' => 'Waiting',
            'name' => $this->faker->firstName,
            'breed' => 'Breed '.$this->faker->numberBetween(1, 5),
            'type' => null,
            'gender' => $this->faker->randomElement(['Male', 'Female']),
            'weight' => $this->faker->randomFloat(2, 1, 20),
            'age' => $this->faker->numberBetween(1, 15),
            'dateOfDeath' => now()->subDays($this->faker->numberBetween(1, 10)),
            'hasProstheses' => 1,
            'prosthesesDetails' => 'Prostheses Details',
            'customer_id' => 1,
            'pickupEveningTime' => null,
            'isSundayOrFestival' => $this->faker->boolean(),
            'clientNotes' => 'WhatsApp Notifications',
            'cremationDate' => (rand(0, 3) ? now() : now()->addDay())->format('Y-m-d H:i:s'),
            'urnOrder' => 1,
            'urnSupplier' => 1,
            'urnDetails' => 'Urn Details',

            'jewelry' => json_encode([
                'select' => '4',
                'details' => 'Jewelry Details',
                'enabled' => true,
                'description' => 'Jewelry Details',
            ]),

            'engraving' => json_encode([
                'details' => 'Engraving Details',
                'enabled' => true,
                'completed' => true,
                'description' => 'Engraving Details',
            ]),

            'others' => json_encode([
                'details' => 'Others Details1',
                'enabled' => true,
                'description' => 'Others Details',
            ]),

            'others2' => json_encode([
                'details' => 'Others Details2',
                'enabled' => true,
                'description' => 'Others Details',
            ]),

            'pickupMethod' => null,
            'price' => '0.00',
            'veterinaryName' => null,
            'wantsWhatsappUpdates' => $this->faker->boolean(),
            'whatsappStart' => rand(0, 1),
            'whatsappFinish' => rand(0, 1),
            'cremationType' => 'Individual',

            'specialRequestUrn' => null,

            'specialRequestJewelryOrder' => null,

            'specialRequestOther' => json_encode([
                'urn' => 0,
                'disc' => 0,
                'enabled' => false,
                'quantity' => 1,
                'description' => null,
            ]),

            'specialRequestPawPrintInk' => json_encode([
                'urn' => 0,
                'disc' => 0,
                'enabled' => true,
                'quantity' => 2,
                'completed' => true,
                'description' => 'Paw Print (Ink) Details',
            ]),

            'specialRequestPawPrintClay' => json_encode([
                'urn' => 5,
                'disc' => 4,
                'enabled' => true,
                'quantity' => 1,
                'completed' => true,
                'description' => 'Paw Print (Clay) Details',
            ]),

            'specialRequestHairPluck' => json_encode([
                'urn' => 0,
                'disc' => 0,
                'enabled' => true,
                'quantity' => 3,
                'completed' => true,
                'description' => 'Hair Pluck Details',
            ]),

            'specialRequestNoseImprint' => json_encode([
                'urn' => 0,
                'disc' => 0,
                'enabled' => true,
                'quantity' => 6,
                'completed' => true,
                'description' => 'Nose Imprint Details',
            ]),

            'lastViewing' => null,

            'following' => json_encode([
                'enabled' => true,
                'datetime' => '2025-10-09 13:00:00',
                'description' => 'Following Details',
            ]),

            'pickupDateTime' => fake()->dateTimeBetween('-3 days', '+3 days'),
        ];
    }
}
