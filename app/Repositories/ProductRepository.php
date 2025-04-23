<?php

namespace App\Repositories;

use App\AbstractBases\AbstractBaseRepository;

use App\Http\Resources\ProductResource;

use App\Models\Product;


class ProductRepository extends AbstractBaseRepository
{

    public function __construct(Product $product)
    {
        parent::__construct($product);
    }


    public function getAllProducts($page = 1, $perPage = 10, $keywords = "", $category = "")
    {

        $query = $this->model;

        if ($keywords != "" && $keywords !== null) {
            $query = $this->model->where('name', 'like', "%$keywords%")
                ->orWhere('description', 'like', "%$keywords%");
        }

        if ($category != "" && $category !== null) {
            $query = $query->where('category', $category);
        }

        $collection = $query->paginate($perPage);

        return ProductResource::collection($collection);
    }
}
