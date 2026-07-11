<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    // Menentukan kolom yang aman dan boleh diisi melalui API
    protected $fillable = [
        'timestamp',
        'temp_mean',
        'rh_mean',
        'pd1_mean',
        'pd2_mean',
        'spectral_mean',
        'spectral_std',
        'pla_difference',
        'temp_rh_index',
        'temp_range',
        'rh_range',
        'cluster_id',
        'water_stress'
    ];

    // Memastikan tipe data JSON yang ditransmisikan sangat akurat
    protected function casts(): array
    {
        return [
            'timestamp' => 'datetime',
            'temp_mean' => 'float',
            'rh_mean' => 'float',
            'pd1_mean' => 'float',
            'pd2_mean' => 'float',
            'spectral_mean' => 'float',
            'spectral_std' => 'float',
            'pla_difference' => 'float',
            'temp_rh_index' => 'float',
            'temp_range' => 'float',
            'rh_range' => 'float',
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
