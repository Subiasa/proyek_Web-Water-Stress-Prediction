<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        \App\Models\User::create([
            'name' => 'Aditya',
            'email' => 'aditya1024@gmail.com',
            'password' => \Illuminate\Support\Facades\Hash::make('password123'),
            'level' => 'user',
        ]);
    }
}
