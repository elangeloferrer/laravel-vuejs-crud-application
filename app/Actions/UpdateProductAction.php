<?php

namespace App\Actions;

use App\Repositories\ProductRepository;
use App\Repositories\ProductImageRepository;
use App\Traits\OptimizeImageTrait;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

class UpdateProductAction
{
    use OptimizeImageTrait;

    protected $repository;
    protected $productImageRepository;

    public function __construct(
        ProductRepository $repository,
        ProductImageRepository $productImageRepository,
    ) {
        $this->repository = $repository;
        $this->productImageRepository = $productImageRepository;
    }

    public function execute($data, $id)
    {

        $product = $this->repository->findById($id);
        $product = $this->repository->update(
            $product->id,
            [
                'name' => $data['name'],
                'category' => $data['category'],
                'description' => $data['description'],
                'datetime' => $data['datetime'],
            ]
        );

        if (isset($data['removed_image_ids']) && $data['removed_image_ids']) {
            // delete product image data and file
            $productImagesToDelete = $this->productImageRepository->findByMultipleValue('id', $data['removed_image_ids']);
            $imagePathsToDelete = $productImagesToDelete->pluck('image_path')->toArray();
            $idsToDelete = $productImagesToDelete->pluck('id')->toArray();
            Storage::disk('public')->delete($imagePathsToDelete);
            $this->productImageRepository->multipleDeleteByMultipleValue('id', $idsToDelete);
        }

        if (isset($data['new_images']) && $data['new_images']) {
            $productImagesToSave = [];
            foreach ($data['new_images'] as $image) {
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
            $this->productImageRepository->insert($productImagesToSave);
        }


        $product->refresh();
        $product->load('product_images');
        return $product;
    }
}
