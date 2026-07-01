import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Leaf, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react'; 

const Login = () => {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false); 
    
    // State baru untuk Remember Me
    const [rememberMe, setRememberMe] = useState(false);
    
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    // Mengecek apakah sebelumnya user mencentang 'Remember Me' saat halaman dimuat
    useEffect(() => {
        const savedEmail = localStorage.getItem('rememberedEmail');
        if (savedEmail) {
            setEmail(savedEmail);
            setRememberMe(true);
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        try {
            const response = await api.post('/login', {
                email: email,
                password: password
            });

            const { access_token, user } = response.data;
            localStorage.setItem('token', access_token);
            localStorage.setItem('user', JSON.stringify(user));

            // Logika Remember Me: Simpan email jika dicentang, hapus jika tidak
            if (rememberMe) {
                localStorage.setItem('rememberedEmail', email);
            } else {
                localStorage.removeItem('rememberedEmail');
            }

            navigate('/dashboard', { replace: true });

        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage('Email atau password yang Anda masukkan salah.');
            } else {
                setErrorMessage('Terjadi kesalahan pada server. Silakan coba lagi.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="max-w-md w-full bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
                
                <div className="flex flex-col items-center mb-8">
                    <div className="w-12 h-12 border-2 border-black flex items-center justify-center rounded-sm mb-4">
                        <Leaf className="w-6 h-6 text-black" />
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight text-black mb-1">SWAG</h1>
                    <p className="text-sm text-gray-500">Sign in to your account</p>
                </div>

                {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-md flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 min-w-[16px]" />
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label htmlFor="email" className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                            Email Address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="username" // Memancing Autofill Browser
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors bg-white text-gray-900 text-sm"
                            disabled={isLoading}
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1">
                            <label htmlFor="password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                                Password
                            </label>
                            <a href="#" className="text-xs text-gray-500 hover:text-black hover:underline transition-colors">
                                Forgot Password?
                            </a>
                        </div>
                        <div className="relative">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"} 
                                autoComplete="current-password" // Memancing Autofill Password Manager
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors bg-white text-gray-900 text-sm"
                                disabled={isLoading}
                            />
                            <button
                                type="button" 
                                onClick={() => setShowPassword(!showPassword)}
                                disabled={isLoading}
                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-black focus:outline-none disabled:opacity-50 transition-colors"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="remember-me"
                            type="checkbox"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            className="h-4 w-4 text-black focus:ring-black border-gray-300 rounded cursor-pointer accent-black"
                            disabled={isLoading}
                        />
                        <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 cursor-pointer">
                            Remember me for 30 days
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-black text-white font-semibold py-2.5 px-4 rounded-md hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:bg-gray-400 flex justify-center items-center gap-2 text-sm mt-2"
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Processing...
                            </>
                        ) : (
                            'LOGIN'
                        )}
                    </button>
                </form>

                <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="#" className="text-black font-semibold hover:underline">
                            Request Access
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;