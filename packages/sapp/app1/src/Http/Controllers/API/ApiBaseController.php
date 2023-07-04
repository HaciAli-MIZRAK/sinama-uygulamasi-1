<?php

namespace SAPP\APP1\Http\Controllers\API;

/** Sabit Class **/
use Illuminate\Http\Request;
use SAPP\APP1\Http\Controllers\Controller AS Controller;

class ApiBaseController extends Controller {

    /**
     * Bu function class girişi
     */
    public function __construct(  ) {

        parent::__construct(  );

    } /** end __construct(  ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function Başarılı Response isteklerini döndürdüğümüz panket olacak.
     */
    public function sendResponse( $result, $message ) {

        $response = [
            'success' => true,
            'data'    => $result,
            'message' => $message,
        ];

        return response()->json($response, 200);

    } /** end sendResponse($result, $message) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function Hatalı Response isteklerini döndürdüğümüz panket olacak.
     */
    public function sendError( $error, $errorMessages = [], $code = 404 ) {

        $response = [
            'success' => false,
            'message' => $error,
        ];

        if(!empty($errorMessages)):
            $response['data'] = $errorMessages;
        endif;

        return response()->json($response, $code);

    } /** end sendError( $error, $errorMessages = [], $code = 404 ) **/

}   /** end class ApiBaseController extends Controller **/
