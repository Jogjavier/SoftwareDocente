<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('curso_interno_docente');
        Schema::dropIfExists('curso_externo_docente');
        Schema::dropIfExists('curso_interno');
        Schema::dropIfExists('curso_externo');
        Schema::dropIfExists('constancia');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::create('curso_interno', function (Blueprint $table) {
        $table->id();
        // campos...
        $table->timestamps();
    });

    Schema::create('curso_interno_docente', function (Blueprint $table) {
        $table->id();
        // campos...
        $table->timestamps();
    });

    Schema::create('curso_externo', function (Blueprint $table) {
        $table->id();
        // campos...
        $table->timestamps();
    });

    Schema::create('curso_externo_docente', function (Blueprint $table) {
        $table->id();
        // campos...
        $table->timestamps();
    });

    Schema::create('constancia', function (Blueprint $table) {
        $table->id();
        // campos...
        $table->timestamps();
    });
    }
};
