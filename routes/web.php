<?php

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

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

/*Route::get('/', function () {
    return view('welcome');
});*/

Route::get('/route', function() {
    $a = '26.807283314743785,38.225425134685004'; // boylam,enlem
    $b = '26.8464113317394,38.20060041838293'; // boylam,enlem

    $url = sprintf('https://router.project-osrm.org/route/v1/driving/%s;%s', $a, $b);

    $response = Http::get($url)
        ->throw()
        ->json();

    $distance = $response['routes'][0]['distance']; // metre
    $duration = $response['routes'][0]['duration']; // saniye
    $route = $response['routes'][0]['geometry'];

    return response()->json(pair(decode($route)));
});

/**
 * Bu function ile hazır servis kullanarak İki adres/kordinat arasındaki Rotayı Çiziyoruz.
 */
/*function decode( $string ) {

    $points = array();
    $index = $i = 0;
    $previous = array(0,0);
    while ($i < strlen($string)) {
        $shift = $result = 0x00;
        do {
            $bit = ord(substr($string, $i++)) - 63;
            $result |= ($bit & 0x1f) << $shift;
            $shift += 5;
        } while ($bit >= 0x20);

        $diff = ($result & 1) ? ~($result >> 1) : ($result >> 1);
        $number = $previous[$index % 2] + $diff;
        $previous[$index % 2] = $number;
        $index++;
        $points[] = $number * 1 / pow(10, 5);
    }
    return $points;

} /** end decode( $string ) **/

/** ------------------------------------------------------------------------------------------------------------ **/

/**
 * Bu function ile oluşturduğumuz rota koordinatlarını enlem, boylam şeklinde her biri array olacak şekilde parçalıyoruz.
 */
/*function pair( $list ) {

    return is_array($list) ? array_chunk($list, 2) : array();

} /** end pair( $list ) **/

