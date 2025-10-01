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
        Schema::create('nivel_estudios', function (Blueprint $table) {
        $table->id();
        $table->foreignId('docente_id')->constrained()->onDelete('cascade'); // Relación con Docentes
        $table->enum('nivel', ['Licenciatura', 'Maestría', 'Doctorado']);
        $table->string('siglas', 50)->nullable();
        $table->string('nombre')->nullable();
        $table->string('escuela_procedencia')->nullable();
        $table->string('titulo_path')->nullable(); // archivo título
        $table->string('cedula_path')->nullable(); // archivo cédula
        $table->timestamps();
    });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('nivel_estudios', function (Blueprint $table) {
            //
        });
    }
};
