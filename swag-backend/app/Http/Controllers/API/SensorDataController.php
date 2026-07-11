<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\SensorData;
use Illuminate\Http\Request;

class SensorDataController extends Controller
{
    public function index()
    {
        // Menggunakan paginasi (15 data per halaman) dan mengurutkan dari yang terbaru
        // with('cluster') digunakan untuk mengambil data relasi klaster sekaligus (Eager Loading)
        $sensorData = SensorData::with('cluster')->latest()->paginate(15);
        
        return response()->json([
            'message' => 'Data sensor berhasil diambil',
            'data' => $sensorData
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'timestamp' => ['required', 'date'],
            'temp_mean' => ['required', 'numeric'],
            'rh_mean' => ['required', 'numeric'],
            'pd1_mean' => ['required', 'numeric'],
            'pd2_mean' => ['required', 'numeric'],
            'spectral_mean' => ['required', 'numeric'],
            'spectral_std' => ['required', 'numeric'],
            'pla_difference' => ['required', 'numeric'],
            'temp_rh_index' => ['required', 'numeric'],
            'temp_range' => ['required', 'numeric'],
            'rh_range' => ['required', 'numeric'],
            // cluster_id dan water_stress biasanya dihasilkan dari Python ML, 
            // sehingga opsional saat input awal dari IoT/Frontend
        ]);

        $sensorData = SensorData::create($validated);

        return response()->json([
            'message' => 'Data sensor berhasil ditambahkan',
            'data' => $sensorData
        ], 201); // 201 Created
    }

    public function show(string $id)
    {
        $sensorData = SensorData::with('cluster')->find($id);

        if (!$sensorData) {
            return response()->json(['message' => 'Data sensor tidak ditemukan'], 404);
        }

        return response()->json([
            'message' => 'Detail data sensor',
            'data' => $sensorData
        ]);
    }

    public function update(Request $request, string $id)
    {
        $sensorData = SensorData::find($id);

        if (!$sensorData) {
            return response()->json(['message' => 'Data sensor tidak ditemukan'], 404);
        }

        // 'sometimes' berarti validasi hanya berjalan jika field tersebut dikirimkan
        $validated = $request->validate([
            'timestamp' => ['sometimes', 'date'],
            'temp_mean' => ['sometimes', 'numeric'],
            'rh_mean' => ['sometimes', 'numeric'],
            'pd1_mean' => ['sometimes', 'numeric'],
            'pd2_mean' => ['sometimes', 'numeric'],
            'spectral_mean' => ['sometimes', 'numeric'],
            'spectral_std' => ['sometimes', 'numeric'],
            'pla_difference' => ['sometimes', 'numeric'],
            'temp_rh_index' => ['sometimes', 'numeric'],
            'temp_range' => ['sometimes', 'numeric'],
            'rh_range' => ['sometimes', 'numeric'],
            'cluster_id' => ['nullable', 'exists:clustering_results,id'],
            'water_stress' => ['nullable', 'string']
        ]);

        $sensorData->update($validated);

        return response()->json([
            'message' => 'Data sensor berhasil diperbarui',
            'data' => $sensorData
        ]);
    }

    public function destroy(string $id)
    {
        $sensorData = SensorData::find($id);

        if (!$sensorData) {
            return response()->json(['message' => 'Data sensor tidak ditemukan'], 404);
        }

        $sensorData->delete();

        return response()->json([
            'message' => 'Data sensor berhasil dihapus'
        ]);
    }
}