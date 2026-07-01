import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

const Profile = () => {
    // 1. STATE MANAJEMEN
    // State Data Profil
    const [profileData, setProfileData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: 'Lead Agronomist' // Sesuai wireframe
    });
    
    // State Keamanan Sandi
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // State Interaksi (Loading & Notifikasi)
    const [isLoading, setIsLoading] = useState(true);
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [isSavingPassword, setIsSavingPassword] = useState(false);
    const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    // 2. MENGAMBIL DATA AWAL (FETCH USER DATA)
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                // Opsional: Cek local storage dulu jika backend belum ada endpoint GET /profile khusus
                const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
                
                // Idealnya: response = await api.get('/profile');
                // Untuk tahap ini kita simulasikan pemetaan dari data yang ada
                const fullName = savedUser.name || 'Sarah Jenkins';
                const nameParts = fullName.split(' ');
                
                setProfileData({
                    firstName: nameParts[0] || '',
                    lastName: nameParts.slice(1).join(' ') || '',
                    email: savedUser.email || 'sarah.j@gmail.com',
                    role: 'Lead Agronomist'
                });
            } catch (error) {
                console.error("Gagal memuat profil:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // 3. HANDLER FORMULIR PROFIL
    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setIsSavingProfile(true);
        setProfileMessage({ type: '', text: '' });

        try {
            // Menyatukan nama awal dan akhir sebelum dikirim ke Laravel (jika DB hanya punya kolom 'name')
            const payload = {
                name: `${profileData.firstName} ${profileData.lastName}`.trim(),
                email: profileData.email,
                // role: profileData.role // Kirim jika tabel users memiliki kolom role
            };

            await api.put('/profile', payload);
            
            // Perbarui local storage agar Navbar (jika ada) ikut berubah
            const updatedUser = { name: payload.name, email: payload.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setProfileMessage({ type: 'success', text: 'Detail profil berhasil diperbarui.' });
        } catch (error) {
            setProfileMessage({ type: 'error', text: 'Gagal memperbarui profil. Periksa koneksi Anda.' });
        } finally {
            setIsSavingProfile(false);
        }
    };

    // 4. HANDLER KEAMANAN SANDI
    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setIsSavingPassword(true);
        setPasswordMessage({ type: '', text: '' });

        // Validasi Frontend Konfirmasi Sandi
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'Konfirmasi sandi baru tidak cocok.' });
            setIsSavingPassword(false);
            return;
        }

        try {
            await api.put('/password', {
                current_password: passwordData.currentPassword,
                password: passwordData.newPassword,
                password_confirmation: passwordData.confirmPassword
            });
            
            setPasswordMessage({ type: 'success', text: 'Kata sandi berhasil diubah.' });
            // Reset form sandi
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error) {
            setPasswordMessage({ type: 'error', text: 'Gagal mengubah sandi. Pastikan sandi saat ini benar.' });
        } finally {
            setIsSavingPassword(false);
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
        <div className="p-8 max-w-5xl mx-auto font-sans bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-8 border-b border-gray-200 pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-black mb-1">Profile Settings</h1>
                <p className="text-sm text-gray-500 font-medium">Manage your account details and preferences.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                
                {/* KOLOM KIRI: Rangkuman Profil */}
                <div className="md:w-1/3">
                    <div className="bg-white border border-gray-300 rounded p-6 flex flex-col items-center text-center shadow-sm">
                        <div className="w-24 h-24 rounded-full border-2 border-gray-300 flex items-center justify-center bg-gray-50 mb-4 text-gray-400">
                            <User className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold text-black">{profileData.firstName} {profileData.lastName}</h2>
                        <p className="text-sm font-semibold text-gray-500 mt-1">{profileData.role}</p>
                        <p className="text-xs text-gray-400 mt-1 mb-6">{profileData.email}</p>
                        
                        <div className="w-full border-t border-dashed border-gray-300 pt-4 space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-500">Account Status</span>
                                <span className="px-2 py-1 font-bold border border-black text-black rounded-sm bg-white tracking-widest">ACTIVE</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="font-semibold text-gray-500">Member Since</span>
                                <span className="font-bold text-black">Oct 2023</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* KOLOM KANAN: Formulir Tindakan */}
                <div className="md:w-2/3 space-y-6">
                    
                    {/* BAGIAN 1: Edit Details */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
                        <h3 className="text-base font-bold text-black border-b border-gray-200 pb-2 mb-5">Edit Details</h3>
                        
                        {profileMessage.text && (
                            <div className={`mb-4 p-3 text-sm rounded border flex items-center gap-2 ${profileMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {profileMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                <span>{profileMessage.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleProfileSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">First Name</label>
                                    <input type="text" name="firstName" value={profileData.firstName} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Last Name</label>
                                    <input type="text" name="lastName" value={profileData.lastName} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Email Address</label>
                                <input type="email" name="email" value={profileData.email} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1" required />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Role / Title</label>
                                <input type="text" name="role" value={profileData.role} onChange={handleProfileChange} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1 bg-gray-50" readOnly />
                            </div>
                            <div className="text-right pt-2">
                                <button type="submit" disabled={isSavingProfile} className="bg-black text-white px-5 py-2 text-sm font-semibold rounded hover:bg-gray-800 disabled:bg-gray-400 transition-colors">
                                    {isSavingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* BAGIAN 2: Security */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
                        <h3 className="text-base font-bold text-black border-b border-gray-200 pb-2 mb-5">Security</h3>

                        {passwordMessage.text && (
                            <div className={`mb-4 p-3 text-sm rounded border flex items-center gap-2 ${passwordMessage.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                {passwordMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                                <span>{passwordMessage.text}</span>
                            </div>
                        )}

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Current Password</label>
                                <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1" placeholder="••••••••" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">New Password</label>
                                    <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 mb-1">Confirm Password</label>
                                    <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-black focus:ring-1" required />
                                </div>
                            </div>
                            <div className="text-right pt-2">
                                <button type="submit" disabled={isSavingPassword} className="bg-white text-black border border-gray-300 px-5 py-2 text-sm font-semibold rounded hover:bg-gray-50 disabled:bg-gray-100 transition-colors">
                                    {isSavingPassword ? 'Updating...' : 'Update Password'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* BAGIAN 3: Preferences (Statik UI sesuai wireframe) */}
                    <div className="bg-white border border-gray-300 rounded shadow-sm p-6">
                        <h3 className="text-base font-bold text-black border-b border-gray-200 pb-2 mb-5">Preferences</h3>
                        
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-black">Dark Mode</p>
                                    <p className="text-xs text-gray-500">Switch to dark theme</p>
                                </div>
                                {/* Toggle Switch Biasa (Statik) */}
                                <div className="w-10 h-5 bg-gray-200 rounded-full flex items-center p-1 cursor-pointer">
                                    <div className="bg-white w-4 h-4 rounded-full shadow-md"></div>
                                </div>
                            </div>
                            
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-black">Language</p>
                                    <p className="text-xs text-gray-500">Select your preferred language</p>
                                </div>
                                <select className="px-3 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:border-black bg-white cursor-pointer font-medium">
                                    <option>English (US)</option>
                                    <option>Indonesia</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Profile;