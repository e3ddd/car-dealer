<?php

use App\Http\Controllers\CarController;
use App\Http\Controllers\DealerController;
use App\Http\Controllers\ManufactureController;
use Illuminate\Support\Facades\Route;

Route::prefix('car')->group(function () {
    Route::get('/', [CarController::class, 'index'])->name('car.index');
    Route::post('/', [CarController::class, 'create'])->name('car.create');
    Route::put('/', [CarController::class, 'update'])->name('car.update');
    Route::delete('/', [CarController::class, 'delete'])->name('car.delete');

    Route::get('/filter', [CarController::class, 'filter'])->name('car.filter');
    Route::get('/sizes', [CarController::class, 'getSizes'])->name('car.getSizes');
    Route::get('/colors', [CarController::class, 'getColors'])->name('car.getColors');
    Route::get('/types', [CarController::class, 'getTypes'])->name('car.getTypes');
});

Route::prefix('dealer')->group(function () {
    Route::get('/', [DealerController::class, 'index'])->name('dealer.index');
    Route::post('/', [DealerController::class, 'create'])->name('dealer.create');
    Route::put('/', [DealerController::class, 'update'])->name('dealer.update');
    Route::delete('/', [DealerController::class, 'delete'])->name('dealer.delete');

    Route::get('/filter', [DealerController::class, 'filter'])->name('dealer.filter');
    Route::get('/manufactures', [DealerController::class, 'getManufactures'])->name('dealer.getManufactures');
});

Route::prefix('manufacture')->group(function () {
    Route::get('/', [ManufactureController::class, 'index'])->name('manufacture.index');
    Route::post('/', [ManufactureController::class, 'create'])->name('manufacture.create');
    Route::put('/', [ManufactureController::class, 'update'])->name('manufacture.update');
    Route::delete('/', [ManufactureController::class, 'delete'])->name('manufacture.delete');

});

Route::get('/{any?}', function () {
    return view('app');
})->where('any', '.*');
