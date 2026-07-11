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
            $table->float('temp_mean');
            $table->float('rh_mean');
            $table->float('pd1_mean');
            $table->float('pd2_mean');
            $table->float('spectral_mean');
            $table->float('spectral_std');
            $table->float('pla_difference');
            $table->float('temp_rh_index');
            $table->float('temp_range');
            $table->float('rh_range');
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
