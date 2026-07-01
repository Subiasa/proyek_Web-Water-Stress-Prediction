import React, { useState } from 'react';
import api from '../services/api';
import { 
    Activity, AlertTriangle, Droplets, Thermometer, 
    CloudRain, Sun, Settings2, RotateCcw, CheckCircle2, History 
} from 'lucide-react';

const Prediction = () => {
    // 1. State Manajemen Form Input
    const [formData, setFormData] = useState({
        soilMoisture: '',
        temperature: '',
        humidity: '',
        rainfall: '',
        solarRad: ''
    });

    // 2. State Manajemen Hasil & Status
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');

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
            soilMoisture: '',
            temperature: '',
            humidity: '',
            rainfall: '',
            solarRad: ''
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
            // Catatan Integrasi:
            // Sesuai wireframe, pengguna memasukkan data mentah untuk simulasi.
            // Anda mungkin perlu menyesuaikan PredictionController di Laravel agar 
            // bisa menerima data mentah ini selain menerima 'sensor_data_id'.
            const payload = {
                soil_moisture: parseFloat(formData.soilMoisture),
                temperature: parseFloat(formData.temperature),
                humidity: parseFloat(formData.humidity),
                rainfall: parseFloat(formData.rainfall),
                solar_rad: parseFloat(formData.solarRad)
            };

            const response = await api.post('/predict', payload);
            
            // Simulasi pemetaan hasil (Sesuaikan dengan struktur response ML Anda nanti)
            setResult({
                status: response.data.prediction_result || 'High Stress',
                confidence: '92.4%', // Dummy untuk saat ini
                recommendation: 'Initiate localized drip irrigation protocols in Sectors A and B. Increase monitoring frequency of soil moisture sensors to 1-hour intervals for the next 24 hours.',
                factors: [
                    { name: 'Soil Moisture Deficit', impact: 'High', value: 85 },
                    { name: 'Temperature Anomaly', impact: 'Medium', value: 45 },
                    { name: 'Vapor Pressure Deficit (VPD)', impact: 'Low', value: 20 }
                ]
            });

        } catch (err) {
            console.error("Prediction error:", err);
            setError('Gagal memproses prediksi. Pastikan server merespons.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-8 max-w-[1400px] mx-auto font-sans text-gray-900">
            {/* Header */}
            <div className="mb-8 border-b border-gray-300 pb-4">
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">Water Stress Prediction</h1>
                <p className="text-sm text-gray-500 font-medium">Enter environmental sensor metrics to forecast drought conditions and stress levels.</p>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* KOLOM KIRI: Form Input */}
                <div className="bg-white border border-gray-300 rounded shadow-sm p-6 h-fit">
                    <div className="flex items-center gap-2 border-b border-gray-200 pb-4 mb-5">
                        <Activity className="w-5 h-5 text-black" />
                        <h2 className="text-lg font-bold">Sensor Data Input</h2>
                    </div>

                    <form onSubmit={handlePredict} className="space-y-4">
                        <InputGroup 
                            label="Soil Moisture (%)" 
                            name="soilMoisture" 
                            icon={Droplets} 
                            value={formData.soilMoisture} 
                            onChange={handleChange} 
                            placeholder="e.g. 45.5" 
                        />
                        <InputGroup 
                            label="Air Temperature (°C)" 
                            name="temperature" 
                            icon={Thermometer} 
                            value={formData.temperature} 
                            onChange={handleChange} 
                            placeholder="e.g. 32.1" 
                        />
                        <InputGroup 
                            label="Relative Humidity (%)" 
                            name="humidity" 
                            icon={Activity} 
                            value={formData.humidity} 
                            onChange={handleChange} 
                            placeholder="e.g. 60.0" 
                        />
                        
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup 
                                label="Rainfall (mm)" 
                                name="rainfall" 
                                icon={CloudRain} 
                                value={formData.rainfall} 
                                onChange={handleChange} 
                                placeholder="0.0" 
                            />
                            <InputGroup 
                                label="Solar Rad (W/m²)" 
                                name="solarRad" 
                                icon={Sun} 
                                value={formData.solarRad} 
                                onChange={handleChange} 
                                placeholder="450" 
                            />
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-200 mt-6">
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="flex-1 bg-black text-white font-semibold py-2.5 rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex justify-center items-center gap-2 text-sm"
                            >
                                {isLoading ? 'Processing...' : 'Prediksi'}
                            </button>
                            <button 
                                type="button" 
                                onClick={handleReset}
                                className="px-5 py-2.5 bg-white border border-gray-300 text-black font-semibold rounded hover:bg-gray-50 transition-colors text-sm"
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
                        {/* Aksen sudut atas (seperti di wireframe) */}
                        <div className="absolute top-0 right-0 w-12 h-12 border-l border-b border-gray-300 bg-gray-50"></div>
                        
                        <div className="p-6">
                            <div className="flex justify-between items-start border-b border-gray-200 pb-4 mb-4">
                                <div>
                                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Prediction Output</p>
                                    {result ? (
                                        <h2 className="text-5xl font-extrabold text-black tracking-tight">{result.status}</h2>
                                    ) : (
                                        <h2 className="text-3xl font-bold text-gray-300 tracking-tight">Menunggu Input...</h2>
                                    )}
                                    <p className="text-sm text-gray-500 mt-2">
                                        {result ? 'Irrigation intervention required immediately.' : 'Masukkan parameter di samping untuk melihat hasil.'}
                                    </p>
                                </div>
                                {result && (
                                    <div className="text-right mr-10">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Confidence Score</p>
                                        <div className="border border-gray-300 px-3 py-1 bg-gray-50">
                                            <span className="text-xl font-bold text-black">{result.confidence}</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Rekomendasi */}
                            <div className="border border-gray-300 rounded p-4 bg-gray-50/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <CheckCircle2 className="w-4 h-4 text-black" />
                                    <h3 className="text-xs font-bold text-black uppercase tracking-wider">Recommendation</h3>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                    {result ? result.recommendation : 'Rekomendasi tindakan akan muncul di sini setelah kalkulasi selesai dilakukan.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Kartu Faktor Pengaruh */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
                        <div className="flex items-center justify-between border-b border-gray-200 pb-4 mb-5">
                            <h2 className="text-lg font-bold text-black">Influencing Factors</h2>
                            <Settings2 className="w-5 h-5 text-gray-400" />
                        </div>
                        
                        <div className="space-y-5">
                            {result ? result.factors.map((factor, idx) => (
                                <div key={idx}>
                                    <div className="flex justify-between items-end mb-1">
                                        <span className="text-sm font-semibold text-gray-700">{factor.name}</span>
                                        <span className="text-xs font-bold text-black">{factor.impact} Impact</span>
                                    </div>
                                    <div className="w-full h-3 border border-gray-300 bg-gray-100 rounded-sm overflow-hidden">
                                        <div 
                                            className={`h-full ${factor.impact === 'High' ? 'bg-black' : factor.impact === 'Medium' ? 'bg-gray-400' : 'bg-gray-200'}`}
                                            style={{ width: `${factor.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-sm text-gray-500 text-center py-4">Grafik faktor pengaruh belum tersedia.</p>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* TABEL BAWAH: Recent Predictions (Ringkasan) */}
            <div className="bg-white border border-gray-300 rounded shadow-sm">
                <div className="flex justify-between items-center p-4 border-b border-gray-300 bg-gray-50/50">
                    <div className="flex items-center gap-2">
                        <History className="w-5 h-5 text-black" />
                        <h2 className="text-md font-bold text-black">Recent Predictions</h2>
                    </div>
                    <button className="px-3 py-1.5 border border-gray-300 bg-white text-xs font-bold rounded hover:bg-gray-50 transition-colors">
                        View Full Log
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-xs font-bold text-black border-b border-gray-300">
                            <tr>
                                <th className="px-5 py-3">Timestamp</th>
                                <th className="px-5 py-3">Sector ID</th>
                                <th className="px-5 py-3">Prediction Label</th>
                                <th className="px-5 py-3">Confidence</th>
                                <th className="px-5 py-3">Action Taken</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {/* Dummy Data sesuai Wireframe */}
                            <tr className="hover:bg-gray-50">
                                <td className="px-5 py-3">2024-05-20 14:30:00</td>
                                <td className="px-5 py-3">SEC-004</td>
                                <td className="px-5 py-3 font-bold text-black">High Stress</td>
                                <td className="px-5 py-3">92.4%</td>
                                <td className="px-5 py-3"><span className="border border-gray-300 px-2 py-1 text-xs bg-white">Irrigation Started</span></td>
                            </tr>
                            <tr className="bg-gray-50/50 hover:bg-gray-50">
                                <td className="px-5 py-3">2024-05-20 13:00:00</td>
                                <td className="px-5 py-3">SEC-002</td>
                                <td className="px-5 py-3 text-gray-500">Normal</td>
                                <td className="px-5 py-3">98.1%</td>
                                <td className="px-5 py-3 text-gray-400">-</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

// Komponen Pembantu untuk Input Form agar kode rapi
const InputGroup = ({ label, name, icon: Icon, value, onChange, placeholder }) => (
    <div>
        <label className="block text-xs font-bold text-gray-800 mb-1">{label}</label>
        <div className="relative">
            <input 
                type="number" 
                step="any"
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                required
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
                <Icon className="w-4 h-4" />
            </div>
        </div>
    </div>
);

export default Prediction;