<?php

namespace SAPP\APP1\Repositories\Eloquent;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use SAPP\APP1\Models\Locations\LocationItems;

use SAPP\APP1\Http\Controllers\API\ApiBaseController AS BaseController;

class LocationItemsRepository extends BaseController {

    /**
     * Bu function class girişi
     */
    public function __construct(  ) {

        parent::__construct(  );

    } /** end __construct(  ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Tüm Konumları Listeliyoruz..
     */
    public function allListLocation( $request ) {

        $data = LocationItems::query();

        return $data;

    } /** end allListLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Yeni Konum Ekliyoruz..
     */
    public function createLocation( $request ) {

        $validator = Validator::make($request->only('user_id', 'location_title', 'longitude', 'latitude', 'marker_colored'), [
            'location_title' => 'required|string|min:3|max:255',
            'longitude'      => 'required|string',
            'latitude'       => 'required|string',
            'marker_colored' => 'required|string',
        ], [
            'location_title.required' => _text( 'Bu alan boş geçilemez!' ),
            'location_title.min'      => _text( 'Lütfen en az 3 karakter girin!' ),
            'location_title.max'      => _text( 'Lütfen en çok 255 karakter girin!' ),

            'longitude.required'      => _text( 'Bu alan boş geçilemez!' ),
            'latitude.required'       => _text( 'Bu alan boş geçilemez!' ),
            'marker_colored.required' => _text( 'Bu alan boş geçilemez!' ),
        ]);
        if ($validator->fails()):
            $data = (object)[
                'title'             => _text( 'Sistem mesajı!' ),
                'text'              => $validator->messages()->first(),
                'icon'              => 'danger',
                'buttonsStyling'    => '!1',
                'confirmButtonText' => _text( 'Tamam' ),
                'status'            => 'not'
            ];
            return $this->sendError('Validation Error.', $data);
        else:
            $create = LocationItems::create([
                'user_id'        => $request->user_id,
                'location_title' => $request->location_title,
                'longitude'      => $request->longitude,
                'latitude'       => $request->latitude,
                'marker_colored' => $request->marker_colored
            ]);
            if ($create):
                $data = (object)[
                    'title'             => _text( 'Sistem mesajı!' ),
                    'text'              => _text( 'Konum kaydı başarılı.' ),
                    'icon'              => 'success',
                    'buttonsStyling'    => '!1',
                    'confirmButtonText' => _text( 'Tamam' ),
                ];
                return $this->sendResponse($data, 'User register successfully.');
            else:
                $data = (object)[
                    'title'             => _text( 'Sistem mesajı!' ),
                    'text'              => _text( 'Bir sorun oluştur tekrar deneyin.' ),
                    'icon'              => 'warning',
                    'buttonsStyling'    => '!1',
                    'confirmButtonText' => _text( 'Tamam' ),
                ];
                return $this->sendError('Register Error.', $data);
            endif;
        endif;

    } /** end createLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Mevcut Konumu Düzenliyoruz..
     */
    public function updateLocation( $request ) {

        $validator = Validator::make($request->only('id', 'user_id', 'location_title', 'longitude', 'latitude', 'marker_colored'), [
            'id'             => 'required|string',
            'location_title' => 'required|string|min:3|max:255',
            'longitude'      => 'required|string',
            'latitude'       => 'required|string',
            'marker_colored' => 'required|string',
        ], [
            'location_title.required' => _text( 'Bu alan boş geçilemez!' ),
            'location_title.min'      => _text( 'Lütfen en az 3 karakter girin!' ),
            'location_title.max'      => _text( 'Lütfen en çok 255 karakter girin!' ),

            'longitude.required'      => _text( 'Bu alan boş geçilemez!' ),
            'latitude.required'       => _text( 'Bu alan boş geçilemez!' ),
            'marker_colored.required' => _text( 'Bu alan boş geçilemez!' ),
        ]);
        if ($validator->fails()):
            $data = (object)[
                'title'             => _text( 'Sistem mesajı!' ),
                'text'              => $validator->messages()->first(),
                'icon'              => 'danger',
                'buttonsStyling'    => '!1',
                'confirmButtonText' => _text( 'Tamam' ),
                'status'            => 'not'
            ];
            return $this->sendError('Validation Error.', $data);
        else:
            $create = LocationItems::where('id', $request->id)->update([
                'user_id'        => $request->user_id,
                'location_title' => $request->location_title,
                'longitude'      => $request->longitude,
                'latitude'       => $request->latitude,
                'marker_colored' => $request->marker_colored
            ]);
            if ($create):
                $data = (object)[
                    'title'             => _text( 'Sistem mesajı!' ),
                    'text'              => _text( 'Konum güncelleme başarılı.' ),
                    'icon'              => 'success',
                    'buttonsStyling'    => '!1',
                    'confirmButtonText' => _text( 'Tamam' ),
                ];
                return $this->sendResponse($data, 'User register successfully.');
            else:
                $data = (object)[
                    'title'             => _text( 'Sistem mesajı!' ),
                    'text'              => _text( 'Bir sorun oluştur tekrar deneyin.' ),
                    'icon'              => 'warning',
                    'buttonsStyling'    => '!1',
                    'confirmButtonText' => _text( 'Tamam' ),
                ];
                return $this->sendError('Register Error.', $data);
            endif;
        endif;

    } /** end updateLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Mevcut Konumu Düzenliyoruz..
     */
    public function detailLocation( $request ) {

        $validator = Validator::make($request->only('id', 'user_id'), [
            'id'      => 'required|string',
            'user_id' => 'required|string',
        ], [
            'id.required'      => _text( 'Bu alan boş geçilemez!' ),
            'user_id.required' => _text( 'Bu alan boş geçilemez!' ),
        ]);
        if ($validator->fails()):
            $data = (object)[
                'title'             => _text( 'Sistem mesajı!' ),
                'text'              => $validator->messages()->first(),
                'icon'              => 'danger',
                'buttonsStyling'    => '!1',
                'confirmButtonText' => _text( 'Tamam' ),
                'status'            => 'not'
            ];
            return $this->sendError('Validation Error.', $data);
        else:
            $show = LocationItems::where('id', $request->id)->first();
            if ($show):
                return $this->sendResponse($show, 'User register successfully.');
            else:
                $data = (object)[
                    'title'             => _text( 'Sistem mesajı!' ),
                    'text'              => _text( 'Bir sorun oluştur tekrar deneyin.' ),
                    'icon'              => 'warning',
                    'buttonsStyling'    => '!1',
                    'confirmButtonText' => _text( 'Tamam' ),
                ];
                return $this->sendError('Register Error.', $data);
            endif;
        endif;

    } /** end detailLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile İki Adresi Arasında Rota Çiziyoruz..
     */
    public function routeLocation( $request ) {

        $validator = Validator::make($request->only('id', 'user_id'), [
            'id'      => 'required|string',
            'user_id' => 'required|string',
        ], [
            'id.required'      => _text( 'Bu alan boş geçilemez!' ),
            'user_id.required' => _text( 'Bu alan boş geçilemez!' ),
        ]);
        if ($validator->fails()):
            $data = (object)[
                'title'             => _text( 'Sistem mesajı!' ),
                'text'              => $validator->messages()->first(),
                'icon'              => 'danger',
                'buttonsStyling'    => '!1',
                'confirmButtonText' => _text( 'Tamam' ),
                'status'            => 'not'
            ];
            return $this->sendError('Validation Error.', $data);
        else:
            $routes = LocationItems::where('id', $request->id)->first();
            if ($routes):

                return $this->sendResponse($routes, 'User register successfully.');
            else:
                $data = (object)[
                    'title'             => _text( 'Sistem mesajı!' ),
                    'text'              => _text( 'Bir sorun oluştur tekrar deneyin.' ),
                    'icon'              => 'warning',
                    'buttonsStyling'    => '!1',
                    'confirmButtonText' => _text( 'Tamam' ),
                ];
                return $this->sendError('Register Error.', $data);
            endif;
        endif;

    } /** end routeLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/
    /** ------------------------------------------------------------------------------------------------------------ **/
    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile ücretsiz bir servis üzerinden iki koordinat arasındaki mesafe, Süre ve yol tarifini oluşturuyoruz.
     */
    private function serviceUrl( $latitude1 = null, $longitude1 = null, $latitude2 = null, $longitude2 = null ) {

        $url = sprintf('https://router.project-osrm.org/route/v1/driving/%s;%s', ($latitude1 . ',' . $longitude1), ($latitude2 . ',' . $longitude2));

        $response = Http::get($url)
                        ->throw()
                        ->json();

        //$distance = $response['routes'][0]['distance']; // metre
        //$duration = $response['routes'][0]['duration']; // saniye
        //$route = $response['routes'][0]['geometry'];

        return $response;

    } /** end serviceUrl( $latitude = null, $longitude = null ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile hazır servis kullanarak İki adres/kordinat arasındaki Rotayı Çiziyoruz.
     */
    private function decode( $string ) {

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
    private function pair( $list ) {

        return is_array($list) ? array_chunk($list, 2) : array();

    } /** end pair( $list ) **/

}   /** end class LocationItemsRepository **/