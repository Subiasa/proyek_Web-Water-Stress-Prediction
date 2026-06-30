<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
// use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        // 1. Validasi Input dari Frontend (React)
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        // 2. Cek apakah user ada di database
        $user = User::where('email', $request->email)->first();

        // 3. Verifikasi Password
        // Jika user tidak ditemukan atau password salah
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Email atau password salah.'
            ], 401);
        }

        // 4. Jika berhasil, buat token Sanctum
        $token = $user->createToken('swag-token')->plainTextToken;

        // 5. Kirim respon JSON ke frontend
        return response()->json([
            'message' => 'Login berhasil',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'level' => $user->level, // Penting untuk hak akses di React
            ]
        ]);
    }

    public function logout(Request $request)
    {
        // Menghapus token yang sedang digunakan user saat ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil'
        ]);
    }
}