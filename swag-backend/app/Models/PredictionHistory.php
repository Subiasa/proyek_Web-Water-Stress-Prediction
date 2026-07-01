<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PredictionHistory extends Model
{
    protected $fillable = [
        'user_id',
        'sensor_data_id',
        'prediction',
        'confidence',
        'recommendation_id'
    ];

    protected function casts(): array
    {
        return [
            'confidence' => 'float', 
        ];
    }

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function sensorData() {
        return $this->belongsTo(SensorData::class);
    }

    public function recommendation() {
        return $this->belongsTo(RecommendationRule::class, 'recommendation_id');
    }
}



// <?php

// namespace App\Models;

// use Illuminate\Database\Eloquent\Model;

// class PredictionHistory extends Model
// {
//     protected $guarded = [];

//     public function user() {
//         return $this->belongsTo(User::class);
//     }
//     public function sensorData() {
//         return $this->belongsTo(SensorData::class);
//     }
//     public function recommendation() {
//         return $this->belongsTo(RecommendationRule::class, 'recommendation_id');
//     }
// }
