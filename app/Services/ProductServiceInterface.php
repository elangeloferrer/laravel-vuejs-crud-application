<?php

namespace App\Services;

interface ProductServiceInterface
{
    public function getAllProducts($data);
    public function store($data);
    public function show($id);
    public function update($data, $id);
    public function destroy($id);
    public function deleteProductImage($id);
}
