function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-green-600 mb-4">
          Sistem SWAG Berjalan! 🚀
        </h1>
        <p className="text-gray-600 mb-6">
          Jika Anda melihat kotak putih dengan bayangan, teks berwarna hijau, dan tombol di bawah ini, berarti <strong>React</strong> dan <strong>Tailwind CSS</strong> Anda sudah terhubung dengan sempurna.
        </p>
        <button className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
          Mulai Pengembangan
        </button>
      </div>
    </div>
  )
}

export default App