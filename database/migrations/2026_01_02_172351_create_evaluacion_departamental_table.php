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
        Schema::create('evaluacion_departamental', function (Blueprint $table) {
            $table->id();
            $table->foreignId('docente_id')->nullable()->constrained('docentes')->onDelete('set null');
            $table->foreignId('carrera_id')->nullable()->constrained('carreras')->onDelete('set null');
            $table->enum('periodo', ['ENE-JUN', 'AGO-DIC'])->after('carrera_id');
            $table->year('anio')->after('periodo');
            $table->decimal('docencia', 3, 2);
            $table->decimal('tutoria', 3, 2);
            $table->decimal('vinculacion', 3, 2);
            $table->decimal('gestion', 3, 2);
            $table->decimal('global', 3, 2);
            $table->decimal('resultado_global', 3, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('evaluacion_departamental');
    }
};
