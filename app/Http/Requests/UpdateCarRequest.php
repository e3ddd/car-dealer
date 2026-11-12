<?php

namespace App\Http\Requests;

use App\CarColorsEnum;
use App\CarFuelTypesEnum;
use App\CarSizesEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'car_id' => 'required|exists:cars,id',
            'data' => 'required|array',

            'data.size' => ['sometimes', Rule::enum(CarSizesEnum::class)],
            'data.color' => ['sometimes', Rule::enum(CarColorsEnum::class)],
            'data.fuel' => ['sometimes', Rule::enum(CarFuelTypesEnum::class)],
            'data.dealer_id' => 'sometimes|exists:dealers,id',
        ];
    }
}
