<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SensorData;
use App\Models\PredictionHistory; 
use Illuminate\Support\Facades\Http; // Disiapkan untuk pemanggilan API Python nanti

class PredictionController extends Controller
{
    /**
     * Memproses data sensor untuk mendapatkan hasil prediksi (Simulasi Fase 1)
     */
    public function predict(Request $request)
    {
        // 1. Validasi Input: Meminta ID dari data sensor yang ingin diprediksi
        $validated = $request->validate([
            'sensor_data_id' => ['required', 'exists:sensor_data,id']
        ]);

        $sensorData = SensorData::find($validated['sensor_data_id']);

        // -------------------------------------------------------------------
        // [Fase 3 Placeholder] - Integrasi Python ML (Random Forest & K-Means)
        // Di masa depan, kodenya akan terlihat seperti ini:
        //
        // $response = Http::post('http://localhost:5000/predict', $sensorData->toArray());
        // $mlResult = $response->json();
        // $waterStressResult = $mlResult['water_stress'];
        // $clusterId = $mlResult['cluster_id'];
        // -------------------------------------------------------------------

        // 2. Mode Simulasi (Sementara API Python belum ada)
        $simulatedWaterStress = 'Normal'; // Asumsi hasil dari Random Forest
        $simulatedClusterId = 1;          // Asumsi hasil dari K-Means

        // 3. Simpan hasil ke tabel riwayat prediksi
        $prediction = PredictionHistory::create([
            'user_id' => $request->user()->id,
            'sensor_data_id' => $sensorData->id,
            'prediction_result' => $simulatedWaterStress,
            'notes' => 'Prediksi dihasilkan melalui mode simulasi API'
        ]);

        // 4. (Opsional) Update data sensor dengan hasil tersebut jika diperlukan
        $sensorData->update([
            'water_stress' => $simulatedWaterStress,
            'cluster_id' => $simulatedClusterId
        ]);

        return response()->json([
            'message' => 'Prediksi berhasil diproses (Mode Simulasi)',
            'data' => [
                'prediction_history' => $prediction,
                'sensor_data' => $sensorData
            ]
        ], 201);
    }
}