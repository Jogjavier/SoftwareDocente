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
        Schema::create('table_docentes', function (Blueprint $table) {
            $table->id();
            $table->string('apellido_paterno');
            $table->string('apellido_materno')->nullable();
            $table->string('nombres');
            $table->date('fecha_nacimiento');
            $table->enum('sexo', ['M', 'F']);
            $table->string('rfc')->unique();
            $table->string('curp')->unique();
            $table->string('email')->unique();
            $table->string('telefono')->nullable();
            $table->string('nivel_ingles')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('table_docentes');
    }
};
