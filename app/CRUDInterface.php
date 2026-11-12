<?php

namespace App;

interface CRUDInterface
{
    public function index();

    public function create(array $data);

    public function update(int $id, array $data);

    public function delete(int $id);
}
