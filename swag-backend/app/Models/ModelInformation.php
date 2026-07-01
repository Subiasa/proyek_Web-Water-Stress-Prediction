<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ModelInformation extends Model
{
    protected $table = 'model_information';

    protected $fillable = [
        'algorithm',
        'accuracy',
        'precision',
        'recall',
        'f1_score',
        'training_date',
        'dataset_version'
    ];

    // Memastikan metrik evaluasi model dibaca sebagai angka desimal dan waktu training sebagai datetime
    protected function casts(): array
    {
        return [
            'accuracy' => 'float',
            'precision' => 'float',
            'recall' => 'float',
            'f1_score' => 'float',
            'training_date' => 'datetime',
        ];
    }
}
