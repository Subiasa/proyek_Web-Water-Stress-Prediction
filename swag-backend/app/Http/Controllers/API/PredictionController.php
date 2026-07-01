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
        // 1. Validasi Input
        $validated = $request->validate([
            'sensor_data_id' => ['required', 'exists:sensor_data,id']
        ]);

        $sensorData = SensorData::find($validated['sensor_data_id']);

        // 2. Pemanggilan API Python (ML Service)
        try {
            $response = Http::post('http://127.0.0.1:8001/predict', [
                'temp_mean'      => (float) $sensorData->temp_mean,
                'rh_mean'        => (float) $sensorData->rh_mean,
                'pd1_mean'       => (float) $sensorData->pd1_mean,
                'spectral_mean'  => (float) $sensorData->spectral_mean,
                'spectral_std'   => (float) $sensorData->spectral_std,
                'pla_difference' => (float) $sensorData->pla_difference,
                'rh_range'       => (float) $sensorData->rh_range,
            ]);

            if (!$response->successful()) {
                throw new \Exception("ML Service mengembalikan error: " . $response->body());
            }

            $mlResult = $response->json()['data']; // Mengambil bagian 'data' dari response FastAPI
            
            // 3. Simpan hasil ke database menggunakan respons dari Python
            $prediction = PredictionHistory::create([
                'user_id' => $request->user()->id,
                'sensor_data_id' => $sensorData->id,
                'prediction_result' => $mlResult['prediction'], // 'Normal' atau 'Stress'
                'confidence' => $mlResult['confidence'],        // Simpan nilai akurasi
                'notes' => 'Prediksi berhasil diproses via ML Microservice'
            ]);

            // 4. Update data sensor
            $sensorData->update([
                'water_stress' => $mlResult['prediction'],
                // cluster_id tidak diset karena model K-Means tidak digunakan (opsional)
            ]);

            return response()->json([
                'message' => 'Prediksi berhasil diproses',
                'data' => [
                    'prediction_history' => $prediction,
                    'sensor_data' => $sensorData
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