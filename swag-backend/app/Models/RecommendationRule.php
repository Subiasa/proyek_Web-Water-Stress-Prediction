<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RecommendationRule extends Model
{
    protected $fillable = [
        'water_stress',
        'recommendation',
        'priority'
    ];

    // Memastikan prioritas dibaca sebagai angka bulat (integer) untuk sorting/pengurutan
    protected function casts(): array
    {
        return [
            'priority' => 'integer',
        ];
    }

    // Relasi One-to-Many: Satu rekomendasi digunakan oleh banyak riwayat prediksi
    public function predictionHistories()
    {
        return $this->hasMany(PredictionHistory::class, 'recommendation_id');
    }
}