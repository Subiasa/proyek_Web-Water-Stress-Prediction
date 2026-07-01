import os
import joblib
import pandas as pd
import numpy as np


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

# Memuat model
scaler = joblib.load(os.path.join(MODEL_DIR, 'standard_scaler.pkl'))
pca = joblib.load(os.path.join(MODEL_DIR, 'pca_model.pkl'))
rf_model = joblib.load(os.path.join(MODEL_DIR, 'water_stress_model.pkl'))
feature_cols = joblib.load(os.path.join(MODEL_DIR, 'feature_columns.pkl'))

def make_prediction(input_data: dict):
    # 1. Ubah input menjadi DataFrame
    df = pd.DataFrame([input_data])
    
    # 2. Penyesuaian fitur (Align data dengan model)
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0.0
    df = df[feature_cols]

    # 3. Preprocessing (Standard Scaling)
    # Ini langkah yang wajib, karena model dilatih dengan data yang sudah di-scale
    scaled_data = scaler.transform(df)
    
    # Debug: Melihat shape data sebelum masuk ke model
    print(f"DEBUG - Shape data input ke model: {scaled_data.shape}")


    # 4. Prediksi
    prediction = rf_model.predict(scaled_data)[0]
    
    # 5. Confidence Score
    confidence = 100.0
    if hasattr(rf_model, "predict_proba"):
        probabilities = rf_model.predict_proba(scaled_data)[0]
        confidence = float(np.max(probabilities) * 100)

    return {
        "prediction": str(prediction),
        "confidence": round(confidence, 2)
    }
