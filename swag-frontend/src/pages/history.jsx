import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Filter, Download, Loader2, Eye, X } from 'lucide-react';

const History = () => {
    const [histories, setHistories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    
    // State for Detail Modal
    const [selectedHistory, setSelectedHistory] = useState(null);

    const fetchHistory = async () => {
        setIsLoading(true);
        setError('');
        try {
            const response = await api.get('/history');
            let actualData = response.data;
            if (response.data && response.data.data) {
                if (Array.isArray(response.data.data.data)) {
                    actualData = response.data.data.data;
                } else {
                    actualData = response.data.data;
                }
            }

            if (Array.isArray(actualData)) {
                setHistories(actualData);
            } else {
                setHistories([]);
                setError('Format data dari server tidak sesuai standar tabel.');
            }
        } catch (err) {
            console.error("Error fetching history:", err);
            setError('Gagal memuat riwayat prediksi. Pastikan server terhubung.');
            setHistories([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16).replace('T', ' ');
    };

    const handleExportCSV = () => {
        if (histories.length === 0) {
            alert("Tidak ada riwayat untuk di-export.");
            return;
        }

        const headers = ["ID", "Date/Time", "Model Type", "Confidence", "Result/Status", "Temp Mean", "RH Mean", "PD1 Mean", "PD2 Mean", "Spectral Mean"];
        const csvRows = [headers.join(",")];
        
        histories.forEach(h => {
            const sd = h.sensor_data || {};
            const row = [
                `PRD-${h.id}`,
                formatDate(h.created_at),
                h.model_type || '-',
                h.confidence ? `${h.confidence}%` : '-',
                h.prediction || 'Failed',
                sd.temp_mean || '-',
                sd.rh_mean || '-',
                sd.pd1_mean || '-',
                sd.pd2_mean || '-',
                sd.spectral_mean || '-'
            ];
            csvRows.push(row.join(","));
        });

        const csvContent = csvRows.join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `prediction_history_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-gray-200 pb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-black mb-1">Prediction History</h1>
                    <p className="text-sm text-gray-500 font-medium">Review past model inferences and dataset evaluations.</p>
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search history..." 
                            className="w-64 pl-9 pr-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-black focus:ring-1 focus:ring-black bg-white"
                        />
                    </div>
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button onClick={handleExportCSV} className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-black rounded hover:bg-gray-800 transition-colors">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded border border-red-200 font-medium">
                    {error}
                </div>
            )}

            <div className="bg-white border border-gray-300 rounded shadow-sm flex flex-col">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50/80 text-xs font-bold text-black border-b border-gray-300">
                            <tr>
                                <th className="px-5 py-4 w-12 text-center">
                                    <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                                </th>
                                <th className="px-5 py-4">ID</th>
                                <th className="px-5 py-4">Date / Time</th>
                                <th className="px-5 py-4">Model Type</th>
                                <th className="px-5 py-4">Input Dataset</th>
                                <th className="px-5 py-4">Confidence</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-center">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-700">
                            {histories.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-gray-500 font-medium">
                                        Belum ada riwayat prediksi. Lakukan kalkulasi di menu Prediction terlebih dahulu.
                                    </td>
                                </tr>
                            ) : (
                                histories.map((history) => (
                                    <tr key={history.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-5 py-4 text-center">
                                            <input type="checkbox" className="rounded border-gray-300 text-black focus:ring-black cursor-pointer" />
                                        </td>
                                        <td className="px-5 py-4 font-medium text-black">
                                            PRD-{history.id.toString().padStart(3, '0')}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            {formatDate(history.created_at)}
                                        </td>
                                        <td className="px-5 py-4">
                                            {history.model_type || '-'}
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            Sensor_ID_{history.sensor_data_id}
                                        </td>
                                        <td className="px-5 py-4">
                                            {history.confidence ? `${history.confidence}%` : '-'}
                                        </td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded ${
                                                history.prediction ? 'border-gray-300 text-gray-700 bg-white' : 'border-red-200 text-red-700 bg-red-50'
                                            }`}>
                                                {history.prediction ? 'Complete' : 'Failed'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-center">
                                            <button 
                                                onClick={() => setSelectedHistory(history)} 
                                                className="text-gray-400 hover:text-black transition-colors"
                                                title="Lihat Detail"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center p-4 border-t border-gray-300 bg-gray-50/50">
                    <div className="text-xs text-gray-500 font-medium">
                        Showing 1 to {histories.length || 0} of {histories.length || 0} entries
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <button className="px-3 py-1.5 text-gray-400 border border-transparent hover:border-gray-300 rounded font-medium disabled:opacity-50" disabled>
                            Prev
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded bg-black text-white font-bold">1</button>
                        <button className="px-3 py-1.5 text-black border border-gray-300 bg-white rounded font-medium hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* MODAL DETAIL HISTORY */}
            {selectedHistory && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded shadow-lg flex flex-col max-h-[90vh]">
                        <div className="flex justify-between items-center p-5 border-b border-gray-200">
                            <div>
                                <h2 className="text-xl font-bold text-black">Detail Prediksi PRD-{selectedHistory.id.toString().padStart(3, '0')}</h2>
                                <p className="text-sm text-gray-500 mt-1">{formatDate(selectedHistory.created_at)}</p>
                            </div>
                            <button onClick={() => setSelectedHistory(null)} className="text-gray-400 hover:text-black">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        
                        <div className="p-5 overflow-y-auto">
                            <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded">
                                <h3 className="text-sm font-bold text-black mb-3">Hasil Klasifikasi</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-gray-500">Label Prediksi</p>
                                        <p className="font-semibold text-black">{selectedHistory.prediction || '-'}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500">Tingkat Keyakinan (Confidence)</p>
                                        <p className="font-semibold text-black">{selectedHistory.confidence ? `${selectedHistory.confidence}%` : '-'}</p>
                                    </div>
                                </div>
                            </div>

                            <h3 className="text-sm font-bold text-black mb-3">Parameter Input Sensor</h3>
                            {selectedHistory.sensor_data ? (
                                <div className="grid grid-cols-2 gap-y-4 gap-x-8">
                                    {['temp_mean', 'rh_mean', 'pd1_mean', 'pd2_mean', 'spectral_mean', 'spectral_std', 'pla_difference', 'temp_rh_index', 'temp_range', 'rh_range'].map(field => (
                                        <div key={field} className="flex justify-between border-b border-gray-100 pb-1">
                                            <span className="text-sm text-gray-500 capitalize">{field.replace(/_/g, ' ')}</span>
                                            <span className="text-sm font-medium text-black">{selectedHistory.sensor_data[field]}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-red-500 italic">Data sensor tidak ditemukan atau sudah dihapus.</p>
                            )}
                        </div>

                        <div className="p-5 border-t border-gray-200 flex justify-end bg-gray-50">
                            <button onClick={() => setSelectedHistory(null)} className="px-4 py-2 text-sm font-semibold text-white bg-black rounded hover:bg-gray-800">
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default History;