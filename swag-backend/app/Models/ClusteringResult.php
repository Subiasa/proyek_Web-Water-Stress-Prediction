<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClusteringResult extends Model
{
    // Menentukan kolom yang aman untuk diisi
    protected $fillable = [
        'cluster_name',
        'centroid_temperature',
        'centroid_humidity',
        'centroid_swc',
        'centroid_par',
        'centroid_leaf_thickness',
        'centroid_leaf_length',
        'description'
    ];

    // Memastikan metrik sentroid dibaca sebagai angka desimal yang presisi
    protected function casts(): array
    {
        return [
            'centroid_temperature' => 'float',
            'centroid_humidity' => 'float',
            'centroid_swc' => 'float',
            'centroid_par' => 'float',
            'centroid_leaf_thickness' => 'float',
            'centroid_leaf_length' => 'float',
        ];
    }

    // Relasi One-to-Many: Satu klaster memiliki banyak data sensor
    public function sensorData()
    {
        return $this->hasMany(SensorData::class, 'cluster_id');
    }
}