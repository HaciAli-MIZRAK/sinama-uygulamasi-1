<?php

namespace SAPP\APP2\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MenuItems extends Model {

    use HasFactory;

    protected $connection = 'mysql';
    protected $primaryKey = 'menu_id';
    protected $table      = 'menu_items';
    protected $guarded    = [];
    protected $fillable   = [
        'menu_id',
        'parent_id',
        'menu_title',
        'menu_slug',
        'menu_type',
        'menu_route',
        'menu_module',
        'menu_roles',
        'menu_target',
        'menu_content',
        'icon_class',
        'menu_order',
        'sub_order'
    ];
    protected $hidden = [
        'created_at',
        'updated_at'
    ];
    protected $appends    = [];
    protected $casts      = [
        'created_at'     => 'datetime:d-m-Y H:i:s',
        'updated_at'     => 'datetime:d-m-Y H:i:s',
    ];

    /** ------------------------------------------------------------------------------------------------------------ **/
    /** ############################### ATTRIBUTE ALANIMIZ ######################################################### **/
    /** ------------------------------------------------------------------------------------------------------------ **/

    /** ------------------------------------------------------------------------------------------------------------ **/
    /** ############################### SCOPE FUNCTOIN ALANIMIZ #################################################### **/
    /** ------------------------------------------------------------------------------------------------------------ **/

    /** ------------------------------------------------------------------------------------------------------------ **/
    /** ############################### PRIVATE FUNCTOIN ALANIMIZ ################################################## **/
    /** ------------------------------------------------------------------------------------------------------------ **/

}   /** end class UsersItems extends User **/
