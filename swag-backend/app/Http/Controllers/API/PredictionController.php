<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SensorData;
use App\Models\PredictionHistory; 
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log; // Untuk mencatat error jika ML service mati

class PredictionController extends Controller
{
    public function predict(Request $request)
    {
        // 1. Validasi Input 10 Parameter dari Frontend
        $validated = $request->validate([
            'temp_mean' => 'required|numeric',
            'rh_mean' => 'required|numeric',
            'pd1_mean' => 'required|numeric',
            'pd2_mean' => 'required|numeric',
            'spectral_mean' => 'required|numeric',
            'spectral_std' => 'required|numeric',
            'pla_difference' => 'required|numeric',
            'temp_rh_index' => 'required|numeric',
            'temp_range' => 'required|numeric',
            'rh_range' => 'required|numeric',
        ]);

        // 2. Pemanggilan API Python (ML Service)
        try {
            $response = Http::post('http://127.0.0.1:8001/predict', $validated);

            if (!$response->successful()) {
                throw new \Exception("ML Service mengembalikan error: " . $response->body());
            }

            $mlResult = $response->json()['data']; // Mengambil bagian 'data' dari response FastAPI
            
            // 3. Buat dummy SensorData untuk foreign key requirement
            $sensorData = SensorData::create([
                'timestamp' => now(),
                'temp_mean' => $validated['temp_mean'],
                'rh_mean' => $validated['rh_mean'],
                'pd1_mean' => $validated['pd1_mean'],
                'pd2_mean' => $validated['pd2_mean'],
                'spectral_mean' => $validated['spectral_mean'],
                'spectral_std' => $validated['spectral_std'],
                'pla_difference' => $validated['pla_difference'],
                'temp_rh_index' => $validated['temp_rh_index'],
                'temp_range' => $validated['temp_range'],
                'rh_range' => $validated['rh_range'],
                'water_stress' => $mlResult['prediction'],
            ]);

            // Memetakan label ML ke ID rekomendasi di database
            $recommendationId = null;
            $mlPrediction = $mlResult['prediction'];
            if ($mlPrediction === 'Healthy Environment' || $mlPrediction === 'Optimal Growth') {
                $recommendationId = 1; // Normal
            } elseif ($mlPrediction === 'Potential Water Stress') {
                $recommendationId = 3; // High Stress
            }

            // 4. Simpan hasil ke prediction_histories
            $prediction = PredictionHistory::create([
                'user_id' => $request->user()->id,
                'sensor_data_id' => $sensorData->id,
                'prediction' => $mlResult['prediction'], // Kolom aslinya bernama 'prediction' di migration, bukan 'prediction_result'
                'confidence' => $mlResult['confidence'],
                'recommendation_id' => $recommendationId,
            ]);

            // Eager load relasi recommendation agar deskripsi rekomendasi dikirim ke frontend
            $prediction->load('recommendation');

            return response()->json([
                'message' => 'Prediksi berhasil diproses',
                'data' => [
                    'prediction_history' => $prediction,
                    'sensor_data' => $sensorData,
                    'factors' => $mlResult['factors'] ?? []
                ]
            ], 201);

        } catch (\Exception $e) {
            Log::error("Gagal terhubung ke ML Service: " . $e->getMessage());
            return response()->json([
                'message' => 'Gagal memproses prediksi di sisi server ML',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}