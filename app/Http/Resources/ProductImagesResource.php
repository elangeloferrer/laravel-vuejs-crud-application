<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductImagesResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $productImages = [];
        foreach ($this->resource as $item) {
            array_push($productImages, [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'name' => $item->name,
                'unique_name' => $item->unique_name,
                'image_path' => $item->image_path,
                'url' => asset(Storage::url($item->image_path))
            ]);
        }

        return $productImages;
    }
}
