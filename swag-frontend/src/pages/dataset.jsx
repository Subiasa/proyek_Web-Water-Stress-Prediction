import React, { useState, useEffect, useRef } from 'react';
import api from '../services/api';
import { 
    Plus, Search, Upload, Download, Filter, 
    RefreshCw, ChevronLeft, ChevronRight, Loader2, MoreHorizontal, X 
} from 'lucide-react';

const Dataset = () => {
    const [sensors, setSensors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // States for Modal
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        timestamp: '',
        temp_mean: '',
        rh_mean: '',
        pd1_mean: '',
        pd2_mean: '',
        spectral_mean: '',
        spectral_std: '',
        pla_difference: '',
        temp_rh_index: '',
        temp_range: '',
        rh_range: ''
    });

    const fileInputRef = useRef(null);

    const fetchSensors = async () => {
        setIsLoading(true);
        setError(''); 
        try {
            const response = await api.get('/sensors');
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

    useEffect(() => {
        fetchSensors();
    }, []);

    // --- FEATURE: EXPORT CSV ---
    const handleExportCSV = () => {
        if (sensors.length === 0) {
            alert("Tidak ada data untuk di-export.");
            return;
        }

        // Header CSV
        const headers = ["Timestamp", "Temp Mean", "RH Mean", "PD1 Mean", "PD2 Mean", "Spectral Mean", "Spectral Std", "PLA Diff", "Temp RH Index", "Temp Range", "RH Range", "Cluster", "Water Stress"];
        
        // Map data ke format array 2D
        const csvRows = [headers.join(",")];
        sensors.forEach(sensor => {
            const row = [
                sensor.timestamp,
                sensor.temp_mean,
                sensor.rh_mean,
                sensor.pd1_mean,
                sensor.pd2_mean,
                sensor.spectral_mean,
                sensor.spectral_std,
                sensor.pla_difference,
                sensor.temp_rh_index,
                sensor.temp_range,
                sensor.rh_range,
                sensor.cluster_id || '',
                sensor.water_stress || ''
            ];
            csvRows.push(row.join(","));
        });

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `sensor_dataset_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- FEATURE: IMPORT CSV ---
    const triggerFileInput = () => {
        fileInputRef.current.click();
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            const text = e.target.result;
            const rows = text.split('\n');
            if (rows.length < 2) return;

            setIsLoading(true);
            let successCount = 0;
            let errorCount = 0;

            // Simple CSV Parser (Asumsi header cocok dengan required params)
            // Format: timestamp,temp_mean,rh_mean,pd1_mean,pd2_mean,spectral_mean,spectral_std,pla_difference,temp_rh_index,temp_range,rh_range
            const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
            
            for (let i = 1; i < rows.length; i++) {
                if (!rows[i].trim()) continue;
                const cols = rows[i].split(',').map(c => c.trim());
                
                // Construct object
                const rowData = {};
                headers.forEach((header, index) => {
                    // Mapping standard header nama jika perlu
                    let key = header.replace(/ /g, '_');
                    if (cols[index] !== undefined && cols[index] !== '') {
                        rowData[key] = key === 'timestamp' ? cols[index] : parseFloat(cols[index]);
                    }
                });

                // Cek ketersediaan field wajib
                if (rowData.timestamp && !isNaN(rowData.temp_mean)) {
                    try {
                        await api.post('/sensors', rowData);
                        successCount++;
                    } catch (err) {
                        console.error(`Error baris ${i}:`, err);
                        errorCount++;
                    }
                }
            }

            alert(`Import selesai. Berhasil: ${successCount}, Gagal/Dilewati: ${errorCount}`);
            event.target.value = ''; // Reset input
            fetchSensors();
        };
        reader.readAsText(file);
    };

    // --- FEATURE: TAMBAH DATA (MODAL) ---
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/sensors', formData);
            setIsAddModalOpen(false);
            setFormData({
                timestamp: '', temp_mean: '', rh_mean: '', pd1_mean: '', pd2_mean: '',
                spectral_mean: '', spectral_std: '', pla_difference: '', temp_rh_index: '',
                temp_range: '', rh_range: ''
            });
            fetchSensors();
        } catch (err) {
            console.error(err);
            alert("Gagal menambahkan data. Periksa inputan Anda.");
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto font-sans relative">
            
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-black mb-2">Dataset<br/>Management</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage and analyze your agricultural sensor data.</p>
                </div>
                
                <div className="flex flex-col items-end gap-3">
                    <div className="flex gap-2">
                        {/* Hidden file input */}
                        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                        
                        <button onClick={triggerFileInput} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            <Upload className="w-4 h-4" />
                            Upload CSV
                        </button>
                        <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-black bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                            <Download className="w-4 h-4" />
                            Export CSV
                        </button>
                    </div>
                    <button onClick={() => setIsAddModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-black rounded w-full hover:bg-gray-800 transition-colors shadow-sm">
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

            <div className="bg-white border border-gray-300 rounded-sm shadow-sm flex flex-col">
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
                        <span className="text-xs text-gray-500 font-medium">Total: {sensors.length} records</span>
                        <button 
                            onClick={fetchSensors}
                            className="flex items-center gap-2 px-3 py-1.5 border border-gray-300 rounded bg-white hover:bg-gray-50 text-xs font-semibold text-black transition-colors"
                        >
                            <RefreshCw className="w-3.5 h-3.5" />
                            Refresh
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-white text-xs font-bold text-black border-b border-gray-300">
                            <tr>
                                <th className="px-5 py-4">Timestamp</th>
                                <th className="px-5 py-4">Temp Mean</th>
                                <th className="px-5 py-4">RH Mean</th>
                                <th className="px-5 py-4">PD1 Mean</th>
                                <th className="px-5 py-4">PD2 Mean</th>
                                <th className="px-5 py-4">Spectral Mean</th>
                                <th className="px-5 py-4">PLA Diff</th>
                                <th className="px-5 py-4">Cluster</th>
                                <th className="px-5 py-4">Stress Label</th>
                                <th className="px-5 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 text-gray-700">
                            {sensors.length === 0 ? (
                                <tr>
                                    <td colSpan="10" className="px-6 py-12 text-center text-gray-500 font-medium">
                                        Data sensor kosong. Silakan tambah data baru atau import via CSV.
                                    </td>
                                </tr>
                            ) : (
                                sensors.map((sensor) => (
                                    <tr key={sensor.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 font-medium">{sensor.timestamp}</td>
                                        <td className="px-5 py-4">{sensor.temp_mean}</td>
                                        <td className="px-5 py-4">{sensor.rh_mean}</td>
                                        <td className="px-5 py-4">{sensor.pd1_mean}</td>
                                        <td className="px-5 py-4">{sensor.pd2_mean}</td>
                                        <td className="px-5 py-4">{sensor.spectral_mean}</td>
                                        <td className="px-5 py-4">{sensor.pla_difference}</td>
                                        <td className="px-5 py-4">
                                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">{sensor.cluster_id ? `Cluster ${sensor.cluster_id}` : '-'}</span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${sensor.water_stress === '1' || sensor.water_stress === 'Potential Water Stress' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {sensor.water_stress || 'Unclassified'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
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
            </div>

            {/* MODAL TAMBAH DATA */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded shadow-lg flex flex-col max-h-[90vh]">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <h2 className="text-xl font-bold text-black">Tambah Data Sensor</h2>
                            <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        {/* Modal Body */}
                        <div className="p-5 overflow-y-auto">
                            <form id="addSensorForm" onSubmit={handleAddSubmit} className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-semibold text-black mb-1">Timestamp</label>
                                    <input required type="datetime-local" name="timestamp" value={formData.timestamp} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-black focus:border-black text-sm" />
                                </div>
                                
                                {['temp_mean', 'rh_mean', 'pd1_mean', 'pd2_mean', 'spectral_mean', 'spectral_std', 'pla_difference', 'temp_rh_index', 'temp_range', 'rh_range'].map(field => (
                                    <div key={field}>
                                        <label className="block text-sm font-semibold text-black mb-1 capitalize">{field.replace(/_/g, ' ')}</label>
                                        <input 
                                            required 
                                            type="number" 
                                            step="any"
                                            name={field} 
                                            value={formData[field]} 
                                            onChange={handleInputChange} 
                                            placeholder="0.0"
                                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-black focus:border-black text-sm" 
                                        />
                                    </div>
                                ))}
                            </form>
                        </div>

                        {/* Modal Footer */}
                        <div className="p-5 border-t border-gray-200 flex justify-end gap-3 bg-gray-50">
                            <button onClick={() => setIsAddModalOpen(false)} type="button" className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-100">
                                Batal
                            </button>
                            <button form="addSensorForm" disabled={isSubmitting} type="submit" className="px-4 py-2 text-sm font-semibold text-white bg-black rounded hover:bg-gray-800 flex items-center gap-2">
                                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                Simpan Data
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default Dataset;