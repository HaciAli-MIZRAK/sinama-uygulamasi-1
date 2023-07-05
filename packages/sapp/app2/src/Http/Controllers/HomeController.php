<?php

namespace SAPP\APP2\Http\Controllers;

/** Sabit Class **/
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Validator;
use SAPP\APP2\Http\Controllers\Controller AS BaseController;
use SAPP\APP2\Models\UsersItems;


class HomeController extends BaseController {

    /**
     * Bu function class girişi
     */
    public function __construct(  ) {

        parent::__construct(  );

    } /** end __construct(  ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ihtiyaç durumunda kullanmak için sabit bir alan.
     */
    public function index( Request $request, $item_slug = NULL ) {

        $this->pageItems->modules  = $this->pageItems->modulArray;
        $this->pageItems->menus    = $this->adminLeftMenu( $request );
        $this->pageItems->userInfo = UsersItems::where('id', 1)->first();
        if (!empty($item_slug) && $item_slug != ''):
            /** Alt Sayfalar **/
            $this->pageItems->pages       = $item_slug;
            $this->pageItems->page_header = (object)[
                'menu_title'   => _text('Harita Paneli'),
                'menu_content' => _text( 'Yönetim Anasayfası' )
            ];
        else:
            /** Anasayfa **/
            if($this->pageItems):
                $this->pageItems->pages       = 'nul';
                $this->pageItems->page_header = (object)[
                    'menu_title'   => _text( 'Anasayfa' ),
                    'menu_content' => _text( 'Yönetim Anasayfası' )
                ];
            else:
                $this->pageItems = abort(404);
            endif;
        endif;

        $pageItems = $this->pageItems;

        return view('sApp::' . $pageItems->adminThemes . '.index', compact( 'pageItems' ));


    } /** end index( Request $request, $item_slug = NULL ) **/

}   /** end class HomeController extends BaseController **/