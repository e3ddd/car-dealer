<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateManufactureRequest;
use App\Http\Requests\DeleteManufactureRequest;
use App\Http\Requests\UpdateManufactureRequest;
use App\Repositories\ManufactureRepository;
use App\Services\ManufactureService;
use Illuminate\Http\JsonResponse;

class ManufactureController extends Controller
{
    public function __construct(
        protected ManufactureService $manufactureService,
        protected ManufactureRepository $manufactureRepository,
    ) {}

    public function index(): JsonResponse
    {
        $manufactures = $this->manufactureRepository->index();

        return response()->json($manufactures);
    }

    public function create(CreateManufactureRequest $request)
    {
        $data = $request->validated();

        $newManufacture = $this->manufactureService->create($data['name']);

        return response()->json($newManufacture->loadCount('dealers'));
    }

    public function update(UpdateManufactureRequest $request)
    {
        $data = $request->validated();

        $this->manufactureRepository->update($data['manufacture_id'], $data['data']);

        return response()->json(['message' => 'Manufacture updated successfully']);
    }

    public function delete(DeleteManufactureRequest $request)
    {
        $this->manufactureRepository->delete($request->manufacture_id);

        return response()->json(['message' => 'Manufacture deleted successfully']);
    }
}
