<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateManufactureRequest extends FormRequest
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
            'manufacture_id' => 'required|exists:manufactures,id',
            'data' => 'required|array',
            'data.name' => [
                'sometimes',
                'string',
                'max:255',
                Rule::unique('manufactures', 'name')->ignore($this->input('manufacture_id')),
            ],
        ];
    }
}
