<?php

namespace App;

enum CarFuelTypesEnum: int
{
    case DIESEL = 1;
    case GAS = 2;
    case LPG = 3;

    public static function types()
    {
        return [
            self::DIESEL->value => self::DIESEL->name,
            self::GAS->value => self::GAS->name,
            self::LPG->value => self::LPG->name,
        ];
    }
}
