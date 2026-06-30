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
        Schema::create('model_information', function (Blueprint $table) {
            $table->id();
            $table->string('algorithm');
            $table->decimal('accuracy', 5, 4);
            $table->decimal('precision', 5, 4);
            $table->decimal('recall', 5, 4);
            $table->decimal('f1_score', 5, 4);
            $table->dateTime('training_date');
            $table->string('dataset_version');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('model_information');
    }
};
