<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SensorData;
use App\Models\PredictionHistory;

class DashboardController extends Controller
{
    public function summary(Request $request)
    {
        $userId = $request->user()->id;

        $totalDataset = SensorData::count();
        $totalPredictions = PredictionHistory::count();

        // 1. Trend Data (Maksimal 7 data terbaru untuk Line Chart)
        $recentSensors = SensorData::orderBy('created_at', 'desc')->take(7)->get()->reverse()->values();
        $trendData = $recentSensors->map(function($sensor) {
            return [
                'time' => $sensor->created_at->format('H:i'),
                'temp_mean' => round($sensor->temp_mean, 1),
                'rh_mean' => round($sensor->rh_mean, 1),
                'pd1_mean' => round($sensor->pd1_mean, 0),
                'pd2_mean' => round($sensor->pd2_mean, 0),
                'spectral_mean' => round($sensor->spectral_mean, 0),
            ];
        });

        // 2. Distribution Data (Data klasifikasi untuk Pie Chart)
        $distributionData = [];
        $stressCounts = SensorData::whereNotNull('water_stress')
            ->select('water_stress', \Illuminate\Support\Facades\DB::raw('count(*) as value'))
            ->groupBy('water_stress')
            ->get();
        
        foreach ($stressCounts as $item) {
            $distributionData[] = [
                'name' => $item->water_stress,
                'value' => (int) $item->value
            ];
        }

        // 3. Recent Activity (Aktivitas prediksi terbaru)
        $recentActivities = PredictionHistory::with('user')
            ->orderBy('created_at', 'desc')
            ->take(5)
            ->get()
            ->map(function($history) {
                return [
                    'id' => '#PRD-' . str_pad($history->id, 3, '0', STR_PAD_LEFT),
                    'prediction_label' => $history->prediction ?? 'Unknown',
                    'confidence' => $history->confidence ? $history->confidence . '%' : '-',
                    'time' => $history->created_at->diffForHumans(),
                    'user' => $history->user->name ?? 'System'
                ];
            });

        return response()->json([
            'message' => 'Data dashboard berhasil dimuat',
            'data' => [
                'summary' => [
                    'total_data' => $totalDataset,
                    'total_predictions' => $totalPredictions,
                    'total_clusters' => 3, 
                    'accuracy' => '98.4%' // Nilai statis sementara
                ],
                'trendData' => $trendData,
                'distributionData' => $distributionData,
                'recentActivity' => $recentActivities
            ]
        ]);
    }
}            