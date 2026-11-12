<?php

namespace App\Services;

use App\Models\Dealer;
use App\Repositories\DealerRepository;
use App\TableToolsClass;
use Illuminate\Database\Eloquent\Collection;

class DealerService
{
    public function __construct(protected DealerRepository $dealerRepository) {}

    public function create(string $city, string $country, int $manufactureId, int $employeesCount = 0): Dealer
    {
        return $this->dealerRepository->create([
            'city' => $city,
            'country' => $country,
            'manufacture_id' => $manufactureId,
            'employees_count' => $employeesCount,
            'cars_count' => 0,
        ]);
    }

    public function search(string $term): Collection
    {
        return $this->tableTools()->search($term);
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function filter(array $filters): Collection
    {
        return $this->tableTools()->filter($filters);
    }

    private function tableTools(): TableToolsClass
    {
        return new TableToolsClass(
            new Dealer,
            ['id', 'city', 'country', 'manufacture_id', 'cars_count', 'employees_count'],
            ['manufacture'],
        );
    }
}
