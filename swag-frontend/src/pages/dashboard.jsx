import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Database, Activity, GitCommit, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';

const Dashboard = () => {
    // 1. State Inisialisasi: Struktur default kosong agar UI tidak crash saat loading
    const [dashboardData, setDashboardData] = useState({
        summary: { total_data: 0, total_predictions: 0, total_clusters: 0, accuracy: '0%' },
        trendData: [],
        distributionData: [],
        recentActivity: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const currentDate = new Date().toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric'
    });
    const currentTime = new Date().toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit'
    });

    // 2. Data Fetching (Integrasi API Nyata)
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true);
                // Endpoint Laravel yang akan menyuplai semua data ini
                const response = await api.get('/dashboard'); 
                
                // Pastikan merujuk ke object data yang benar (menyesuaikan format response Laravel)
                const data = response.data.data || response.data;

                // Memetakan data dari database ke state komponen
                setDashboardData({
                    summary: {
                        total_data: data.summary?.total_data || 0,
                        total_predictions: data.summary?.total_predictions || 0,
                        total_clusters: data.summary?.total_clusters || 0,
                        accuracy: data.summary?.accuracy || '0%'
                    },
                    trendData: data.trendData || [],
                    distributionData: data.distributionData || [],
                    recentActivity: data.recentActivity || []
                });
                setError(null);
            } catch (err) {
                console.error("Gagal mengambil data dashboard:", err);
                setError("Koneksi ke server terputus. Gagal memuat data terbaru.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const COLORS = ['#111827', '#E5E7EB']; 

    // 3. Penanganan State Loading
    if (isLoading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-black mb-4" />
                <p className="text-sm font-medium text-gray-500">Menyinkronkan data analitik...</p>
            </div>
        );
    }

    // 4. Penanganan State Error (Jika Laravel mati)
    if (error) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-gray-50">
                <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-gray-900 mb-2">Gagal Memuat Dashboard</h2>
                <p className="text-sm text-gray-500">{error}</p>
            </div>
        );
    }

    // 5. Render UI Utama (Sama persis dengan desain Anda)
    return (
        <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans bg-gray-50 min-h-screen">
            
            <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-1 text-black">Halo, Selamat Datang</h2>
                    <p className="text-gray-500 text-sm font-medium">Here is your system overview for today.</p>
                </div>
                <div className="text-right">
                    <p className="font-bold text-sm text-black">{currentDate}</p>
                    <p className="text-xs text-gray-500">{currentTime}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Dataset" value={(dashboardData.summary.total_data).toLocaleString()} icon={Database} />
                <StatCard title="Total Prediction" value={(dashboardData.summary.total_predictions).toLocaleString()} icon={Activity} />
                <StatCard title="Total Cluster" value={dashboardData.summary.total_clusters} icon={GitCommit} />
                <StatCard title="Accuracy" value={dashboardData.summary.accuracy} icon={CheckCircle} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-80">
                <div className="lg:col-span-2 bg-white border border-gray-300 rounded shadow-sm p-5 flex flex-col">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
                        <h3 className="font-bold text-sm text-black">Environmental Trends</h3>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 text-[10px] font-bold border border-black text-black rounded-sm">Temp</span>
                            <span className="px-2 py-1 text-[10px] font-bold border border-gray-300 text-gray-500 rounded-sm">Hum</span>
                            <span className="px-2 py-1 text-[10px] font-bold border border-gray-300 text-gray-500 rounded-sm">SWC</span>
                        </div>
                    </div>
                    <div className="flex-1">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dashboardData.trendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="time" tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <YAxis tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <Tooltip cursor={{stroke: '#E5E7EB', strokeWidth: 2}} />
                                <Line type="monotone" dataKey="temp" stroke="#111827" strokeWidth={2} dot={{r: 3, fill: '#111827'}} activeDot={{r: 5}} />
                                <Line type="monotone" dataKey="hum" stroke="#9CA3AF" strokeWidth={2} dot={{r: 0}} />
                                <Line type="monotone" dataKey="swc" stroke="#D1D5DB" strokeWidth={2} dot={{r: 0}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white border border-gray-300 rounded shadow-sm p-5 flex flex-col">
                    <h3 className="font-bold text-sm text-black border-b border-gray-200 pb-2 mb-4">Distributions</h3>
                    <div className="flex-1 relative flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dashboardData.distributionData}
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {dashboardData.distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Menampilkan Persentase Terbesar Secara Otomatis */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <span className="text-2xl font-extrabold text-black">
                                {dashboardData.distributionData.length > 0 
                                    ? `${Math.max(...dashboardData.distributionData.map(d => d.value))}%` 
                                    : '0%'}
                            </span>
                        </div>
                    </div>
                    <div className="mt-2 text-xs font-medium text-gray-500 flex flex-col gap-1">
                        {dashboardData.distributionData.map((entry, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div> 
                                {entry.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
                <div className="lg:col-span-2 bg-white border border-gray-300 rounded shadow-sm flex flex-col">
                    <div className="flex justify-between items-center p-4 border-b border-gray-200">
                        <h3 className="font-bold text-sm text-black">Recent Activity</h3>
                        <a href="#" className="text-xs font-semibold text-gray-500 hover:text-black hover:underline">View All</a>
                    </div>
                    <div className="overflow-x-auto flex-1 p-4">
                        <table className="w-full text-left text-sm whitespace-nowrap">
                            <thead className="text-xs font-bold text-gray-500 border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="py-3 px-2 font-semibold">ID</th>
                                    <th className="py-3 px-2 font-semibold">Action</th>
                                    <th className="py-3 px-2 font-semibold">User</th>
                                    <th className="py-3 px-2 font-semibold">Time</th>
                                    <th className="py-3 px-2 font-semibold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 text-gray-700">
                                {dashboardData.recentActivity.length > 0 ? (
                                    dashboardData.recentActivity.map((act, i) => (
                                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                                            <td className="py-3 px-2 font-medium text-gray-500">{act.id}</td>
                                            <td className="py-3 px-2 text-black font-semibold">{act.action}</td>
                                            <td className="py-3 px-2">{act.user}</td>
                                            <td className="py-3 px-2 text-gray-400 text-xs">{act.time}</td>
                                            <td className="py-3 px-2 text-right">
                                                <span className={`border px-2 py-1 text-xs rounded-sm font-medium ${
                                                    act.status === 'Success' ? 'bg-green-50 border-green-200 text-green-700' : 
                                                    act.status === 'Processing' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                                    'bg-red-50 border-red-200 text-red-700'
                                                }`}>
                                                    {act.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="py-6 text-center text-gray-400 font-medium">Belum ada aktivitas terbaru</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white border border-gray-300 rounded shadow-sm p-5 h-fit">
                    <h3 className="font-bold text-sm text-black border-b border-gray-200 pb-3 mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full bg-black text-white font-semibold py-2.5 rounded text-sm hover:bg-gray-800 transition-colors shadow-sm">
                            Run New Prediction
                        </button>
                        <button className="w-full bg-white text-black border border-gray-300 font-semibold py-2.5 rounded text-sm hover:bg-gray-50 transition-colors">
                            Upload Dataset
                        </button>
                        <button className="w-full bg-white text-black border border-gray-300 font-semibold py-2.5 rounded text-sm hover:bg-gray-50 transition-colors">
                            Generate Report
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ title, value, icon: Icon }) => (
    <div className="bg-white border border-gray-300 rounded p-5 flex flex-col justify-between h-28 shadow-sm hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
            <Icon className="w-4 h-4 text-gray-400" />
        </div>
        <p className="text-3xl font-extrabold text-black tracking-tight">{value}</p>
    </div>
);

export default Dashboard;


// import React, { useState, useEffect } from 'react';
// import api from '../services/api';
// import { Database, Activity, GitCommit, CheckCircle, Loader2 } from 'lucide-react';
// import { 
//     LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
//     PieChart, Pie, Cell
// } from 'recharts';

// const Dashboard = () => {
//     const [dashboardData, setDashboardData] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     const currentDate = new Date().toLocaleDateString('en-US', {
//         month: 'long', day: 'numeric', year: 'numeric'
//     });
//     const currentTime = new Date().toLocaleTimeString('en-US', {
//         hour: '2-digit', minute: '2-digit'
//     });

//     // 1. Pindahkan Data Dummy ke luar agar bisa dipanggil saat API belum sesuai struktur
//     const fallbackData = {
//         summary: { total_data: 12450, total_predictions: 8920, total_clusters: 24, accuracy: '98.4%' },
//         trendData: [
//             { time: '08:00', temp: 24, hum: 65, swc: 32 },
//             { time: '10:00', temp: 26, hum: 60, swc: 30 },
//             { time: '12:00', temp: 29, hum: 55, swc: 28 },
//             { time: '14:00', temp: 31, hum: 50, swc: 25 },
//             { time: '16:00', temp: 28, hum: 58, swc: 27 }
//         ],
//         distributionData: [
//             { name: 'Cluster A', value: 42 },
//             { name: 'Cluster B', value: 58 }
//         ],
//         recentActivity: [
//             { id: '#1024', action: 'Dataset Upload', user: 'Admin', time: '10 mins ago', status: 'Success' },
//             { id: '#1023', action: 'Model Training', user: 'System', time: '1 hour ago', status: 'Processing' },
//             { id: '#1022', action: 'User Login', user: 'Analyst_01', time: '2 hours ago', status: 'Success' }
//         ]
//     };

//     useEffect(() => {
//         const fetchDashboardData = async () => {
//             try {
//                 const response = await api.get('/dashboard');
                
//                 // 2. SISTEM PERTAHANAN: Cek apakah struktur API sudah sesuai desain kita
//                 if (response.data && response.data.summary) {
//                     setDashboardData(response.data);
//                 } else {
//                     console.warn("API terhubung, tapi struktur data belum memiliki objek 'summary'. Beralih ke data simulasi UI.");
//                     setDashboardData(fallbackData);
//                 }
//             } catch (error) {
//                 console.error("Gagal mengambil data dashboard (Server Error/Network):", error);
//                 setDashboardData(fallbackData);
//             } finally {
//                 setIsLoading(false);
//             }
//         };

//         fetchDashboardData();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//     }, []);

//     const COLORS = ['#111827', '#E5E7EB']; 

//     if (isLoading || !dashboardData) {
//         return (
//             <div className="h-full flex items-center justify-center">
//                 <Loader2 className="w-8 h-8 animate-spin text-black" />
//             </div>
//         );
//     }

//     return (
//         <div className="p-8 max-w-7xl mx-auto space-y-6 font-sans bg-gray-50 min-h-screen">
            
//             <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
//                 <div>
//                     <h2 className="text-3xl font-bold tracking-tight mb-1 text-black">Halo, Selamat Datang</h2>
//                     <p className="text-gray-500 text-sm font-medium">Here is your system overview for today.</p>
//                 </div>
//                 <div className="text-right">
//                     <p className="font-bold text-sm text-black">{currentDate}</p>
//                     <p className="text-xs text-gray-500">{currentTime}</p>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//                 {/* 3. OPTIONAL CHAINING (?.) PADA DATA UNTUK MENCEGAH CRASH */}
//                 <StatCard title="Total Dataset" value={(dashboardData?.summary?.total_data || 0).toLocaleString()} icon={Database} />
//                 <StatCard title="Total Prediction" value={(dashboardData?.summary?.total_predictions || 0).toLocaleString()} icon={Activity} />
//                 <StatCard title="Total Cluster" value={dashboardData?.summary?.total_clusters || 0} icon={GitCommit} />
//                 <StatCard title="Accuracy" value={dashboardData?.summary?.accuracy || '0%'} icon={CheckCircle} />
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-80">
//                 <div className="lg:col-span-2 bg-white border border-gray-300 rounded shadow-sm p-5 flex flex-col">
//                     <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
//                         <h3 className="font-bold text-sm text-black">Environmental Trends</h3>
//                         <div className="flex gap-2">
//                             <span className="px-2 py-1 text-[10px] font-bold border border-black text-black rounded-sm">Temp</span>
//                             <span className="px-2 py-1 text-[10px] font-bold border border-gray-300 text-gray-500 rounded-sm">Hum</span>
//                             <span className="px-2 py-1 text-[10px] font-bold border border-gray-300 text-gray-500 rounded-sm">SWC</span>
//                         </div>
//                     </div>
//                     <div className="flex-1">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <LineChart data={dashboardData?.trendData || []}>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
//                                 <XAxis dataKey="time" tick={{fontSize: 10}} stroke="#9CA3AF" />
//                                 <YAxis tick={{fontSize: 10}} stroke="#9CA3AF" />
//                                 <Tooltip cursor={{stroke: '#E5E7EB', strokeWidth: 2}} />
//                                 <Line type="monotone" dataKey="temp" stroke="#111827" strokeWidth={2} dot={{r: 3, fill: '#111827'}} activeDot={{r: 5}} />
//                             </LineChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </div>

//                 <div className="bg-white border border-gray-300 rounded shadow-sm p-5 flex flex-col">
//                     <h3 className="font-bold text-sm text-black border-b border-gray-200 pb-2 mb-4">Distributions</h3>
//                     <div className="flex-1 relative flex items-center justify-center">
//                         <ResponsiveContainer width="100%" height="100%">
//                             <PieChart>
//                                 <Pie
//                                     data={dashboardData?.distributionData || []}
//                                     innerRadius={60}
//                                     outerRadius={80}
//                                     paddingAngle={2}
//                                     dataKey="value"
//                                     stroke="none"
//                                 >
//                                     {(dashboardData?.distributionData || []).map((entry, index) => (
//                                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                                     ))}
//                                 </Pie>
//                                 <Tooltip />
//                             </PieChart>
//                         </ResponsiveContainer>
//                         <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
//                             <span className="text-2xl font-extrabold text-black">42%</span>
//                         </div>
//                     </div>
//                     <div className="mt-2 text-xs font-medium text-gray-500 flex flex-col gap-1">
//                         <div className="flex items-center gap-2"><div className="w-3 h-3 bg-black rounded-sm"></div> Cluster A</div>
//                         <div className="flex items-center gap-2"><div className="w-3 h-3 bg-gray-200 border border-gray-300 rounded-sm"></div> Cluster B</div>
//                     </div>
//                 </div>
//             </div>

//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
//                 <div className="lg:col-span-2 bg-white border border-gray-300 rounded shadow-sm flex flex-col">
//                     <div className="flex justify-between items-center p-4 border-b border-gray-200">
//                         <h3 className="font-bold text-sm text-black">Recent Activity</h3>
//                         <a href="#" className="text-xs font-semibold text-gray-500 hover:text-black hover:underline">View All</a>
//                     </div>
//                     <div className="overflow-x-auto flex-1 p-4">
//                         <table className="w-full text-left text-sm whitespace-nowrap">
//                             <thead className="text-xs font-bold text-gray-500 border-b border-gray-200 bg-gray-50">
//                                 <tr>
//                                     <th className="py-3 px-2 font-semibold">ID</th>
//                                     <th className="py-3 px-2 font-semibold">Action</th>
//                                     <th className="py-3 px-2 font-semibold">User</th>
//                                     <th className="py-3 px-2 font-semibold">Time</th>
//                                     <th className="py-3 px-2 font-semibold text-right">Status</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="divide-y divide-gray-100 text-gray-700">
//                                 {(dashboardData?.recentActivity || []).map((act, i) => (
//                                     <tr key={i} className="hover:bg-gray-50 transition-colors">
//                                         <td className="py-3 px-2 font-medium text-gray-500">{act.id}</td>
//                                         <td className="py-3 px-2 text-black font-semibold">{act.action}</td>
//                                         <td className="py-3 px-2">{act.user}</td>
//                                         <td className="py-3 px-2 text-gray-400 text-xs">{act.time}</td>
//                                         <td className="py-3 px-2 text-right">
//                                             <span className={`border px-2 py-1 text-xs rounded-sm font-medium ${
//                                                 act.status === 'Success' ? 'bg-green-50 border-green-200 text-green-700' : 
//                                                 'bg-yellow-50 border-yellow-200 text-yellow-700'
//                                             }`}>
//                                                 {act.status}
//                                             </span>
//                                         </td>
//                                     </tr>
//                                 ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>

//                 <div className="bg-white border border-gray-300 rounded shadow-sm p-5 h-fit">
//                     <h3 className="font-bold text-sm text-black border-b border-gray-200 pb-3 mb-4">Quick Actions</h3>
//                     <div className="space-y-3">
//                         <button className="w-full bg-black text-white font-semibold py-2.5 rounded text-sm hover:bg-gray-800 transition-colors shadow-sm">
//                             Run New Prediction
//                         </button>
//                         <button className="w-full bg-white text-black border border-gray-300 font-semibold py-2.5 rounded text-sm hover:bg-gray-50 transition-colors">
//                             Upload Dataset
//                         </button>
//                         <button className="w-full bg-white text-black border border-gray-300 font-semibold py-2.5 rounded text-sm hover:bg-gray-50 transition-colors">
//                             Generate Report
//                         </button>
//                     </div>
//                 </div>
//             </div>

//         </div>
//     );
// };

// const StatCard = ({ title, value, icon: Icon }) => (
//     <div className="bg-white border border-gray-300 rounded p-5 flex flex-col justify-between h-28 shadow-sm hover:shadow-md transition-shadow">
//         <div className="flex justify-between items-start">
//             <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{title}</h3>
//             <Icon className="w-4 h-4 text-gray-400" />
//         </div>
//         <p className="text-3xl font-extrabold text-black tracking-tight">{value}</p>
//     </div>
// );

// export default Dashboard;