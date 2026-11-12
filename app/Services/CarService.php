<?php

namespace App\Services;

use App\Models\Car;
use App\Repositories\CarRepository;
use App\Repositories\DealerRepository;
use Illuminate\Database\Eloquent\Collection;

class CarService
{
    public function __construct(
        protected CarRepository $carRepository,
        protected DealerRepository $dealerRepository,
    ) {}

    public function create(int $dealerId, string $size, string $color, string $fuel): Car
    {
        $car = $this->carRepository->create([
            'dealer_id' => $dealerId,
            'size' => $size,
            'color' => $color,
            'fuel' => $fuel,
        ]);

        $dealer = $this->dealerRepository->get($dealerId);

        $this->dealerRepository->incrementCarsCounter($dealer);

        return $car;
    }

    public function delete(int $carId): void
    {
        $car = $this->carRepository->get($carId);
        $dealer = $this->dealerRepository->get($car->dealer_id);

        $this->carRepository->delete($carId);
        $this->dealerRepository->decrementCarsCounter($dealer);
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function filter(array $filters): Collection
    {
        return $this->carRepository->filter($filters);
    }
}
