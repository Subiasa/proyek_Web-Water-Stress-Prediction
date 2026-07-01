import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Loader2 } from 'lucide-react';
import { 
    LineChart, Line, BarChart, Bar, ScatterChart, Scatter, 
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAnalytics = async () => {
            setIsLoading(true);
            try {
                // Menembak endpoint Laravel
                const response = await api.get('/analytics');
                
                // Sistem Pertahanan & Pemetaan Data
                if (response.data) {
                    setAnalyticsData(response.data);
                } else {
                    throw new Error("Struktur data tidak valid");
                }
            } catch (err) {
                console.error("Error fetching analytics:", err);
                setError('Gagal memuat data analitik. Menggunakan data simulasi untuk pratinjau antarmuka.');
                
                // Fallback Data Simulasi (Dummy) agar UI tetap bisa dilihat
                setAnalyticsData({
                    metrics: { accuracy: '0.94', precision: '0.91', recall: '0.95', f1: '0.93' },
                    elbowData: [
                        { k: 1, inertia: 1500 }, { k: 2, inertia: 800 }, 
                        { k: 3, inertia: 400 }, { k: 4, inertia: 300 }, { k: 5, inertia: 250 }
                    ],
                    rocData: [
                        { fpr: 0, tpr: 0 }, { fpr: 0.1, tpr: 0.85 }, 
                        { fpr: 0.2, tpr: 0.92 }, { fpr: 1, tpr: 1 }
                    ],
                    histogramData: [
                        { range: '20-25', count: 40 }, { range: '25-30', count: 85 },
                        { range: '30-35', count: 120 }, { range: '35-40', count: 50 }
                    ],
                    pcaData: [
                        { x: -2, y: 1 }, { x: -1, y: -1 }, { x: 2, y: 2 }, { x: 3, y: 0 }
                    ]
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-black" />
            </div>
        );
    }

    return (
        <div className="p-8 max-w-[1400px] mx-auto font-sans bg-white min-h-screen">
            
            {/* Header */}
            <div className="mb-8 border-b-2 border-gray-200 pb-4">
                <h1 className="text-4xl font-serif font-bold tracking-tight text-black mb-2">System Analytics</h1>
                <p className="text-sm text-gray-500 font-medium">Diagnostic reports and structural evaluations.</p>
            </div>

            {error && (
                <div className="mb-6 p-3 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200 font-medium">
                    {error}
                </div>
            )}

            {/* SECTION 1: Exploratory Data Analysis (EDA) */}
            <section className="mb-12">
                <SectionTitle title="Exploratory Data Analysis (EDA)" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ChartCard title="Histogram Distribution">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData?.histogramData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="range" tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <YAxis tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <Tooltip cursor={{fill: '#F3F4F6'}} />
                                <Bar dataKey="count" fill="#111827" />
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                    
                    <ChartCard title="Boxplot Variance">
                        <Placeholder text="[ Boxplot SVG / Plotly Graph Area ]" />
                    </ChartCard>
                    
                    <ChartCard title="Correlation Heatmap">
                        <Placeholder text="[ Heatmap Matrix Area ]" />
                    </ChartCard>
                </div>
            </section>

            {/* SECTION 2: K-Means Diagnostics */}
            <section className="mb-12">
                <SectionTitle title="K-Means Diagnostics" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ChartCard title="Elbow Method">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analyticsData?.elbowData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                <XAxis dataKey="k" tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <YAxis tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <Tooltip />
                                <Line type="monotone" dataKey="inertia" stroke="#111827" strokeWidth={2} dot={{r: 4, fill: '#111827'}} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                    
                    <ChartCard title="Silhouette Score">
                        <Placeholder text="[ Silhouette Plot Area ]" />
                    </ChartCard>
                    
                    <ChartCard title="PCA Projection">
                        <ResponsiveContainer width="100%" height="100%">
                            <ScatterChart>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="x" type="number" tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <YAxis dataKey="y" type="number" tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <Tooltip cursor={{strokeDasharray: '3 3'}} />
                                <Scatter name="Data" data={analyticsData?.pcaData} fill="#111827" />
                            </ScatterChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </section>

            {/* SECTION 3: Model Evaluation */}
            <section className="mb-12">
                <SectionTitle title="Model Evaluation" />
                
                {/* 4 Stat Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <MetricCard title="ACCURACY" value={analyticsData?.metrics?.accuracy} />
                    <MetricCard title="PRECISION" value={analyticsData?.metrics?.precision} />
                    <MetricCard title="RECALL" value={analyticsData?.metrics?.recall} />
                    <MetricCard title="F1 SCORE" value={analyticsData?.metrics?.f1} />
                </div>

                {/* 2 Bottom Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <ChartCard title="Confusion Matrix" height="h-72">
                        <Placeholder text="[ Confusion Matrix Area ]" />
                    </ChartCard>
                    
                    <ChartCard title="ROC Curve" height="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={analyticsData?.rocData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                                <XAxis dataKey="fpr" type="number" tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <YAxis dataKey="tpr" type="number" tick={{fontSize: 10}} stroke="#9CA3AF" />
                                <Tooltip />
                                <Line type="stepAfter" dataKey="tpr" stroke="#111827" strokeWidth={2} dot={false} />
                            </LineChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>
            </section>

        </div>
    );
};

// --- Komponen Pembantu (Helper Components) untuk kebersihan kode ---

const SectionTitle = ({ title }) => (
    <div className="border-b border-black pb-2 mb-6">
        <h2 className="text-xl font-bold text-black">{title}</h2>
    </div>
);

const ChartCard = ({ title, children, height = "h-56" }) => (
    <div className="border border-gray-300 p-4 rounded-sm flex flex-col">
        <h3 className="text-sm font-bold text-black mb-3 border-b border-gray-200 pb-2">{title}</h3>
        <div className={`w-full ${height} bg-gray-50/50 flex-1 relative`}>
            {children}
        </div>
    </div>
);

const MetricCard = ({ title, value }) => (
    <div className="border border-gray-300 p-4 rounded-sm flex flex-col items-center justify-center text-center py-6 shadow-sm hover:shadow-md transition-shadow bg-white">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">{title}</p>
        <p className="text-4xl font-extrabold text-black">{value || '--'}</p>
    </div>
);

const Placeholder = ({ text }) => (
    <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400 font-medium bg-gray-100/50">
        {text}
    </div>
);

export default Analytics;