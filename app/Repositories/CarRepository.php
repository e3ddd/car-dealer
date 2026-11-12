<?php

namespace App\Repositories;

use App\CRUDInterface;
use App\Models\Car;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class CarRepository implements CRUDInterface
{
    public function __construct(protected Car $car) {}

    public function get(int $id): Car
    {
        return $this->car->findOrFail($id);
    }

    public function index(): Collection
    {
        return $this->car->with('dealer.manufactures')->get();
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function filter(array $filters): Collection
    {
        $query = $this->car->newQuery()->with(['dealer.manufactures']);

        foreach (['id', 'size', 'color', 'fuel', 'dealer_id'] as $field) {
            $value = $filters[$field] ?? null;

            if ($value === null || $value === '') {
                continue;
            }

            $query->where($field, $value);
        }

        $manufactureId = $filters['manufacture_id'] ?? null;

        if ($manufactureId !== null && $manufactureId !== '') {
            $query->whereHas('dealer.manufactures', function (Builder $builder) use ($manufactureId): void {
                $builder->where('manufactures.id', $manufactureId);
            });
        }

        return $query->get();
    }

    public function create(array $data): Car
    {
        return $this->car->create($data);
    }

    public function update(int $id, array $data): int
    {
        return $this->car->find($id)->update($data);
    }

    public function delete(int $id): void
    {
        $this->car->destroy($id);
    }
}
