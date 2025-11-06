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
        Schema::table('experiencia_docente', function (Blueprint $table) {
            $table->dropColumn('anio_ingreso');
            $table->dropColumn('carrera_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiencia_docente', function (Blueprint $table) {
            $table->year('anio_ingreso')->nullable();
            $table->foreignId('carrera_id')->nullable()->constrained('carreras')->onDelete('set null');
        });
    }
};
