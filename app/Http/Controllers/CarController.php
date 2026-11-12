<?php

namespace App\Http\Controllers;

use App\CarColorsEnum;
use App\CarFuelTypesEnum;
use App\CarSizesEnum;
use App\Http\Requests\CreateCarRequest;
use App\Http\Requests\DeleteCarRequest;
use App\Http\Requests\UpdateCarRequest;
use App\Repositories\CarRepository;
use App\Services\CarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CarController extends Controller
{
    public function __construct(protected CarService $carService, protected CarRepository $carRepository) {}

    public function index(): JsonResponse
    {
        $cars = $this->carRepository->index();

        return response()->json($cars);
    }

    public function create(CreateCarRequest $request)
    {
        $data = $request->validated();

        $newCar = $this->carService->create($data['dealer_id'], $data['size'], $data['color'], $data['fuel']);

        return response()->json($newCar->load('dealer.manufactures'));
    }

    public function update(UpdateCarRequest $request)
    {
        $data = $request->validated();

        $this->carRepository->update($data['car_id'], $data['data']);

        return response()->json(['message' => 'Car updated successfully']);
    }

    public function delete(DeleteCarRequest $request)
    {
        $this->carService->delete($request->car_id);

        return response()->json(['message' => 'Car deleted successfully']);
    }

    public function filter(Request $request): JsonResponse
    {
        return response()->json($this->carService->filter(
            $request->only(['id', 'size', 'color', 'fuel', 'dealer_id', 'manufacture_id']),
        ));
    }

    public function getSizes()
    {
        return CarSizesEnum::sizes();
    }

    public function getColors()
    {
        return CarColorsEnum::colors();
    }

    public function getTypes()
    {
        return CarFuelTypesEnum::types();
    }
}
