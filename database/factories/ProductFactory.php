<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Carbon;


/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = ['Electronics', 'Clothing and Apparel', 'Home and Kitchen', 'Health and Beauty', 'Sports and Outdoors'];
        return [
            'name' => $this->faker->word(),
            'category' => $categories[array_rand($categories)],
            'description' => $this->faker->sentence(),
            'datetime' => Carbon::now()->format('Y-m-d h:i:s'),
        ];
    }
}
