<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('clustering_results', function (Blueprint $table) {
            $table->id();
            $table->string('cluster_name');
            $table->float('centroid_temperature');
            $table->float('centroid_humidity');
            $table->float('centroid_swc');
            $table->float('centroid_par');
            $table->float('centroid_leaf_thickness');
            $table->float('centroid_leaf_length');
            $table->text('description')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('clustering_results');
    }
};
