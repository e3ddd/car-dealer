<?php

namespace App\Services;

use App\Models\Manufacture;
use App\Repositories\ManufactureRepository;
use App\TableToolsClass;
use Illuminate\Database\Eloquent\Collection;

class ManufactureService
{
    public function __construct(protected ManufactureRepository $manufactureRepository) {}

    public function create(string $name): Manufacture
    {
        return $this->manufactureRepository->create([
            'name' => $name,
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
            new Manufacture,
            ['id', 'name'],
        );
    }
}
