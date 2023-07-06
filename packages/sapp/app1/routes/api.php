<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use SAPP\APP1\Http\Controllers\Auth\AuthController;
use SAPP\APP1\Http\Controllers\Location\LocationItemsController;

/**
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

/**
 * Bu Route ile kullanıcı Girişi, Yeni Kullanıcı Kaydı Yapıyoruz.
 */
Route::prefix('api')->controller(AuthController::class)->group(function(  ) {

    Route::post('/login', 'loginApi')->name('login');
    Route::post('/register', 'createApi');

});

/** ---------------------------------------------------------------------------------------------------------------- **/

/**
 * Bu Route ile konum ekleme, konum düzenleme ve listeleme linklerini oluşturuyoruz.
 */
Route::prefix('api')/*->middleware('auth:api')*/->controller(LocationItemsController::class)->group(function(  ) {

    Route::post('/add-location', 'createLocation')->name('createLocation');
    Route::post('/edit-location', 'updateLocation')->name('updateLocation');
    Route::get('/detail-location', 'detailLocation')->name('detailLocation');
    Route::get('/all-location-list', 'allListLocation')->name('allListLocation');
    Route::post('/location-routes', 'locationRoutes')->name('locationRoutes');

});

/** ---------------------------------------------------------------------------------------------------------------- **/

/**
 * Bu Route ile kulanıcı detaylarını alıyoruz TEST alanıdır.
 */
Route::prefix('api')->middleware('auth:api')->group(function(  ) {

    Route::post('/userx', function( Request $request ) {
        return $request->user();
    })->name('userx');

});
