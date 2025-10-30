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
            $table->dropColumn('presidente_academia_inicio');
            $table->dropColumn('presidente_academia_fin');
            $table->string('presidente_academia_inicio')->nullable();
            $table->string('presidente_academia_fin')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiencia_docente', function (Blueprint $table) {
            $table->dropColumn('presidente_academia_inicio');
            $table->dropColumn('presidente_academia_fin');
            $table->date('presidente_academia_inicio')->nullable();
            $table->date('presidente_academia_fin')->nullable();
        });
    }
};
