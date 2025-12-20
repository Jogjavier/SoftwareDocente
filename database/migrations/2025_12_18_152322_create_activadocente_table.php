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
        Schema::create('activadocente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('docente_id')
                ->constrained('docentes')
                ->onDelete('cascade');

            $table->foreignId('carrera_id')
                ->constrained('carreras')
                ->onDelete('cascade');

            // ene-jun o ago-dic
            $table->enum('semestre', ['ENE-JUN', 'AGO-DIC']);

            $table->year('anio');

            $table->boolean('activo')->default(true);

            $table->timestamps();

            // Evita duplicados por semestre
            $table->unique(['docente_id', 'carrera_id', 'semestre', 'anio']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('activadocente');
    }
};
