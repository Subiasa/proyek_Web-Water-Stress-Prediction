import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Activity, Thermometer, Droplets, 
    Settings2, CheckCircle2, History,
    Sun, Camera
} from 'lucide-react';

const Prediction = () => {
    // 1. State Manajemen Form Input (11 Fitur Mentah)
    const [formData, setFormData] = useState({
        temp_mean: '',
        rh_mean: '',
        pd1_mean: '',
        pd2_mean: '',
        spectral_mean: '',
        spectral_std: '',
        pla_difference: '',
        temp_range: '',
        rh_range: ''
    });

    // Fitur Turunan yang dihitung otomatis
    const [derived, setDerived] = useState({
        temp_rh_index: 0,
        temp_range: 0,
        rh_range: 0
    });

    // 2. State Manajemen Hasil & Status
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

    // Kalkulasi otomatis setiap kali formData berubah
    useEffect(() => {
        const temp = parseFloat(formData.temp_mean) || 0;
        const rh = parseFloat(formData.rh_mean) || 0;

        setDerived({
            temp_rh_index: Number((temp * rh).toFixed(2))
        });
    }, [formData]);

    // Menangani perubahan input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Mereset form dan hasil
    const handleReset = () => {
        setFormData({
            temp_mean: '',
            rh_mean: '',
            pd1_mean: '',
            pd2_mean: '',
            spectral_mean: '',
            spectral_std: '',
            pla_difference: '',
            temp_range: '',
            rh_range: ''
        });
        setResult(null);
        setError('');
    };

    // Mengirim data ke Backend Laravel
    const handlePredict = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const payload = {
                temp_mean: parseFloat(formData.temp_mean) || 0,
                rh_mean: parseFloat(formData.rh_mean) || 0,
                pd1_mean: parseFloat(formData.pd1_mean) || 0,
                pd2_mean: parseFloat(formData.pd2_mean) || 0,
                spectral_mean: parseFloat(formData.spectral_mean) || 0,
                spectral_std: parseFloat(formData.spectral_std) || 0,
                pla_difference: parseFloat(formData.pla_difference) || 0,
                temp_rh_index: derived.temp_rh_index,
                temp_range: parseFloat(formData.temp_range) || 0,
                rh_range: parseFloat(formData.rh_range) || 0
            };

            const response = await api.post('/predict', payload);
            
            const predictionText = response.data.data.prediction_history.prediction;
            const dbRecommendation = response.data.data.prediction_history.recommendation?.recommendation;
            
            // Gunakan rekomendasi dari DB sebagai prioritas utama, dengan fallback lokal
            const rec = dbRecommendation || (
                predictionText.includes('Healthy') || predictionText.includes('0')
                ? 'Tanaman berada pada kondisi lingkungan yang baik. Lanjutkan pola penyiraman seperti biasa.'
                : predictionText.includes('Optimal')
                ? 'Kondisi tanaman optimal. Pertahankan kelembapan dan suhu saat ini.'
                : 'Tanaman mulai mengalami indikasi cekaman air. Disarankan meningkatkan frekuensi penyiraman dan melakukan monitoring intensif.'
            );

            setResult({
                status: predictionText === '0' ? 'Normal' : predictionText === '1' ? 'Stress' : predictionText,
                confidence: `${response.data.data.prediction_history.confidence}%`,
                recommendation: rec,
                factors: response.data.data.factors || []
            });

        } catch (err) {
            console.error("Prediction error:", err);
            setError('Gagal memproses prediksi. Pastikan semua input terisi dengan angka yang valid.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto font-sans text-gray-900">
            {/* Header */}
            <div className="mb-8 border-b border-gray-300 pb-4">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Water Stress Prediction</h1>
                <p className="text-sm text-gray-500 font-medium">Model Random Forest - Input 10 Fitur Lingkungan dan Optikal</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded text-sm font-medium flex items-center justify-between">
                    <span>{error}</span>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* KOLOM KIRI: Form Input */}
                <div className="lg:col-span-1 space-y-6 h-fit">
                    <form onSubmit={handlePredict} className="space-y-6">
                        
                        {/* Section 1: Environmental Sensor */}
                        <div className="bg-white border border-gray-300 rounded shadow-sm p-5">
                            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
                                <Thermometer className="w-5 h-5 text-black" />
                                <h2 className="text-md font-bold">1. Environmental Sensor</h2>
                            </div>
                            <div className="space-y-4">
                                <InputGroup label="Air Temperature Mean (°C)" name="temp_mean" value={formData.temp_mean} onChange={handleChange} placeholder="e.g. 24.5" />
                                <InputGroup label="Relative Humidity Mean (%)" name="rh_mean" value={formData.rh_mean} onChange={handleChange} placeholder="e.g. 68.3" />
                                
                            </div>
                        </div>

                        {/* Section 2: Optical Sensor */}
                        <div className="bg-white border border-gray-300 rounded shadow-sm p-5">
                            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
                                <Camera className="w-5 h-5 text-black" />
                                <h2 className="text-md font-bold">2. Optical Sensor</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <InputGroup label="PD1 Mean" name="pd1_mean" value={formData.pd1_mean} onChange={handleChange} placeholder="15600" />
                                    <InputGroup label="PD2 Mean" name="pd2_mean" value={formData.pd2_mean} onChange={handleChange} placeholder="3050" />
                                </div>
                                <InputGroup label="Spectral Mean" name="spectral_mean" value={formData.spectral_mean} onChange={handleChange} placeholder="9200" />
                                <InputGroup label="Spectral Std Dev" name="spectral_std" value={formData.spectral_std} onChange={handleChange} placeholder="18400" />
                                <InputGroup label="PLA Difference" name="pla_difference" value={formData.pla_difference} onChange={handleChange} placeholder="-18250" />
                            </div>
                        </div>

                        {/* Section 3: Derived Features */}
                        <div className="bg-gray-50 border border-gray-300 rounded shadow-sm p-5">
                            <div className="flex items-center gap-2 border-b border-gray-200 pb-3 mb-4">
                                <Settings2 className="w-5 h-5 text-gray-500" />
                                <h2 className="text-md font-bold text-gray-700">3. Derived Features</h2>
                            </div>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <InputGroup label="Temp Range (°C)" name="temp_range" value={formData.temp_range} onChange={handleChange} placeholder="e.g. 10.5" />
                                    <InputGroup label="RH Range (%)" name="rh_range" value={formData.rh_range} onChange={handleChange} placeholder="e.g. 15.2" />
                                </div>
                                <ReadOnlyCard label="Temp × RH Index (Auto)" value={derived.temp_rh_index} />
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="flex-1 bg-black text-white font-semibold py-3 rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex justify-center items-center gap-2 text-sm"
                            >
                                {isLoading ? (
                                    <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Processing...</>
                                ) : 'Predict'}
                            </button>
                            <button 
                                type="button" 
                                onClick={handleReset}
                                className="px-6 py-3 bg-white border border-gray-300 text-black font-semibold rounded hover:bg-gray-50 transition-colors text-sm"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                </div>

                {/* KOLOM KANAN: Hasil Output & Faktor */}
                <div className="lg:col-span-2 space-y-6">
                    
                    {/* Kartu Hasil Utama */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-12 h-12 border-l border-b border-gray-300 bg-gray-50"></div>
                        
                        <div className="p-8">
                            <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prediction Output</p>
                                    {result ? (
                                        <h2 className={`text-5xl font-extrabold tracking-tight ${result.status === 'Stress' || result.status.includes('Water Stress') ? 'text-red-600' : 'text-green-600'}`}>
                                            {result.status}
                                        </h2>
                                    ) : (
                                        <h2 className="text-3xl font-bold text-gray-300 tracking-tight">Menunggu Input...</h2>
                                    )}
                                    <p className="text-sm text-gray-500 mt-2">
                                        {result ? 'Analisis berhasil dilakukan oleh Random Forest.' : 'Masukkan parameter di samping untuk melihat hasil.'}
                                    </p>
                                </div>
                                {result && (
                                    <div className="text-right mr-10">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Confidence Score</p>
                                        <div className="border border-gray-300 px-4 py-2 bg-gray-50 rounded">
                                            <span className="text-2xl font-bold text-black">{result.confidence}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Rekomendasi */}
                            <div className="border border-gray-300 rounded p-5 bg-gray-50/50">
                                <div className="flex items-center gap-2 mb-3">
                                    <CheckCircle2 className="w-5 h-5 text-black" />
                                    <h3 className="text-sm font-bold text-black uppercase tracking-wider">Recommendation</h3>
                                </div>
                                <p className="text-md text-gray-700 leading-relaxed font-medium">
                                    {result ? result.recommendation : 'Rekomendasi tindakan akan muncul di sini setelah kalkulasi selesai dilakukan.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Kartu Faktor Pengaruh */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm p-8">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-6">
                            <h2 className="text-xl font-bold text-black">Feature Importances (Top 5)</h2>
                            <Activity className="w-5 h-5 text-gray-400" />
                        </div>
                        
                        <div className="space-y-6">
                            {result && result.factors.length > 0 ? result.factors.map((factor, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="text-sm font-bold text-gray-800">{factor.name}</span>
                                        <span className="text-xs font-bold text-gray-500">{factor.value}%</span>
                                    </div>
                                    <div className="w-full h-4 border border-gray-300 bg-gray-100 rounded-sm overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${factor.impact === 'High' ? 'bg-black' : factor.impact === 'Medium' ? 'bg-gray-600' : 'bg-gray-400'}`}
                                            style={{ width: `${factor.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )) : (
                                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                                    <Settings2 className="w-12 h-12 mb-3 opacity-20" />
                                    <p className="text-sm font-medium">Grafik faktor pengaruh belum tersedia.</p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

// Komponen Pembantu
const InputGroup = ({ label, name, value, onChange, placeholder }) => (
    <div>
        <label className="block text-xs font-bold text-gray-700 mb-1">{label}</label>
        <input 
            type="number" 
            step="any"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
            required
        />
    </div>
);

const ReadOnlyCard = ({ label, value }) => (
    <div className="bg-white border border-gray-200 rounded p-3 text-center">
        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{label}</label>
        <span className="text-lg font-bold text-black">{value}</span>
    </div>
);

export default Prediction;