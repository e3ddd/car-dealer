<?php

namespace App;

enum CarColorsEnum: int
{
    case RED = 1;
    case GREEN = 2;
    case BLUE = 3;
    case YELLOW = 4;
    case BLACK = 5;
    case WHITE = 6;

    public static function colors()
    {
        return [
            self::RED->value => self::RED->name,
            self::GREEN->value => self::GREEN->name,
            self::BLUE->value => self::BLUE->name,
            self::YELLOW->value => self::YELLOW->name,
            self::BLACK->value => self::BLACK->name,
            self::WHITE->value => self::WHITE->name,
        ];
    }
}
