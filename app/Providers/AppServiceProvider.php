<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

use App\Services\{
    ProductService,
    ProductServiceInterface,
};

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->bind(ProductServiceInterface::class, ProductService::class);
    }
}
