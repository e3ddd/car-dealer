<?php

namespace App\Http\Controllers;

use App\Http\Requests\CreateDealerRequest;
use App\Http\Requests\DeleteDealerRequest;
use App\Http\Requests\UpdateDealerRequest;
use App\Repositories\DealerRepository;
use App\Repositories\ManufactureRepository;
use App\Services\DealerService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DealerController extends Controller
{
    public function __construct(
        protected DealerService $dealerService,
        protected DealerRepository $dealerRepository,
        protected ManufactureRepository $manufactureRepository,
    ) {}

    public function index(): JsonResponse
    {
        $dealers = $this->dealerRepository->index();

        return response()->json($dealers);
    }

    public function create(CreateDealerRequest $request)
    {
        $data = $request->validated();

        $newDealer = $this->dealerService->create(
            $data['city'],
            $data['country'],
            $data['manufacture_id'],
            $data['employees_count'] ?? 0,
        );

        return response()->json($newDealer->load('manufacture'));
    }

    public function update(UpdateDealerRequest $request)
    {
        $data = $request->validated();

        $this->dealerRepository->update($data['dealer_id'], $data['data']);

        return response()->json(['message' => 'Dealer updated successfully']);
    }

    public function delete(DeleteDealerRequest $request)
    {
        $this->dealerRepository->delete($request->dealer_id);

        return response()->json(['message' => 'Dealer deleted successfully']);
    }

    public function search(Request $request): JsonResponse
    {
        $term = $request->string('term')->toString();

        return response()->json($this->dealerService->search($term));
    }

    public function filter(Request $request): JsonResponse
    {
        return response()->json($this->dealerService->filter(
            $request->only(['id', 'city', 'country', 'manufacture_id', 'cars_count', 'employees_count']),
        ));
    }

    public function getManufactures()
    {
        return $this->manufactureRepository->index()->pluck('name', 'id');
    }
}
