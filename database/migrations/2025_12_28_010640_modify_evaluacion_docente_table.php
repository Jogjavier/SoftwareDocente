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
        DB::table('evaluacion_docente')->truncate();
        
        Schema::table('evaluacion_docente', function (Blueprint $table) {
            $table->dropColumn('semestre');
            $table->enum('periodo', ['ENE-JUN', 'AGO-DIC'])->after('carrera_id');
            $table->year('anio')->after('periodo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('evaluacion_docente', function (Blueprint $table) {
            $table->dropColumn(['periodo', 'anio']);
            $table->string('semestre')->after('carrera_id');
        });
    }
};
