<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateDealerRequest extends FormRequest
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
            'dealer_id' => ['required', 'exists:dealers,id'],
            'data' => ['required', 'array'],
            'data.city' => ['sometimes', 'string', 'max:255'],
            'data.country' => ['sometimes', 'string', 'max:255'],
            'data.manufacture_ids' => ['sometimes', 'array', 'min:1'],
            'data.manufacture_ids.*' => ['integer', 'exists:manufactures,id'],
            'data.employees_count' => ['sometimes', 'integer', 'min:0'],
        ];
    }
}
