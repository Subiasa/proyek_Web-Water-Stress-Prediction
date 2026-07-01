<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    // Menentukan kolom yang aman dan boleh diisi melalui API
    protected $fillable = [
        'timestamp',
        'temperature',
        'humidity',
        'soil_water_content',
        'par',
        'leaf_thickness',
        'leaf_length',
        'cluster_id',
        'water_stress'
    ];

    // Memastikan tipe data JSON yang ditransmisikan sangat akurat
    protected function casts(): array
    {
        return [
            'timestamp' => 'datetime',
            'temperature' => 'float',
            'humidity' => 'float',
            'soil_water_content' => 'float',
            'par' => 'float',
            'leaf_thickness' => 'float',
            'leaf_length' => 'float',
        ];
    }

    public function cluster() {
        return $this->belongsTo(ClusteringResult::class, 'cluster_id');
    }

    public function predictionHistories() {
        return $this->hasMany(PredictionHistory::class);
    }
}


// <?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class SensorData extends Model
// {
//     protected $guarded = [];

//     public function cluster() {
//         return $this->belongsTo(ClusteringResult::class, 'cluster_id');
//     }
//     public function predictionHistories() {
//         return $this->hasMany(PredictionHistory::class);
//     }
// }
