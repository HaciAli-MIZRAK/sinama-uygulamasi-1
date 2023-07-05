<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {

    /**
     * Run the migrations.
     */
    public function up(  ): void {

        Schema::create('menu_items', function ( Blueprint $table ) {
            $table->increments( 'menu_id' );
            $table->bigInteger( 'parent_id' )->default(-1);
            $table->string( 'menu_title', 50 )->nullable();
            $table->string( 'menu_slug', 50 )->nullable();
            $table->string( 'menu_type', 50 )->nullable();
            $table->string( 'menu_route', 50 )->nullable();
            $table->string( 'menu_module', 50 )->nullable();
            $table->string( 'menu_roles', 10 )->default(0);
            $table->string( 'menu_target', 10 )->default( '_self' );
            $table->string( 'menu_content', 191 )->default( 'Bu kısmında Menü Açıklaması Yapın' );
            $table->string( 'icon_class', 50 )->nullable();
            $table->tinyInteger( 'menu_order' )->default(true);
            $table->tinyInteger( 'sub_order' )->default(true);
            $table->timestamps();
        });

    } /** end up(  ): void **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Reverse the migrations.
     */
    public function down(  ): void {

        Schema::dropIfExists('menu_items');

    } /** end down(  ): void **/

};  /** end return new class extends Migration  **/
