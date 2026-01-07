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
        Schema::create('capacitacion_docente', function (Blueprint $table) {
            $table->id();

            $table->foreignId('capacitacion_id')
                ->constrained('capacitaciones')
                ->onDelete('cascade');

            $table->foreignId('docente_id')
                ->constrained('docentes')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('capacitacion_docente');
    }
};
