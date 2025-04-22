<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id',
        'name',
        'unique_name',
        'image_path',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class, 'id', 'product_id');
    }
}
