<?php

namespace SAPP\APP1\Http\Controllers\Location;

/** Sabit Class **/
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use SAPP\APP1\Http\Controllers\API\ApiBaseController AS BaseController;

/** Projeye Özel Repository Class **/
use SAPP\APP1\Repositories\Eloquent\LocationItemsRepository;

class LocationItemsController extends BaseController {

    /**
     *
     */
    protected $locationItemsRepository;
    /**
     * Bu function class girişi
     */
    public function __construct( LocationItemsRepository $locationItemsRepository ) {

        parent::__construct(  );

        $this->locationItemsRepository = $locationItemsRepository;

    } /** end __construct(  ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ihtiyaç durumunda kullanmak için sabit bir alan.
     */
    public function indexApi( Request $request ) {

    } /** end indexApi( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Tüm Konumları Listeliyoruz..
     */
    public function allListLocation( Request $request ) {

        $data = $this->locationItemsRepository->allListLocation( $request );

        return datatables($data)->toJson();

    } /** end allListLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Yeni Konum Ekliyoruz..
     */
    public function createLocation( Request $request ) {

        $data = $this->locationItemsRepository->createLocation( $request );

        return response()->json($data);

    } /** end createLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Mevcut Konumu Düzenliyoruz..
     */
    public function updateLocation( Request $request ) {

        $data = $this->locationItemsRepository->updateLocation( $request );

        return response()->json($data);

    } /** end updateLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Konumu Detaylarını Alıyoruz..
     */
    public function detailLocation( Request $request ) {

        $data = $this->locationItemsRepository->detailLocation( $request );

        return response()->json($data);

    } /** end detailLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile İki Adresi Arasında Rota Çiziyoruz..
     */
    public function locationShow( Request $request ) {

        $data = $this->locationItemsRepository->locationShow( $request );

        return response()->json($data);

    } /** end locationShow( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile İki Konum Arasına Rota Çiziyoruz..
     */
    public function locationRoutes( Request $request ) {

        $data = $this->locationItemsRepository->locationRoutes( $request );

        return response()->json($data);

    } /** end locationRoutes( Request $request ) **/


}   /** end class LocationItemsController extends BaseController **/