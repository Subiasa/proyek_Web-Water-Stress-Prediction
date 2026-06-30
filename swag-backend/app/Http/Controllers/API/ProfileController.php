<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            // Validasi email harus unik, KECUALI untuk email user itu sendiri saat ini
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
        ]);

        $user->update($validated);

        return response()->json([
            'message' => 'Profil berhasil diperbarui',
            'data' => $user
        ]);
    }

    public function updatePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'new_password' => ['required', 'string', 'min:8', 'confirmed'], // Membutuhkan input 'new_password_confirmation' di frontend
        ]);

        $user = $request->user();

        // Memeriksa apakah kata sandi saat ini cocok dengan yang ada di database
        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'message' => 'Kata sandi saat ini tidak valid'
            ], 400);
        }

        // Mengganti dengan kata sandi baru yang sudah dienkripsi
        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json([
            'message' => 'Kata sandi berhasil diperbarui'
        ]);
    }
}