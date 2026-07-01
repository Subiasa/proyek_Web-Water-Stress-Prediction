import os
import joblib
import pickle

MODEL_DIR = 'models'
files_to_check = ['standard_scaler.pkl', 'pca_model.pkl', 'water_stress_model.pkl']

for filename in files_to_check:
    filepath = os.path.join(MODEL_DIR, filename)
    print(f"--- Memeriksa: {filename} ---")
    
    if not os.path.exists(filepath):
        print("File tidak ditemukan.")
        continue

    # Percobaan 1: Menggunakan joblib
    try:
        model = joblib.load(filepath)
        print("Berhasil dimuat dengan: joblib")
        print(f"Tipe Objek: {type(model)}")
        if hasattr(model, 'cluster_centers_'):
            print(">> TERDETEKSI: Model Clustering (K-Means/GMM)")
        continue # Lanjut ke file berikutnya jika berhasil
    except Exception as e_joblib:
        print(f"Gagal dengan joblib: {e_joblib}")

    # Percobaan 2: Menggunakan pickle (Jika joblib gagal)
    try:
        with open(filepath, 'rb') as file:
            model = pickle.load(file)
        print("Berhasil dimuat dengan: pickle")
        print(f"Tipe Objek: {type(model)}")
    except Exception as e_pickle:
        print(f"Gagal dengan pickle: {e_pickle}")
        print(">> KESIMPULAN: File kemungkinan besar KORUP atau bukan format model yang valid.")
    print("\n")