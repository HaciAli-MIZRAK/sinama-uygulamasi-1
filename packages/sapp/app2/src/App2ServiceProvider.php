<?php

namespace SAPP\APP2;

use Config;
use Laravel\Passport\Passport;
use SAPP\APP2\Models\UsersItems;
use Illuminate\Support\ServiceProvider;

class App2ServiceProvider extends ServiceProvider {

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
            'app.name'     => env('APP_NAME', 'Test2 Proje'),
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
         *
         */
        $this->loadViewsFrom( __DIR__ . '/../resources/views', 'sApp' );
        $this->loadMigrationsFrom(__DIR__.'/../database/migrations');
        $this->loadRoutesFrom(__DIR__.'/../routes/web.php');
        if($this->app->runningInConsole(  )):
            $this->commands([]);
        endif;

    } /** end boot(  ): void **/

}   /** end class App2ServiceProvider extends ServiceProvider **/
