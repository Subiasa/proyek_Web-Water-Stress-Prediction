<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SensorData extends Model
{
    protected $guarded = [];

    public function cluster() {
        return $this->belongsTo(ClusteringResult::class, 'cluster_id');
    }
    public function predictionHistories() {
        return $this->hasMany(PredictionHistory::class);
    }
}
