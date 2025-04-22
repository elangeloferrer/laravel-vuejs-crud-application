<?php

namespace App\Repositories;

use App\AbstractBases\AbstractBaseRepository;

use App\Models\ProductImage;


class ProductImageRepository extends AbstractBaseRepository
{

    public function __construct(ProductImage $product_image)
    {
        parent::__construct($product_image);
    }
}
