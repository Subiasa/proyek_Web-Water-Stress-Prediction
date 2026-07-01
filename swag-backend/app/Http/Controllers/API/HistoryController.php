<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\PredictionHistory;

class HistoryController extends Controller
{
    public function history(Request $request)
    {
        // Mengambil data riwayat berdasarkan ID user yang mengakses API (dari token Sanctum)
        // with('sensorData') mengambil relasi data metrik lingkungannya sekaligus
        $history = PredictionHistory::with('sensorData')
                    ->where('user_id', $request->user()->id)
                    ->latest()
                    ->paginate(10);

        return response()->json([
            'message' => 'Data riwayat pengujian berhasil dimuat',
            'data' => $history
        ]);
    }
}