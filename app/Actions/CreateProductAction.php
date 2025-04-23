<?php

namespace App\Actions;

use App\Repositories\ProductRepository;
use App\Repositories\ProductImageRepository;
use App\Traits\OptimizeImageTrait;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;

class CreateProductAction
{
    use OptimizeImageTrait;

    protected $repository;
    protected $productImageRepositroy;

    public function __construct(
        ProductRepository $repository,
        ProductImageRepository $productImageRepositroy,
    ) {
        $this->repository = $repository;
        $this->productImageRepositroy = $productImageRepositroy;
    }

    public function execute($data)
    {
        $product = $this->repository->create([
            'name' => $data['name'],
            'category' => $data['category'],
            'description' => $data['description'],
            'datetime' => $data['datetime'],
        ]);

        $productImagesToSave = [];
        foreach ($data['product_images'] as $image) {
            // Get the original image name
            $originalName = $image->getClientOriginalName();

            // Generate a unique name (random string, timestamp and original extension)
            $uniqueName =  Str::random(10) . time() . '.' . $image->getClientOriginalExtension();

            // Save the image
            $imagePath = $image->storeAs('images/products', $uniqueName, 'public');

            // Optimize the image
            $absolutePath = storage_path('app/public/' . $imagePath);
            $this->optimizeImage($absolutePath, $originalName);

            $now = Carbon::now()->format("Y-m-d H:i:s");
            array_push($productImagesToSave, [
                'product_id' => $product->id,
                'name' => $originalName,
                'unique_name' => $uniqueName,
                'image_path' => $imagePath,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }

        $this->productImageRepositroy->insert($productImagesToSave);

        $product->refresh();
        $product->load('product_images');
        return $product;
    }
}
