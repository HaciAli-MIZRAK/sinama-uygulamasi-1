<?php

namespace SAPP\APP1\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController {

    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Bizim Sabit Değişkenlerimiz
     */
    protected $pageItems;

    public function __construct(  ) {

    } /** end __construct(  ) **/

}   /** end class Controller extends BaseController **/
