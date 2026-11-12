<?php

namespace App\Repositories;

use App\CRUDInterface;
use App\Models\Dealer;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

class DealerRepository implements CRUDInterface
{
    public function __construct(protected Dealer $dealer) {}

    public function get(int $id): Dealer
    {
        return $this->dealer->find($id);
    }

    public function index(): Collection
    {
        return $this->dealer->with('manufactures')->get();
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function filter(array $filters): Collection
    {
        $query = $this->dealer->newQuery()->with(['manufactures']);

        foreach (['id', 'city', 'country', 'cars_count', 'employees_count'] as $field) {
            $value = $filters[$field] ?? null;

            if ($value === null || $value === '') {
                continue;
            }

            $query->where($field, $value);
        }

        $manufactureId = $filters['manufacture_id'] ?? null;

        if ($manufactureId !== null && $manufactureId !== '') {
            $query->whereHas('manufactures', function (Builder $builder) use ($manufactureId): void {
                $builder->where('manufactures.id', $manufactureId);
            });
        }

        return $query->get();
    }

    public function create(array $data): Dealer
    {
        return $this->dealer->create($data);
    }

    public function update(int $id, array $data): int
    {
        return $this->dealer->find($id)->update($data);
    }

    public function delete(int $id): void
    {
        $this->dealer->destroy($id);
    }

    public function incrementCarsCounter(Dealer $dealer): void
    {
        $dealer->cars_count += 1;
        $dealer->save();
    }

    public function decrementCarsCounter(Dealer $dealer): void
    {
        if ($dealer->cars_count > 0) {
            $dealer->cars_count -= 1;
            $dealer->save();
        }
    }
}
