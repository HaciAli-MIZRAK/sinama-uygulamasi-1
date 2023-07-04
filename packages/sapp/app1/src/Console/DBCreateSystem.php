<?php

namespace SAPP\APP1\Console;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DBCreateSystem extends Command {

    protected $signature = 'db:create {name?}';
    protected $description = 'Bu Komut Dosyası ile ilk kurulumda veriTabanı oluşturuyoruz.';

    /** ------------------------------------------------------------------------------------------------------------ **/

    public function __construct(  ) {

        parent::__construct(  );

    } /** end __construct(  ) **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    public function handle(  ) {

        try {
            $schemaName = $this->argument('name');
            config(["database.connections.mysql.database" => null]);
            $query = "CREATE DATABASE IF NOT EXISTS $schemaName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;";

            return DB::statement($query);
        } catch ( \ErrorException $e ) {
            return $e->getMessage();
        }

    } /** end handle(  ) **/

}   /** end class DBCreateSystem extends Command **/
