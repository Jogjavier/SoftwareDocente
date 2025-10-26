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
        Schema::create('experiencia_docente', function (Blueprint $table) {
            $table->id();
            $table->foreignId('docente_id')->constrained()->onDelete('cascade');
            $table->year('anio_ingreso')->nullable();
            $table->foreignId('carrera_id')->nullable()->constrained('carreras')->onDelete('set null');
            $table->integer('horas_nombramiento')->nullable();
            $table->boolean('presidente_academia')->default(false);
            $table->string('perfildeseable_path')->nullable(); // archivo perfil deseable
            $table->date('perfildeseable_fecha_inicio')->nullable();
            $table->date('perfildeseable_fecha_fin')->nullable(); 
            $table->enum('cuerpoacademico_grado',['Formacion', 'Conclusion', 'Consolidado'])->nullable();
            $table->date('cuerpoacademico_fecha_inicio')->nullable();
            $table->date('cuerpoacademico_fecha_fin')->nullable();
            $table->year('sni_anio')->nullable();
            $table->string('sni_nivel')->nullable();
            $table->string('investigaciones')->nullable();
            $table->string('derecho_autor')->nullable();
            $table->string('titulo')->nullable();
            $table->string('rama')->nullable();
            $table->enum('tipo',['nacionales', 'internacionales'])->nullable();
            $table->enum('revista',['arbitrada', 'indexada'])->nullable();
            $table->date('fecha_publicacion')->nullable();
            $table->string('nombre_articulo')->nullable();
            $table->string('link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('experiencia_docente');
    }
};
