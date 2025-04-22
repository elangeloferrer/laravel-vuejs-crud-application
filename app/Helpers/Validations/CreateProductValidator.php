<?php

namespace App\Helpers\Validations;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class CreateProductValidator
{

    public static function validate(Request $request)
    {
        return Validator::make($request->all(), self::rules(), self::messages());
    }

    public static function rules(): array
    {
        return [
            'name' => [
                'required',
                'string'
            ],
            'category' => [
                'required',
                'string'
            ],
            'description' => [
                'required',
                'string'
            ],
            'product_images' => [
                'required',
                'array',
                'min:1',
            ],
            'product_images.*' => [
                'required',
                'file',
                'mimes:jpeg,png,jpg,webp',
                'max:2048'
            ],
        ];
    }

    public static function messages(): array
    {
        return [];
    }
}
