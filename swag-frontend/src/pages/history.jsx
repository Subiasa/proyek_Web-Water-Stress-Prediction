import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, Filter, Download, Loader2 } from 'lucide-react';

const History = () => {
    const [histories, setHistories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchHistory = async () => {
        setIsLoading(true);
        setError('');
        try {
            // Menembak endpoint History dari Laravel
            const response = await api.get('/history');
            
            // Log untuk keperluan debugging
            console.log("Struktur Asli History dari Laravel:", response.data);

            // Sistem pertahanan: Mencari letak Array data yang sesungguhnya
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
                console.error("Format data history tidak dikenali:", actualData);
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

    // Format tanggal standar
    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const date = new Date(dateString);
        // Format menyerupai wireframe: YYYY-MM-DD HH:MM
        return date.toISOString().slice(0, 16).replace('T', ' ');
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto font-sans">
            
            {/* Header & Top Bar (Sesuai Wireframe) */}
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
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-white bg-black rounded hover:bg-gray-800 transition-colors">
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

            {/* Table Container */}
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 text-gray-700">
                            {histories.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-medium">
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
                                            {/* Data statis sementara, bisa diganti jika database menyimpan jenis model */}
                                            Water Req. Net
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">
                                            Sensor_ID_{history.sensor_data_id}
                                        </td>
                                        <td className="px-5 py-4">
                                            {/* Dummy confidence, sesuaikan dengan API jika ML sudah berjalan */}
                                            91%
                                        </td>
                                        <td className="px-5 py-4">
                                            {/* Indikator visual berdasarkan status */}
                                            <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded ${
                                                history.prediction_result ? 'border-gray-300 text-gray-700 bg-white' : 'border-red-200 text-red-700 bg-red-50'
                                            }`}>
                                                {history.prediction_result ? 'Complete' : 'Failed'}
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer & Pagination (Sesuai Wireframe) */}
                <div className="flex justify-between items-center p-4 border-t border-gray-300 bg-gray-50/50">
                    <div className="text-xs text-gray-500 font-medium">
                        Showing 1 to {histories.length || 0} of {histories.length || 0} entries
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                        <button className="px-3 py-1.5 text-gray-400 border border-transparent hover:border-gray-300 rounded font-medium disabled:opacity-50" disabled>
                            Prev
                        </button>
                        <button className="w-7 h-7 flex items-center justify-center rounded bg-black text-white font-bold">1</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50 font-medium">2</button>
                        <button className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 bg-white hover:bg-gray-50 font-medium">3</button>
                        <button className="px-3 py-1.5 text-black border border-gray-300 bg-white rounded font-medium hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default History;