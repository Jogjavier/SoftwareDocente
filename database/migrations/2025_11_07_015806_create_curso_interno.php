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
        Schema::create('curso_interno', function (Blueprint $table) {
            $table->id();
            $table->string('nombre')->nullable();
            $table->string('instructor')->nullable();
            $table->string('autoridad_educativa')->nullable();
            $table->foreignId('docentes')->nullable()->constrained('docentes')->onDelete('set null');
            $table->integer('duracion_horas')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->enum('tipo',['formacion', 'actualizacion'])->nullable();
            $table->enum('modalidad',['virtual', 'presencial', 'mixto'])->nullable();
            $table->date('folio_fechaemision')->nullable();
            $table->integer('modulo_horas')->nullable();
            $table->integer('modulo_calificacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curso_interno');
    }
};
