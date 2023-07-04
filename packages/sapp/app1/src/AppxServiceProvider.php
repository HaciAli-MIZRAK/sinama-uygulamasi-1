<?php

namespace SAPP\APP1;

use Config;
use Laravel\Passport\Passport;
use SAPP\APP1\Models\UsersItems;
use Illuminate\Support\ServiceProvider;
use SAPP\APP1\Console\DBCreateSystem;

class AppxServiceProvider extends ServiceProvider {

    protected $ipAddress   = '192.168.1.141';
    protected $dbName      = 'admin_app1';
    protected $userName    = 'mizrak';
    protected $dbPassword  = '123456';
    protected $dbPrefix    = 'vt_web_';

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     *
     */
    public function register(  ) {

        Passport::ignoreRoutes();

    } /** end register(  ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    public function boot(  ): void {

        /** -------------------------------------------------------------------------------------------------------- **/
        /**
         *
         */
        config([
            'app.name'     => env('APP_NAME', 'Test Proje'),
            'app.locale'   => 'tr',
            'app.timezone' => 'Europe/Istanbul',
            'app.asset_url'=> env('ASSET_URL', url( '/' )),
            'auth.guards'  => [
                'web' => [
                    'driver'   => 'session',
                    'provider' => 'users',
                ],
                'api' => [
                    'driver'   => 'passport',
                    'provider' => 'users',
                ]
            ],
            'auth.providers' => [
                'users' => [
                    'driver' => 'eloquent',
                    'model'  => UsersItems::class,
                ],
            ]
        ]);
        /** -------------------------------------------------------------------------------------------------------- **/
        /**
         * Paketimiz için SQL bağlantı yapılandırması buradan yapılacak.
         * 2. Paket Connection
         */
        Config::set('database.connections.mysql', [
            'driver'         => 'mysql',
            'host'           => env('DB_HOST', $this->ipAddress),
            'port'           => env('DB_PORT', '3306'),
            'database'       => env('DB_DATABASE', $this->dbName),
            'username'       => env('DB_USERNAME', $this->userName),
            'password'       => env('DB_PASSWORD', $this->dbPassword),
            'unix_socket'    => env('DB_SOCKET', ''),
            'charset'        => 'utf8mb4',
            'collation'      => 'utf8mb4_unicode_ci',
            'prefix'         => env('DB_PREFIX', $this->dbPrefix),
            'prefix_indexes' => true,
            'strict'         => true,
            'engine'         => null,
        ]);
        /** -------------------------------------------------------------------------------------------------------- **/
        /**
         * Paketimiz için mail yapılandırma ayarlarını burada yapıyoruz.
         * 3. Mail Servisi
         */
        Config::set('mail', [
            'default'  => env('MAIL_MAILER', 'smtp'),
            'mailers'  => [
                'smtp' => [
                    'transport'  => 'smtp',
                    'host'       => env('MAIL_HOST', 'smtp.gmail.com' ),
                    'port'       => env('MAIL_PORT', 465),
                    'encryption' => env('MAIL_ENCRYPTION', 'ssl'),
                    'username'   => env('MAIL_USERNAME', 'sehrimdex@gmail.com'),
                    'password'   => env('MAIL_PASSWORD', 'iidcnpfathdqcsns'),
                    'timeout'    => null,
                    'auth_mode'  => null,
                ],
            ],
            'from' => [
                'address' => env('MAIL_FROM_ADDRESS', 'sehrimdex@gmail.com'),
                'name'    => env('MAIL_FROM_NAME', config('app.name')),
            ],
        ]);
        /** -------------------------------------------------------------------------------------------------------- **/
        /**
         *
         */
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $this->loadRoutesFrom(__DIR__.'/../routes/api.php');
        if($this->app->runningInConsole(  )):
            $this->commands([
                DBCreateSystem::class,
            ]);
        endif;

    } /** end boot(  ): void **/

}   /** end class AppxServiceProvider extends ServiceProvider **/
