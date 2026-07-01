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
            $this->command->error("File CSV tidak ditemukan di storage/app/");
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
                'temperature'        => (float) $row['temp_mean'],
                'humidity'           => (float) $row['rh_mean'],
                
                // Kolom wajib di database, namun tidak ada di CSV (diisi default 0)
                'soil_water_content' => 0.0, 
                'par'                => 0.0, 
                'leaf_thickness'     => 0.0, 
                'leaf_length'        => 0.0, 
                
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
