<?php

namespace App\Repositories;

use App\CRUDInterface;
use App\Models\Manufacture;
use Illuminate\Database\Eloquent\Collection;

class ManufactureRepository implements CRUDInterface
{
    public function __construct(protected Manufacture $manufacture) {}

    public function index(): Collection
    {
        return $this->manufacture->all();
    }

    public function create(array $data): Manufacture
    {
        return $this->manufacture->create($data);
    }

    public function update(int $id, array $data): int
    {
        return $this->manufacture->find($id)->update($data);
    }

    public function delete(int $id): void
    {
        $this->manufacture->destroy($id);
    }
}
