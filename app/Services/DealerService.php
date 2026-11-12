<?php

namespace App\Services;

use App\Models\Dealer;
use App\Repositories\DealerRepository;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Facades\DB;

class DealerService
{
    public function __construct(protected DealerRepository $dealerRepository) {}

    /**
     * @param  list<int>  $manufactureIds
     */
    public function create(string $city, string $country, array $manufactureIds, int $employeesCount = 0): Dealer
    {
        return DB::transaction(function () use ($city, $country, $manufactureIds, $employeesCount): Dealer {
            $dealer = $this->dealerRepository->create([
                'city' => $city,
                'country' => $country,
                'employees_count' => $employeesCount,
                'cars_count' => 0,
            ]);

            $dealer->manufactures()->sync($manufactureIds);

            return $dealer->load('manufactures');
        });
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(int $dealerId, array $data): void
    {
        DB::transaction(function () use ($dealerId, $data): void {
            $manufactureIds = $data['manufacture_ids'] ?? null;
            unset($data['manufacture_ids']);

            if ($data !== []) {
                $this->dealerRepository->update($dealerId, $data);
            }

            if (is_array($manufactureIds)) {
                $dealer = $this->dealerRepository->get($dealerId);
                $dealer->manufactures()->sync($manufactureIds);
            }
        });
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function filter(array $filters): Collection
    {
        return $this->dealerRepository->filter($filters);
    }
}
