<?php

namespace App\Http\Requests;

use App\CarColorsEnum;
use App\CarFuelTypesEnum;
use App\CarSizesEnum;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CreateCarRequest extends FormRequest
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
            'size' => ['required', Rule::enum(CarSizesEnum::class)],
            'color' => ['required', Rule::enum(CarColorsEnum::class)],
            'fuel' => ['required', Rule::enum(CarFuelTypesEnum::class)],
            'dealer_id' => 'required|exists:dealers,id',
        ];
    }
}
