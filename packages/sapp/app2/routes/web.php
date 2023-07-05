<?php

use Illuminate\Support\Facades\Route;
use SAPP\APP2\Http\Controllers\HomeController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('/login', function() {
    dd("web login page");
})->name('loginw');

Route::get('/logout', function() {
    dd("web çıkış page");
})->name('logout');


Route::prefix('admin')/*->middleware(['web', 'auth'])*/->controller(HomeController::class)->group(function(  ) {

    Route::get('/{item_slug?}', 'index')->name('admin');

});
