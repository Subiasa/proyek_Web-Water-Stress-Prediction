<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PredictionHistory extends Model
{
    protected $guarded = [];

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
