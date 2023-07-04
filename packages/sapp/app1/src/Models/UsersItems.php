<?php

namespace SAPP\APP1\Models;

use App\Models\User;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class UsersItems extends User {

    use HasFactory, Notifiable;

    protected $connection = 'mysql';
    protected $primaryKey = 'id';
    protected $table      = 'users';
    protected $guarded    = [];
    protected $fillable   = [];
    protected $hidden = [
        'password',
        'created_at',
        'updated_at',
        'remember_token',
        'email_verified_at'
    ];
    protected $appends    = [];
    protected $casts      = [
        'created_at'     => 'datetime:d-m-Y H:i:s',
        'updated_at'     => 'datetime:d-m-Y H:i:s',
        'is_admin'       => 'integer'
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
