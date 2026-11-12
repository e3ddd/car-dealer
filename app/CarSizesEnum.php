<?php

namespace App;

enum CarSizesEnum: int
{
    case S = 1;
    case M = 2;
    case L = 3;
    case XL = 4;
    case XXL = 5;

    public static function sizes()
    {
        return [
            self::S->value => self::S->name,
            self::M->value => self::M->name,
            self::L->value => self::L->name,
            self::XL->value => self::XL->name,
            self::XXL->value => self::XXL->name,
        ];
    }
}
