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
        Schema::create('sensor_data', function (Blueprint $table) {
            $table->id();
            $table->dateTime('timestamp');
            $table->float('temperature');
            $table->float('humidity');
            $table->float('soil_water_content');
            $table->float('par');
            $table->float('leaf_thickness');
            $table->float('leaf_length');
            $table->foreignId('cluster_id')->nullable()->constrained('clustering_results')->nullOnDelete();
            $table->string('water_stress')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sensor_data');
    }
};
