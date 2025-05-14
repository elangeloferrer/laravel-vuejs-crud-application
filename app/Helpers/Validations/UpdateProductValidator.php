<?php

namespace App\Helpers\Validations;

use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;

class UpdateProductValidator
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
            'new_images' => [
                'array',
                'min:1',
            ],
            'new_images.*' => [
                'file',
                'mimes:jpeg,png,jpg,webp',
                'max:2048'
            ],
        ];
    }

    public static function messages(): array
    {
        return [
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a valid string.',

            'category.required' => 'The category field is required.',
            'category.string' => 'The category must be a valid string.',

            'description.required' => 'The description field is required.',

            'new_images.required' => 'Product Image is required.',
            'new_images.*.required' => 'Each product image is required.',
            'new_images.*.file'     => 'Each product image must be a valid file.',
            'new_images.*.mimes'    => 'Each product image must be a JPEG|JPG|PNG|WEBP file.',
            'new_images.*.max'      => 'Each product image must not exceed 2MB.',
        ];
    }
}
