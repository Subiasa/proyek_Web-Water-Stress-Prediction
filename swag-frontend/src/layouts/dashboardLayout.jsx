import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Database, Activity, BarChart2, History, User, LogOut } from 'lucide-react';
import api from '../services/api';

const DashboardLayout = () => {
    const navigate = useNavigate();

    // Daftar menu untuk efisiensi mapping kode
    const menuItems = [
        { path: '/dashboard', name: 'Dashboard', icon: LayoutDashboard },
        { path: '/dataset', name: 'Dataset', icon: Database },
        { path: '/prediction', name: 'Prediction', icon: Activity },
        { path: '/analytics', name: 'Analytics', icon: BarChart2 },
        { path: '/history', name: 'History', icon: History },
        { path: '/profile', name: 'Profile', icon: User },
    ];

    const handleLogout = async () => {
        try {
            // (Opsional) Beritahu backend Laravel untuk menghapus token di sisi server
            await api.post('/logout');
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            // Hapus data sesi di browser terlepas dari respon server
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Jangan hapus 'rememberedEmail'
            navigate('/login', { replace: true });
        }
    };

    return (
        <div className="flex h-screen bg-gray-50 font-sans text-gray-900 overflow-hidden">
            
            {/* SIDEBAR */}
            <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
                {/* Header Sidebar */}
                <div className="h-20 flex flex-col justify-center px-6 border-b border-gray-200">
                    <h1 className="text-2xl font-bold tracking-tight">SWAG</h1>
                    <p className="text-xs text-gray-500">Agri-Intelligence</p>
                </div>

                {/* Navigasi Menu */}
                <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                // Logika interaktif: Jika menu aktif, warnanya hitam (sesuai wireframe)
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                                        isActive 
                                            ? 'bg-black text-white' 
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-black'
                                    }`
                                }
                            >
                                <Icon className="w-5 h-5" />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Footer Sidebar (Logout) */}
                <div className="p-4 border-t border-gray-200">
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-md hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* AREA KONTEN UTAMA (Sisi Kanan) */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Komponen <Outlet /> akan merender isi dari halaman yang sedang aktif (Dashboard, Dataset, dll) */}
                <div className="flex-1 overflow-y-auto">
                    <Outlet />
                </div>
                
                {/* Footer Hak Cipta (Global) */}
                <footer className="h-12 border-t border-gray-200 bg-white flex items-center justify-between px-8 text-xs text-gray-500">
                    <p>&copy; 2026 SWAG. All rights reserved.</p>
                    <div className="flex gap-4">
                        <a href="#" className="hover:text-black">Terms</a>
                        <a href="#" className="hover:text-black">Privacy</a>
                        <a href="#" className="hover:text-black">Support</a>
                    </div>
                </footer>
            </main>
        </div>
    );
};

export default DashboardLayout;