<?php

namespace App\Services;

use App\Models\Manufacture;
use App\Repositories\ManufactureRepository;

class ManufactureService
{
    public function __construct(protected ManufactureRepository $manufactureRepository) {}

    public function create(string $name): Manufacture
    {
        return $this->manufactureRepository->create([
            'name' => $name,
        ]);
    }
}
