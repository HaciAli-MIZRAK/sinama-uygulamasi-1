<?php

namespace SAPP\APP1\Models\Locations;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use SAPP\APP1\Models\UsersItems;

class LocationItems extends Model {

    use HasFactory;

    protected $connection = 'mysql';
    protected $primaryKey = 'id';
    protected $table      = 'location_items';
    protected $guarded    = [];
    protected $appends    = [
        'create_at'
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

    /**
     * 1.
     * Bu function ile Tarih Formatını Düzenliyoruz.
     */
    public function getCreateAtAttribute(  ) {

        return Carbon::parse($this->created_at)->translatedFormat('d F Y');

    } /** end getCreateAtAttribute(  ) **/

/** ---------------------------------------------------------------------------------------------------------------- **/
    #################################### SCOPE FUNCTOIN ALANIMIZ ###################################################
/** ---------------------------------------------------------------------------------------------------------------- **/

/** ---------------------------------------------------------------------------------------------------------------- **/
    ################################### PRIVATE FUNCTOIN ALANIMIZ ##################################################
/** ---------------------------------------------------------------------------------------------------------------- **/

    public function userName() {
        return $this->hasOne(UsersItems::class, 'id', 'user_id');
    }

}   /** end class LocationItems extends Model **/
