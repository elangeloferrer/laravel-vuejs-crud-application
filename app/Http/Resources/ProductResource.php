<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Carbon;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'category' => $this->category,
            'description' => $this->description,
            // 'datetime' => Carbon::parse($this->datetime)->format('F d, Y g:ia'),
            'datetime' => $this->datetime,
            'product_images' => new ProductImagesResource($this->product_images),
        ];
    }
}
