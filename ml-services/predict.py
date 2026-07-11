import os
import joblib
import pandas as pd
import numpy as np


BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'models')

# Memuat model
scaler = joblib.load(os.path.join(MODEL_DIR, 'scaler.pkl'))
pca = joblib.load(os.path.join(MODEL_DIR, 'pca.pkl'))
rf_model = joblib.load(os.path.join(MODEL_DIR, 'random_forest.pkl'))
feature_cols = joblib.load(os.path.join(MODEL_DIR, 'feature_columns(1).pkl'))

def make_prediction(input_data: dict):
    # 1. Ubah input menjadi DataFrame
    df = pd.DataFrame([input_data])
    
    # 2. Penyesuaian fitur (Align data dengan model)
    for col in feature_cols:
        if col not in df.columns:
            df[col] = 0.0
    df = df[feature_cols]

    # 3. Prediksi (Model Random Forest dilatih langsung menggunakan data mentah/raw tanpa scaling)
    prediction = rf_model.predict(df)[0]
    
    # 4. Confidence Score
    confidence = 100.0
    if hasattr(rf_model, "predict_proba"):
        probabilities = rf_model.predict_proba(df)[0]
        confidence = float(np.max(probabilities) * 100)

    # 6. Feature Importances
    importances_list = []
    if hasattr(rf_model, "feature_importances_"):
        importances = rf_model.feature_importances_
        for name, imp in zip(feature_cols, importances):
            # Tentukan kategori impak secara sederhana
            impact_level = "High" if imp > 0.15 else "Medium" if imp > 0.05 else "Low"
            importances_list.append({
                "name": name,
                "impact": impact_level,
                "value": round(float(imp * 100), 2)
            })
        # Urutkan dari yang terbesar dan ambil 5 teratas
        importances_list = sorted(importances_list, key=lambda x: x["value"], reverse=True)[:5]

    return {
        "prediction": str(prediction),
        "confidence": round(confidence, 2),
        "factors": importances_list
    }
