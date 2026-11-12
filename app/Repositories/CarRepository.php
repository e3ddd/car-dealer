<?php

namespace App\Repositories;

use App\CRUDInterface;
use App\Models\Car;
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
        return $this->car->with('dealer.manufacture')->get();
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
