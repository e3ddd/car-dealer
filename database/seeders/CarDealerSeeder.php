<?php

namespace Database\Seeders;

use App\CarColorsEnum;
use App\CarFuelTypesEnum;
use App\CarSizesEnum;
use App\Models\Car;
use App\Models\Dealer;
use App\Models\Manufacture;
use Illuminate\Database\Seeder;

class CarDealerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $manufacturerNames = [
            'BMW',
            'Audi',
            'Mercedes',
            'Volkswagen',
            'Ford',
        ];

        $manufactures = collect($manufacturerNames)->map(
            fn (string $name): Manufacture => Manufacture::query()->firstOrCreate(['name' => $name]),
        );

        $dealers = collect(range(1, 5))->map(function () use ($manufactures): Dealer {
            $dealer = Dealer::query()->create([
                'city' => fake()->city(),
                'country' => fake()->countryCode(),
                'employees_count' => fake()->numberBetween(5, 80),
                'cars_count' => 0,
            ]);

            $dealer->manufactures()->sync(
                $manufactures->random(fake()->numberBetween(1, 3))->pluck('id')->all(),
            );

            return $dealer;
        });

        $carsToCreate = fake()->numberBetween(1, 10);

        for ($index = 0; $index < $carsToCreate; $index++) {
            $dealer = $dealers->random();

            Car::query()->create([
                'dealer_id' => $dealer->id,
                'size' => fake()->randomElement(CarSizesEnum::cases())->value,
                'color' => fake()->randomElement(CarColorsEnum::cases())->value,
                'fuel' => fake()->randomElement(CarFuelTypesEnum::cases())->value,
            ]);

            $dealer->increment('cars_count');
        }
    }
}
