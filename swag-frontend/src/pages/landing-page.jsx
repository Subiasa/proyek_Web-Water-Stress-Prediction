// dari file lain

import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      
      {/* Navbar - Sesuai Wireframe: Kiri (Logo), Tengah (Menu), Kanan (Ikon & Login) */}
      <nav className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-12">
          <div className="text-2xl font-extrabold text-emerald-700 tracking-tight">SWAG.</div>
          <div className="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
            <a href="#" className="text-emerald-700 border-b-2 border-emerald-700 pb-1">Home</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">About</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Contact</a>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <button className="text-slate-400 hover:text-emerald-600 transition-colors" aria-label="Notifications">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
          </button>
          <button className="text-slate-400 hover:text-emerald-600 transition-colors" aria-label="Profile">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          </button>
          <Link to="/login" className="px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 rounded-lg shadow hover:bg-emerald-700 transition-all">
            Login
          </Link>
        </div>
      </nav>

      {/* Hero Section - Sesuai Wireframe: Teks di Kiri, Gambar Besar di Kanan */}
      <header className="px-6 py-20 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">
            SWAG
          </h1>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed max-w-md">
            Advanced agricultural intelligence platform leveraging machine learning to optimize crop yields and sustainable farming practices.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="px-6 py-3 text-sm font-bold text-white bg-slate-900 rounded-lg shadow hover:bg-slate-800 transition-all">
              Get Started
            </Link>
            <button className="px-6 py-3 text-sm font-bold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-all">
              Learn More
            </button>
          </div>
        </div>
        
        {/* Area Placeholder Gambar (Bisa diganti image betulan nanti) */}
        <div className="h-[400px] w-full rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 flex items-center justify-center shadow-inner border border-emerald-100">
          <span className="text-emerald-800/40 font-semibold text-lg flex flex-col items-center gap-2">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            Illustration Area
          </span>
        </div>
      </header>

      {/* Core Capabilities - Sesuai Wireframe: Judul di atas, 4 Kartu sejajar */}
      <section className="bg-white border-y border-slate-200 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Core Capabilities</h2>
          <p className="text-slate-500 mb-10 text-lg">Data-driven insights for modern agriculture.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Yield Prediction</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Accurate forecasting models based on historical and real-time environmental data.</p>
            </div>
            
            {/* Card 2 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Remote Sensing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Integration with satellite imagery for field health monitoring and anomaly detection.</p>
            </div>
            
            {/* Card 3 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Resource Optimization</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Smart irrigation and fertilizer recommendations to minimize waste.</p>
            </div>
            
            {/* Card 4 */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-white rounded-lg border border-slate-200 shadow-sm flex items-center justify-center text-emerald-600 mb-5">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
              </div>
              <h3 className="font-bold text-lg text-slate-900 mb-2">Pest Management</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Early warning systems for pest and disease outbreaks using localized data.</p>
            </div>
          </div>
        </div>
      </section>

      {/* System Workflow - Sesuai Wireframe: 2 Kotak sejajar di atas, 1 Kotak panjang di bawah */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-10">System Workflow</h2>
        
        {/* Top Row: Langkah 1 & 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black">1</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Data Ingestion</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Aggregating IoT sensor data, weather APIs, and historical crop logs into the central repository.</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black">2</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">Processing</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Machine learning models analyze structured datasets.</p>
            </div>
          </div>
        </div>
        
        {/* Bottom Row: Langkah 3 (Full width) */}
        <div className="bg-white border border-slate-200 rounded-xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="flex-shrink-0 w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-2xl font-black">3</div>
            <div>
              <h3 className="font-bold text-xl text-slate-900 mb-1">Actionable Insights</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Delivery of predictive analytics via dashboard and API endpoints.</p>
            </div>
          </div>
          <Link to="/dashboard" className="flex-shrink-0 px-8 py-3 w-full sm:w-auto text-center text-sm font-bold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow">
            View Demo
          </Link>
        </div>
      </section>

      {/* Footer - Sesuai Wireframe: Logo (kiri), Links (tengah), Copyright (kanan) */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm font-semibold text-slate-500 gap-4">
          <div className="text-slate-900 font-extrabold text-lg">SWAG.</div>
          <div className="flex gap-8">
            <a href="#" className="hover:text-emerald-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-emerald-600 transition-colors">Support</a>
          </div>
          <div className="font-medium text-slate-400">© 2026 SWAG. All rights reserved.</div>
        </div>
      </footer>
      
    </div>
  );
};

export default LandingPage;