<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'description',
        'datetime',
    ];

    public function product_images()
    {
        return $this->hasMany(ProductImage::class, 'product_id', 'id');
    }
}
