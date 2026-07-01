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

        // 1. Menghitung total data
        $totalDataset = SensorData::count();
        $totalPredictions = PredictionHistory::where('user_id', $userId)->count();

        // 2. Mengambil status lingkungan terbaru (data sensor terakhir)
        $latestSensor = SensorData::latest()->first();

        // 3. Mengambil hasil prediksi terakhir dari user tersebut
        $latestPrediction = PredictionHistory::where('user_id', $userId)->latest()->first();

        return response()->json([
            'message' => 'Data dashboard berhasil dimuat',
            'data' => [
                'metrics' => [
                    'total_dataset' => $totalDataset,
                    'total_predictions' => $totalPredictions,
                ],
                'latest_status' => [
                    'temperature' => $latestSensor ? $latestSensor->temperature : null,
                    'humidity' => $latestSensor ? $latestSensor->humidity : null,
                    'water_stress' => $latestPrediction ? $latestPrediction->prediction_result : 'Belum ada data'
                ]
            ]
        ]);
    }
}