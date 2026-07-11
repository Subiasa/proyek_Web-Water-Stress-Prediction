<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClusteringResult;
use App\Models\SensorData;
use Illuminate\Support\Facades\File;
use Carbon\Carbon;

class SwagDatasetSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Buat data ClusteringResult (Induk) agar Foreign Key terpenuhi
        $clusters = ['Normal', 'Moderate Stress', 'High Stress'];
        foreach ($clusters as $key => $name) {
            ClusteringResult::updateOrCreate(
                ['id' => $key + 1],
                [
                    'cluster_name' => $name,
                    'centroid_temperature' => 25.0,
                    'centroid_humidity' => 60.0,
                    'centroid_swc' => 30.0,
                    'centroid_par' => 1000.0,
                    'centroid_leaf_thickness' => 0.5,
                    'centroid_leaf_length' => 15.0,
                    'description' => 'Profil karakteristik untuk klaster ' . $name
                ]
            );
        }

        // 2. Baca File CSV Dataset
        $csvPath = storage_path('app/dataset_with_cluster_label.csv');
        if (!File::exists($csvPath)) {
            $this->command->warn("File CSV tidak ditemukan di storage/app/. Membuat data sensor acak (dummy) sebagai fallback...");
            
            $count = 0;
            $stressLabels = ['Healthy Environment', 'Optimal Growth', 'Potential Water Stress'];
            
            for ($i = 0; $i < 50; $i++) {
                $temp = rand(220, 320) / 10.0;
                $rh = rand(500, 850) / 10.0;
                $stressVal = $stressLabels[rand(0, 2)];
                
                SensorData::create([
                    'timestamp'          => Carbon::now()->subMinutes($i * 15),
                    'temp_mean'          => $temp,
                    'rh_mean'            => $rh,
                    'pd1_mean'           => rand(1000, 15000),
                    'pd2_mean'           => rand(1000, 8000),
                    'spectral_mean'      => rand(5000, 25000),
                    'spectral_std'       => rand(1000, 20000),
                    'pla_difference'     => rand(-15000, 2000),
                    'temp_rh_index'      => round($temp * $rh, 2),
                    'temp_range'         => rand(50, 150) / 10.0,
                    'rh_range'           => rand(100, 300) / 10.0, 
                    'cluster_id'         => rand(1, 3), 
                    'water_stress'       => $stressVal 
                ]);
                $count++;
            }
            $this->command->info("Berhasil membuat $count baris data dummy sebagai fallback!");
            return;
        }

        $file = fopen($csvPath, "r");
        
        // 1. Ambil baris pertama sebagai Array Header
        $header = fgetcsv($file, 4000, ","); 
        
        $count = 0;
        $this->command->info("Memulai impor data sensor dengan sistem pemetaan kolom...");

        // 2. Baca baris data selanjutnya
        while (($data = fgetcsv($file, 4000, ",")) !== FALSE) {
            
            // Proteksi: Pastikan jumlah kolom data sama dengan jumlah kolom header
            if (count($header) !== count($data)) {
                continue; 
            }

            // 3. Gabungkan header dan data menjadi Associative Array
            $row = array_combine($header, $data);

            // 4. Proses injeksi data menggunakan nama kolom string
            SensorData::create([
                // Mengambil nilai langsung dari nama kolom di CSV
                'timestamp'          => $row['timestamp'],
                'temp_mean'          => (float) $row['temp_mean'],
                'rh_mean'            => (float) $row['rh_mean'],
                'pd1_mean'           => (float) $row['pd1_mean'],
                'pd2_mean'           => (float) $row['pd2_mean'],
                'spectral_mean'      => (float) $row['spectral_mean'],
                'spectral_std'       => (float) $row['spectral_std'],
                'pla_difference'     => (float) $row['pla_difference'],
                'temp_rh_index'      => (float) $row['temp_rh_index'],
                'temp_range'         => (float) $row['temp_range'],
                'rh_range'           => (float) $row['rh_range'], 
                
                // Mengambil status akhir
                'cluster_id'         => (int) $row['Cluster'] + 1, 
                'water_stress'       => $row['Water_Stress'] 
            ]);

            $count++;
            if ($count >= 500) break; // Batasi 500 baris pertama
        }
        
        fclose($file);
        $this->command->info("Berhasil menyimpan $count baris data menggunakan pemetaan Array!");
    }
}
