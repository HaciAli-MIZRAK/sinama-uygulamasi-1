<?php

namespace SAPP\APP1\Models\Models\Locations;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class LocationItems extends Model {

    use HasFactory;

    protected $connection = 'mysql';
    protected $primaryKey = 'id';
    protected $table      = 'location_items';
    protected $guarded    = [];
    protected $appends    = [
        'create_at',
        'update_at',
    ];

    protected $fillable = [
        'id',
        'user_id',
        'location_title',
        'longitude',
        'latitude',
        'marker_colored'
    ];
    protected $hidden = [
        'updated_at',
        'created_at'
    ];

    protected $casts      = [
        'created_at' => 'datetime:d-m-Y H:i:s',
        'updated_at' => 'datetime:d-m-Y H:i:s',
    ];

/** ---------------------------------------------------------------------------------------------------------------- **/
    ####################################### ATTRIBUTE ALANIMIZ #####################################################
/** ---------------------------------------------------------------------------------------------------------------- **/

/** ---------------------------------------------------------------------------------------------------------------- **/
    #################################### SCOPE FUNCTOIN ALANIMIZ ###################################################
/** ---------------------------------------------------------------------------------------------------------------- **/

/** ---------------------------------------------------------------------------------------------------------------- **/
    ################################### PRIVATE FUNCTOIN ALANIMIZ ##################################################
/** ---------------------------------------------------------------------------------------------------------------- **/

}   /** end class MobileBlogItems extends Model **/
