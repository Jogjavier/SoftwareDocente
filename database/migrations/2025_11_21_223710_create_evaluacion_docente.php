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
        Schema::create('evaluacion_docente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('docente_id')->nullable()->constrained('docentes')->onDelete('set null');
            $table->foreignId('carrera_id')->nullable()->constrained('carreras')->onDelete('set null');
            $table->string('semestre');
            $table->decimal('dominio_asignatura', 3, 2); // Permite valores como 9.50
            $table->decimal('planificacion_curso', 3, 2);
            $table->decimal('ambiente_aprendizaje', 3, 2);
            $table->decimal('estrategias_metodos', 3, 2);
            $table->decimal('motivacion', 3, 2);
            $table->decimal('evaluacion', 3, 2);
            $table->decimal('comunicacion', 3, 2);
            $table->decimal('gestion_recurso', 3, 2);
            $table->decimal('tecnologias', 3, 2);
            $table->decimal('satisfaccion', 3, 2);
            $table->decimal('resultado_global', 3, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluacion_docente');
    }
};
