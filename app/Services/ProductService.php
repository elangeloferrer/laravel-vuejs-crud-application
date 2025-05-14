<?php

namespace App\Services;

use Illuminate\Support\Facades\Storage;

use App\Repositories\ProductRepository;
use App\Repositories\ProductImageRepository;
use App\Actions\CreateProductAction;
use App\Actions\UpdateProductAction;

use App\Http\Resources\ProductResource;

use App\Helpers\Utils;

class ProductService implements ProductServiceInterface
{

    protected $productRepository;
    protected $productImageRepository;
    protected $createProductAction;
    protected $updateProductAction;

    public function __construct(
        ProductRepository $productRepository,
        ProductImageRepository $productImageRepository,
        CreateProductAction $createProductAction,
        UpdateProductAction $updateProductAction,
    ) {
        $this->productRepository = $productRepository;
        $this->productImageRepository = $productImageRepository;
        $this->createProductAction = $createProductAction;
        $this->updateProductAction = $updateProductAction;
    }

    public function getAllProducts($data)
    {
        // $items = $this->productRepository->getAllProducts($data);
        $items = $this->productRepository->getAllProducts($data['per_page'], $data['per_page'], $data['keywords'], $data['category']);
        $data = [
            'data' => $items,
            'pagination' => [
                'current_page' => $items->currentPage(),
                'next_page_url' => $items->nextPageUrl(),
                'prev_page_url' => $items->previousPageUrl(),
                'per_page' => $items->perPage(),
                'total_items' => $items->total(),
                'total_pages' => $items->lastPage(),
            ],
        ];
        return Utils::apiResponse(true, "Successfully fetched data", $data);
    }

    public function store($data)
    {
        try {
            $product = $this->createProductAction->execute($data);
            return Utils::apiResponse(true, "Successfully created product", new ProductResource($product), 201);
        } catch (\Throwable $th) {
            return Utils::apiResponseWithError($th->getMessage(), 400);
        }
    }

    public function show($id)
    {
        $product = $this->productRepository->findById($id);

        return Utils::apiResponse(true, "Successfully fetched product", new ProductResource($product));
    }

    public function update($data, $id)
    {
        try {
            $product = $this->updateProductAction->execute($data, $id);

            return Utils::apiResponse(true, "Successfully updated product", new ProductResource($product));
        } catch (\Throwable $th) {
            return Utils::apiResponseWithError($th->getMessage(), 400);
        }
    }

    public function destroy($id)
    {
        try {
            $product = $this->productRepository->findById($id);
            $imagePaths = $product->product_images->pluck('image_path')->all();
            Storage::disk('public')->delete($imagePaths);
            $this->productImageRepository->multipleDeleteByMultipleValue('product_id', [$id]);
            $this->productRepository->delete($product->id);

            return Utils::apiResponse(true, "Successfully deleted product");
        } catch (\Throwable $th) {
            return Utils::apiResponseWithError($th->getMessage(), 400);
        }
    }

    public function deleteProductImage($id)
    {
        try {
            $productImage = $this->productImageRepository->findById($id);

            if ($productImage->image_path && Storage::disk('public')->exists($productImage->image_path)) {
                Storage::disk('public')->delete($productImage->image_path);
            }

            $productImage = $this->productImageRepository->delete($productImage->id);

            return Utils::apiResponse(true, "Successfully deleted product image");
        } catch (\Throwable $th) {
            return Utils::apiResponseWithError($th->getMessage(), 400);
        }
    }
}
