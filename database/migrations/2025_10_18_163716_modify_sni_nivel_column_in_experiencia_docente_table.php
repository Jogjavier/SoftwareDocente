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
            $table->dropColumn('sni_nivel');
        });

        Schema::table('experiencia_docente', function (Blueprint $table) {
            $table->enum('sni_nivel', ['Nivel I', 'Nivel II', 'Emerito'])->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiencia_docente', function (Blueprint $table) {
            $table->dropColumn('sni_nivel');
        });
    }
};
