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
        Schema::create('constancia', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_completo');
            $table->string('curp');
            $table->string('centro_adscripcion');
            $table->date('periodo_inicio');
            $table->date('periodo_fin');
            $table->string('nombre_curso');
            $table->enum('modalidad', ['Virtual', 'Presencial', 'Mixto']);
            $table->integer('horas');
            $table->string('folio')->unique();
            $table->date('fecha_emision');
            $table->string('autoridad_educativa');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('constancia');
    }
};
