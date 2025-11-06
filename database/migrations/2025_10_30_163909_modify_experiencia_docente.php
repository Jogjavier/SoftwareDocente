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
            $table->string('ponencia')->nullable();
            $table->date('ponencia_inicio')->nullable();
            $table->date('ponencia_fin')->nullable();
            $table->string('instructor')->nullable();
            $table->date('instructor_inicio')->nullable();
            $table->date('instructor_fin')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('experiencia_docente', function (Blueprint $table) {
            $table->dropColumn(['ponencia', 'ponencia_inicio', 'ponencia_fin', 'instructor', 'instructor_inicio', 'instructor_fin']);
        });
    }
};
