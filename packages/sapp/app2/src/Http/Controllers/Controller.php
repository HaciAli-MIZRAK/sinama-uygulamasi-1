<?php

namespace SAPP\APP2\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;


class Controller extends BaseController {

    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * Bizim Sabit Değişkenlerimiz
     */
    protected $pageItems;

    public function __construct(  ) {

        Carbon::setLocale(config('app.locale'));
        /** Global Object Değişkenimiz **/
        $this->pageItems = (object)[];

        $this->pageItems->modulArray = [
            'panel-header',
            'left-side-menu'
        ];
        $this->pageItems->adminThemes = 'sapp_1';

    } /** end __construct(  ) **/

}   /** end class Controller extends BaseController **/
