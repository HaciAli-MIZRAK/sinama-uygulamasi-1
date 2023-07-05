<?php

namespace SAPP\APP2\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

use SAPP\APP2\Models\MenuItems;

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

    /**------------------------------------------------------------------------------------------------------------- **/
    /**  ====================== GLOBAL MENU LİSTEMİZİ DÜZENLİYORUZ ================================================= **/
    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Admin Panelimizdeki Sol menüyu Oluşturuyoruz.
     */
    public function adminLeftMenu( $userInfo = NULL ) {

        $adminLeftMenu = MenuItems::orderBy('menu_order', 'ASC')
            ->get()->map(function( $menuLists ) {
                return (object)[
                    'id'         => $menuLists->menu_id,
                    'parent_id'  => $menuLists->parent_id,
                    'title'      => $menuLists->menu_title,
                    'seouri'     => $menuLists->menu_slug,
                    'icon_class' => $menuLists->icon_class
                ];
            });
        return subSelect2Lists( $adminLeftMenu );

    } /** end adminLeftMenu( $userInfo = NULL ) **/


}   /** end class Controller extends BaseController **/
