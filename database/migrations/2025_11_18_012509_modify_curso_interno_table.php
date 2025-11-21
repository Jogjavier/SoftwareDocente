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
        Schema::table('curso_interno', function (Blueprint $table) {
            $table->dropForeign(['docentes']);
            $table->dropColumn('docentes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('curso_interno', function (Blueprint $table) {
            Schema::table('curso_interno', function (Blueprint $table) {
            $table->foreignId('docentes')->nullable()->constrained('docentes')->onDelete('set null');
        });
        });
    }
};
