import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { 
    Plus, Search, Upload, Download, Filter, 
    RefreshCw, ChevronLeft, ChevronRight, Loader2, MoreHorizontal 
} from 'lucide-react';

const Dataset = () => {
    // 1. INISIALISASI STATE (Wajib berada di paling atas dalam komponen)
    // Pastikan useState diberi nilai awal array kosong []
    const [sensors, setSensors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    // 2. FUNGSI FETCH (Wajib memiliki const dan berada di DALAM komponen Dataset)
    const fetchSensors = async () => {
        setIsLoading(true);
        setError(''); 
        try {
            const response = await api.get('/sensors');
            
            console.log("Struktur Asli dari Laravel:", response.data); 

            let actualData = response.data;
            if (response.data && response.data.data) {
                if (Array.isArray(response.data.data.data)) {
                    actualData = response.data.data.data; 
                } else {
                    actualData = response.data.data; 
                }
            }

            if (Array.isArray(actualData)) {
                setSensors(actualData);
            } else {
                console.error("Format data tidak dikenali:", actualData);
                setSensors([]); 
                setError('Format data dari server tidak sesuai standar.');
            }

        } catch (err) {
            console.error("Error fetching datasets:", err);
            setError('Gagal memuat data dataset. Pastikan server berjalan.');
            setSensors([]); 
        } finally {
            setIsLoading(false);
        }
    };

    // 3. USE EFFECT (Wajib di bawah deklarasi fetchSensors)
    useEffect(() => {
        fetchSensors();
    }, []); // Array kosong berarti hanya dijalankan sekali saat halaman dimuat

    // 4. KONDISI LOADING
    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto font-sans">
            
            {/* 1. Header Section (Sesuai Wireframe) */}
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-black mb-2">Dataset<br/>Management</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage and analyze your agricultural sensor data.</p>
                </div>
                
                {/* Action Buttons Group */}
                <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            <Upload className="w-4 h-4" />
                            Upload CSV
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-black rounded w-full hover:bg-gray-800 transition-colors shadow-sm">
                        <Plus className="w-4 h-4" />
                        Tambah Data
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 font-medium">
                    {error}
                </div>
            )}

            {/* 2. Main Table Container */}
            <div className="bg-white border border-gray-300 rounded-sm shadow-sm flex flex-col">
                
                {/* Control Bar (Search, Filter, Refresh) */}
                <div className="flex justify-between items-center p-3 border-b border-gray-300 bg-gray-50/50">
                    <div className="flex gap-2">
                        <div className="relative">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search records..." 
                                className="w-64 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
                            />
                        </div>
                        <button className="p-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 text-gray-600">
                            <Filter className="w-4 h-4" />
                        </button>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500 font-medium">Showing 1-10 of 2,450 records</span>
                        <button 
                            onClick={fetchSensors}
                            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 text-xs font-semibold text-black transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Table Data */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-xs font-bold text-black border-b border-gray-300">
                            <tr>
                                <th className="px-5 py-4">Timestamp</th>
                                <th className="px-5 py-4">Temperature (°C)</th>
                                <th className="px-5 py-4">Humidity (%)</th>
                                <th className="px-5 py-4">SWC (%)</th>
                                <th className="px-5 py-4">PAR (µmol)</th>
                                <th className="px-5 py-4">Leaf Thickness (mm)</th>
                                <th className="px-5 py-4">Leaf Length (mm)</th>
                                <th className="px-5 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {sensors.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500 font-medium">
                                        Data sensor kosong. Silakan tambah data baru.
                                    </td>
                                </tr>
                            ) : (
                                sensors.map((sensor) => (
                                    <tr key={sensor.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 font-medium">{sensor.timestamp}</td>
                                        <td className="px-5 py-4">{sensor.temperature}</td>
                                        <td className="px-5 py-4">{sensor.humidity}</td>
                                        <td className="px-5 py-4">{sensor.soil_water_content}</td>
                                        <td className="px-5 py-4">{sensor.par}</td>
                                        <td className="px-5 py-4">{sensor.leaf_thickness}</td>
                                        <td className="px-5 py-4">{sensor.leaf_length}</td>
                                        <td className="px-5 py-4 text-center">
                                            {/* Tombol aksi standar industri untuk menghemat ruang kolom */}
                                            <button className="text-gray-400 hover:text-black transition-colors">
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* 3. Footer / Pagination (Sesuai Wireframe) */}
                <div className="flex justify-between items-center p-4 border-t border-gray-300 bg-gray-50/50">
                    <div className="text-xs text-gray-500 font-medium">
                        Rows per page: 10
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <button className="p-1 text-gray-400 hover:text-black disabled:opacity-30"><ChevronLeft className="w-4 h-4"/></button>
                        <button className="w-7 h-7 flex items-center justify-center rounded bg-black text-white font-bold">1</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50 font-medium">2</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50 font-medium">3</button>
                        <span className="px-1 text-gray-400">...</span>
                        <button className="w-8 h-7 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50 font-medium">245</button>
                        <button className="p-1 text-gray-400 hover:text-black"><ChevronRight className="w-4 h-4"/></button>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dataset;