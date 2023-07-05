<?php

namespace SAPP\APP1\Repositories\Eloquent;

use SAPP\APP1\Models\Models\Locations\LocationItems;

class LocationItemsRepository {

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

    } /** end createLocation( Request $request ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Bu function ile Mevcut Konumu Düzenliyoruz..
     */
    public function updateLocation( $request ) {

    } /** end updateLocation( Request $request ) **/

}   /** end class LocationItemsRepository **/