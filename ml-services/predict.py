import os
import pickle
import pandas as pd
import numpy as np

# 1. Inisialisasi Path Direktori Models
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

# 2. Fungsi Pemuatan Model (Load .pkl)
def load_pickle(filename):
    with open(os.path.join(MODEL_DIR, filename), 'rb') as file:
        return pickle.load(file)

# Memuat kelima file .pkl berdasarkan gambar Anda
scaler = load_pickle('standard_scaler.pkl')
pca = load_pickle('pca_model.pkl')
rf_model = load_pickle('water_stress_model.pkl')
feature_cols = load_pickle('feature_columns.pkl')
cluster_mapping = load_pickle('cluster_mapping.pkl')

# 3. Fungsi Prediksi Utama
def make_prediction(input_data: dict):
    # Ubah input dictionary menjadi Pandas DataFrame
    df = pd.DataFrame([input_data])
    
    # Pastikan struktur kolom persis sama dengan saat training menggunakan feature_columns.pkl
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0.0  # Nilai default jika Laravel tidak mengirimkan kolom tertentu
    df = df[feature_cols]

    # Tahap Preprocessing
    scaled_data = scaler.transform(df)
    pca_data = pca.transform(scaled_data)

    # Tahap Prediksi Klasifikasi (Random Forest)
    stress_prediction = rf_model.predict(pca_data)[0]
    
    # Menghitung probabilitas/persentase keyakinan model
    confidence_score = 100.0
    if hasattr(rf_model, "predict_proba"):
        probabilities = rf_model.predict_proba(pca_data)[0]
        confidence_score = float(np.max(probabilities) * 100)

    # Tahap Pengembalian Hasil
    return {
        "cluster_id": 1, # (Lihat pertanyaan lanjutan saya di bawah terkait ini)
        "cluster_name": cluster_mapping.get(1, "Unknown"),
        "prediction": str(stress_prediction),
        "confidence": round(confidence_score, 2)
    }

