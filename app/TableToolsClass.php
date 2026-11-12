<?php

namespace App;

use Closure;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Model;

class TableToolsClass
{
    /**
     * @param  list<string>  $searchable
     * @param  list<string>  $with
     * @param  array<string, list<string>>  $relationSearchable
     */
    public function __construct(
        private Model $model,
        private array $searchable,
        private array $with = [],
        private array $relationSearchable = [],
    ) {}

    public function search(string $term, ?Closure $extra = null): Collection
    {
        $searchable = $this->searchable;
        $relationSearchable = $this->relationSearchable;

        return $this->model->newQuery()
            ->with($this->with)
            ->where(function (Builder $builder) use ($term, $searchable, $relationSearchable, $extra): void {
                foreach ($searchable as $field) {
                    $builder->orWhere($field, 'like', '%'.$term.'%');
                }

                foreach ($relationSearchable as $relation => $fields) {
                    $builder->orWhereHas($relation, function (Builder $relationQuery) use ($term, $fields): void {
                        $relationQuery->where(function (Builder $inner) use ($term, $fields): void {
                            foreach ($fields as $field) {
                                $inner->orWhere($field, 'like', '%'.$term.'%');
                            }
                        });
                    });
                }

                if ($extra !== null) {
                    $extra($builder, $term);
                }
            })
            ->get();
    }

    /**
     * @param  array<string, mixed>  $filters
     */
    public function filter(array $filters): Collection
    {
        $query = $this->model->newQuery()->with($this->with);
        $searchable = $this->searchable;

        foreach ($filters as $field => $value) {
            if (! in_array($field, $searchable, true) || $value === null || $value === '') {
                continue;
            }

            if (is_array($value)) {
                $query->whereIn($field, $value);

                continue;
            }

            $query->where($field, $value);
        }

        return $query->get();
    }
}
