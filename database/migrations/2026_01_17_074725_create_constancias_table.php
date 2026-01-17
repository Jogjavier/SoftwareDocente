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
        Schema::create('constancias', function (Blueprint $table) {
            $table->id();

            $table->foreignId('capacitacion_id')
                ->constrained('capacitaciones')
                ->cascadeOnDelete();

            $table->string('folio')->unique();
            $table->uuid('hash')->unique();

            $table->string('nombre_beneficiario');
            $table->enum('tipo', ['facilitador', 'docente']);

            $table->timestamp('fecha_emision');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('constancias');
    }
};
