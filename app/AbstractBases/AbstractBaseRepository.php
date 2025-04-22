<?php

namespace App\AbstractBases;

use Illuminate\Database\Eloquent\Model;

abstract class AbstractBaseRepository
{
    protected Model $model;

    public function __construct(Model $model)
    {
        $this->model = $model;
    }

    public function findByUuid(string $column, string $uuid)
    {
        return $this->model->where($column, $uuid)->first();
    }

    public function findById($id)
    {
        return $this->model->findOrFail($id);
    }

    public function findByMultipleValue(string $column, array $value)
    {
        return $this->model->whereIn($column, $value)->get();
    }

    public function search(array $columns, string $searchTerm)
    {
        return $this->model->where(function ($query) use ($columns, $searchTerm) {
            foreach ($columns as $column) {
                $query->orWhere($column, 'like', "%$searchTerm%");
            }
        })->get();
    }

    public function create(array $data)
    {
        return $this->model->create($data);
    }

    public function insert(array $data)
    {
        return $this->model->insert($data);
    }

    public function update(int $id, array $data)
    {
        $record = $this->findById($id);
        if ($record) {
            $record->update($data);
            return $record;
        }
        return null;
    }

    public function delete(int $id)
    {
        $record = $this->findById($id);
        if ($record) {
            return $record->delete();
        }
        return false;
    }

    public function multipleDeleteByMultipleValue(string $column, array $value)
    {
        return $this->model->whereIn($column, $value)->delete();
    }
}
