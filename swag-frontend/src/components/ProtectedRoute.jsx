import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Mengecek apakah ada token yang tersimpan di browser
    const token = localStorage.getItem('token');

    // Jika tidak ada token, paksa pindah ke halaman login
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    // Jika ada token, izinkan akses ke komponen anak (Outlet)
    return <Outlet />;
};

export default ProtectedRoute;