<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
// use Illuminate\Http\Request;
use App\Models\SensorData;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    public function chartData()
    {
        // 1. Grafik Tren Lingkungan (Rata-rata Suhu & Kelembapan 7 Hari Terakhir)
        // Mengelompokkan data berdasarkan tanggal dan mencari nilai rata-ratanya
        $trendData = SensorData::select(
            DB::raw('DATE(timestamp) as date'),
            DB::raw('AVG(temperature) as avg_temp'),
            DB::raw('AVG(humidity) as avg_humidity')
        )
            ->groupBy('date')
            ->orderBy('date', 'desc')
            ->limit(7)
            ->get();

        // 2. Grafik Distribusi Klaster (K-Means)
        $clusterDistribution = SensorData::select('cluster_id', DB::raw('count(*) as total'))
            ->whereNotNull('cluster_id')
            ->groupBy('cluster_id')
            ->get();

        // 3. Grafik Distribusi Water Stress (Random Forest)
        $stressDistribution = SensorData::select('water_stress', DB::raw('count(*) as total'))
            ->whereNotNull('water_stress')
            ->groupBy('water_stress')
            ->get();

        return response()->json([
            'message' => 'Data analitik berhasil dimuat',
            'data' => [
                'weekly_trend' => $trendData,
                'cluster_distribution' => $clusterDistribution,
                'stress_distribution' => $stressDistribution
            ]
        ]);
    }
}
