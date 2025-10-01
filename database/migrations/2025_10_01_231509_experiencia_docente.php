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
         Schema::create('experiencia_docentes', function (Blueprint $table) {
            $table->id();
            
            // Relación con docente
            $table->foreignId('docente_id')->constrained()->onDelete('cascade');
            
            // Datos principales
            $table->date('fecha_ingreso_profesor');
            $table->string('carrera');
            $table->integer('horas');
            $table->boolean('presidente_academia')->default(false);
            $table->string('semestre');
            $table->string('perfil_deseable');
            $table->string('archivo_perfil_path')->nullable();
            $table->date('fecha_inicio_perfil')->nullable();
            $table->date('fecha_fin_perfil')->nullable();
            
            // Cuerpo académico (opcional)
            $table->string('cuerpo_academico')->nullable();
            $table->date('fecha_inicio')->nullable();
            $table->date('fecha_fin')->nullable();
            $table->string('nivel_cuerpo_academico')->nullable();
            
            // SNI (Sistema Nacional de Investigadores) (opcional)
            $table->integer('sni_anio')->nullable();
            $table->string('sni_nivel')->nullable();
            
            // Investigaciones (opcional)
            $table->text('investigaciones')->nullable();
            
            // Publicaciones (opcional)
            $table->integer('publicaciones_nacionales')->default(0);
            $table->integer('publicaciones_internacionales')->default(0);
            $table->integer('publicaciones_revista_arbitrada')->default(0);
            $table->integer('publicaciones_revista_indexada')->default(0);
            $table->date('publicacion_fecha')->nullable();
            $table->string('publicacion_nombre_articulo')->nullable();
            $table->string('publicacion_link_consulta')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
