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
            $table->dropColumn('presidente_academia');
            $table->dropColumn('horas_nombramiento');
            $table->date('presidente_academia_inicio')->nullable();
            $table->date('presidente_academia_fin')->nullable();
            $table->enum('horas_nombramiento', ['Tiempo Completo', 'Tres Cuartos de Tiempo', 'Medio Tiempo', 'Asiganaturas', 'Administrativo', 'Directivo', 'No Capturado'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiencia_docente', function (Blueprint $table) {
            $table->boolean('presidente_academia')->default(false);
            $table->integer('horas_nombramiento')->nullable();

            // Remove the new date fields
            $table->dropColumn(['presidente_academia_inicio', 'presidente_academia_fin']);
            $table->dropColumn('horas_nombramiento');
        });
    }
};
