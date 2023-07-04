<?php

use Illuminate\Support\Facades\DB;

if(!function_exists('_createdDatabase')):
    function _createdDatabase( $parametre = NULL ) {

        if(isset($parametre)):
            extract($parametre);
            $query = "CREATE DATABASE IF NOT EXISTS {$db_name}_{$db_period} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";

            DB::statement($query);
        endif;

    } /** end _createdDatabase( $parametre = NULL ) **/

endif;
