<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use SAPP\APP2\Http\Controllers\Auth\AuthController;

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
 * Bu Route ile kullanıcı Girişi, Yeni Kullanıcı Kaydı, Parola Sıfırlama Yapıyoruz.
 */
Route::prefix('api')->controller(AuthController::class)->group(function(  ) {

    Route::post('/login', 'loginApi')->name('login');
    Route::post('/register', 'createApi');

});

/** ---------------------------------------------------------------------------------------------------------------- **/

/**
 * Bu Route ile kulanıcı detaylarını alıyoruz TEST alanıdır.
 */
Route::prefix('api')->middleware('auth:api')->group(function(  ) {

    Route::post('/user', function( Request $request ) {
        return $request->user();
    })->name('user');

});
