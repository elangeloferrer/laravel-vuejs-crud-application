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
        return [
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a valid string.',

            'category.required' => 'The category field is required.',
            'category.string' => 'The category must be a valid string.',

            'description.required' => 'The description field is required.',

            'product_images.required' => 'Product Image is required.',
            'product_images.*.required' => 'Each product image is required.',
            'product_images.*.file'     => 'Each product image must be a valid file.',
            'product_images.*.mimes'    => 'Each product image must be a JPEG|JPG|PNG|WEBP file.',
            'product_images.*.max'      => 'Each product image must not exceed 2MB.',
        ];
    }
}
