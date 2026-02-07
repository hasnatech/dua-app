<?php

namespace App\Exports;

use App\Models\Pet;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PetExport implements FromQuery, WithHeadings, WithMapping
{
    protected $filters;

    public function __construct(array $filters)
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $search = $this->filters['search'] ?? null;
        $startDate = $this->filters['startDate'] ?? null;
        $endDate = $this->filters['endDate'] ?? null;
        $month = $this->filters['month'] ?? null;

        if ($month && (empty($startDate) || empty($endDate))) {
            $carbonMonth = Carbon::parse($month);
            $startDate = $carbonMonth->startOfMonth()->format('Y-m-d');
            $endDate = $carbonMonth->endOfMonth()->format('Y-m-d');
        }

        return Pet::query()
            ->with(['customer'])
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                        ->orWhere('id', 'like', "%{$search}%")
                        ->orWhere('petNumber', 'like', "%{$search}%")
                        ->orWhere('breed', 'like', "%{$search}%")
                        ->orWhereHas('customer', function ($cq) use ($search) {
                            $cq->where('name', 'like', "%{$search}%");
                        });
                });
            })
            ->when($startDate, function ($query, $startDate) {
                $query->whereDate('cremationDate', '>=', $startDate);
            })
            ->when($endDate, function ($query, $endDate) {
                $query->whereDate('cremationDate', '<=', $endDate);
            })
            ->latest();
    }

    public function headings(): array
    {
        return [
            'Gen. nummer',
            'datum',
            'naam',
            'dier',
            'Baasje',
            'km-vergoeding',
            'I/C',
            'Standaardurne',
            'Gewicht',
            'Prijs crematie',
            'Desaer',
            'Zels Addio',
            'Eeuwige roos',
            'Keramiek',
            'LoveUrns',
            'GFTD',
            'See You',
            'Eden',
            'Urn Art',
            'Texel Urns',
            'Strooiurne BW-Baron',
            'Tierurne',
            'Westdecor',
            'Gips afdruk',
            'Zondag / feestdag / nacht vergoeding',
            'Divers',
            'Opmerkingen algemeen',
            'Prijs urne',
            'Totaal',
            'Betalingswijze',
            'Factuurnr',
            'Betaling OK',
            'adres',
            'postcode + plaats',
            'gsm',
            'Dierenarts',
        ];
    }

    public function map($pet): array
    {
        return [
            $pet->petNumber,
            $pet->cremationDate ? Carbon::parse($pet->cremationDate)->format('l, j F Y') : '',
            $pet->name,
            $pet->type,
            $pet->customer ? $pet->customer->name : 'N/A',
            '', // km-vergoeding
            $pet->cremationType,
            '', // Standaardurne
            $pet->weight,
            $pet->price,
            '', // Desaer
            '', // Zels Addio
            '', // Eeuwige roos
            '', // Keramiek
            '', // LoveUrns
            '', // GFTD
            '', // See You
            '', // Eden
            '', // Urn Art
            '', // Texel Urns
            '', // Strooiurne BW-Baron
            '', // Tierurne
            '', // Westdecor
            $this->formatPawPrint($pet), // Gips afdruk
            $pet->isSundayOrFestival ? 'Yes' : '', // Zondag / feestdag / nacht vergoeding
            implode(', ', $pet->others ?? []), // Divers
            $pet->clientNotes,
            '', // Prijs urne
            '', // Totaal
            '', // Betalingswijze
            '', // Factuurnr
            '', // Betaling OK
            // $pet->status,
            $pet->customer ? $pet->customer->address : '',
            $pet->customer ? ($pet->customer->postalCode.' '.$pet->customer->city) : '',
            $pet->customer ? $pet->customer->phone : '',
            $pet->veterinaryName,
        ];
    }

    private function formatPawPrint($pet)
    {
        if (! empty($pet->specialRequestPawPrintClay)) {
            return 'Yes';
        }

        return '';
    }
}
