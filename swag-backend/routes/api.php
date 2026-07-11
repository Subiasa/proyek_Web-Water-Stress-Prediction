<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\HistoryController;
use App\Http\Controllers\API\SensorDataController;
use App\Http\Controllers\API\PredictionController;
use App\Http\Controllers\API\DashboardController;
use App\Http\Controllers\API\ProfileController;

// Rute Publik
Route::post('/login', [AuthController::class, 'login']);

// Rute yang Dilindungi Autentikasi Sanctum
Route::middleware('auth:sanctum')->group(function () {
    // 1. Autentikasi & Sesi
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    // 2. Profile Menu
    Route::put('/profile', [ProfileController::class, 'updateProfile']);
    Route::put('/profile/password', [ProfileController::class, 'updatePassword']);

    // 3. Dashboard Menu
    Route::get('/dashboard', [DashboardController::class, 'summary']);

    // 5. Dataset Menu (CRUD Sensor)
    Route::apiResource('sensors', SensorDataController::class);

    // 6. Prediction Menu
    Route::post('/predict', [PredictionController::class, 'predict']);

    // 7. History Menu
    Route::get('/history', [HistoryController::class, 'history']);

    // Route::post('/predict', [PredictionController::class, 'predict']);
    // Route::get('/history', [PredictionController::class, 'history']);
});
