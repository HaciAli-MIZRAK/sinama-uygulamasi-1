<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

return new class extends Migration {

    /**
     * Run the migrations.
     */
    public function up(  ): void {

        Schema::create('password_reset_tokens', function ( Blueprint $table ) {
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('created_at')->nullable();
        });

    } /** end up(  ): void **/

    /** ------------------------------------------------------------------------------------------------------------ **/

    /**
     * Reverse the migrations.
     */
    public function down(  ): void {

        Schema::dropIfExists('password_reset_tokens');

    } /** end down(  ): void **/

};  /** end return new class extends Migration **/
