from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import uvicorn
from predict import make_prediction

app = FastAPI(title="SWAG ML Microservice", description="API untuk prediksi Water Stress dan Clustering")

# Pydantic Schema: Memvalidasi data masuk dari Laravel
class SensorInput(BaseModel):
    temperature: float
    humidity: float
    soil_water_content: float = 0.0
    par: float = 0.0
    leaf_thickness: float = 0.0
    leaf_length: float = 0.0

@app.post("/predict")
def get_prediction(data: SensorInput):
    try:
        # Mengubah data dari Laravel menjadi dictionary dan memprosesnya
        result = make_prediction(data.dict())
        
        return {
            "status": "success",
            "message": "Data berhasil diproses oleh Machine Learning",
            "data": result
        }
    except Exception as e:
        # Menangkap error jika format data atau komputasi gagal
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    # Menjalankan server FastAPI di localhost port 8001 (Berbeda dengan Laravel di 8000)
    uvicorn.run(app, host="127.0.0.1", port=8001)