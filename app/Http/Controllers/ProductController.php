<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Services\ProductServiceInterface;

use App\Helpers\Validations\CreateProductValidator;
use App\Helpers\Validations\UpdateProductValidator;

use App\Helpers\Utils;

class ProductController extends Controller
{
    protected $productService;

    public function __construct(
        ProductServiceInterface $productService
    ) {
        $this->productService = $productService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return $this->productService->getAllProducts($request->toArray());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = CreateProductValidator::validate($request);


        if ($validator->fails()) {
            return Utils::apiResponseWithMultipleErrors($validator->errors(), 422);
        }

        return $this->productService->store($request->toArray());
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        return $this->productService->show($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validator = UpdateProductValidator::validate($request);

        if ($validator->fails()) {
            return Utils::apiResponseWithMultipleErrors($validator->errors(), 422);
        }

        return $this->productService->update($request->toArray(), $id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return $this->productService->destroy($id);
    }

    public function deleteProductImage(string $id)
    {
        return $this->productService->deleteProductImage($id);
    }
}
