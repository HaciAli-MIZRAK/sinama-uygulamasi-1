<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {

    /**
     * Run the migrations.
     */
    public function up(  ): void {

        Schema::create('location_items', function ( Blueprint $table ) {
            $table->id();
            $table->bigInteger( 'user_id' )->unsigned();
            $table->string('location_title')->index();
            $table->double('longitude')->nullable()->index();
            $table->double('latitude')->nullable()->index();
            $table->string('marker_colored')->nullable();;
            $table->timestamps();
        });

    } /** end up(  ): void **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Reverse the migrations.
     */
    public function down(  ): void {

        Schema::dropIfExists('location_items');

    } /** end down(  ): void **/

};  /** end return new class extends Migration  **/
