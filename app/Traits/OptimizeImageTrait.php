<?php

namespace App\Traits;

use Spatie\LaravelImageOptimizer\Facades\ImageOptimizer;
use Illuminate\Support\Facades\Log;

trait OptimizeImageTrait
{
    public function optimizeImage(string $path): bool
    {
        if (!file_exists($path)) {
            Log::warning("Image not found: {$path}");
            return false;
        }

        try {
            ImageOptimizer::optimize($path);
            return true;
        } catch (\Throwable $e) {
            Log::error("Image optimization failed: " . $e->getMessage());
            return false;
        }
    }
}
