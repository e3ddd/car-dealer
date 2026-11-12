<?php

namespace App\Services;

use App\CarColorsEnum;
use App\CarFuelTypesEnum;
use App\CarSizesEnum;
use App\Models\Car;
use App\Repositories\CarRepository;
use App\Repositories\DealerRepository;
use App\TableToolsClass;
use BackedEnum;
use Illuminate\Database\Eloquent\Builder;
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

    public function search(string $term): Collection
    {
        return $this->tableTools()->search($term, function (Builder $builder, string $searchTerm): void {
            $this->applyEnumSearch($builder, 'size', CarSizesEnum::cases(), $searchTerm);
            $this->applyEnumSearch($builder, 'color', CarColorsEnum::cases(), $searchTerm);
            $this->applyEnumSearch($builder, 'fuel', CarFuelTypesEnum::cases(), $searchTerm);
        });
    }

    public function filter(array $filters): Collection
    {
        return $this->tableTools()->filter($filters);
    }

    private function applyEnumSearch(Builder $builder, string $column, array $cases, string $term): void
    {
        foreach ($cases as $case) {
            if (! str_contains(strtolower($case->name), strtolower($term))) {
                continue;
            }

            $builder->orWhere($column, $case->value);
        }
    }

    private function tableTools(): TableToolsClass
    {
        return new TableToolsClass(
            new Car,
            ['id', 'size', 'color', 'fuel', 'dealer_id'],
            ['dealer.manufacture'],
            [
                'dealer' => ['city', 'country'],
                'dealer.manufacture' => ['name'],
            ],
        );
    }
}
