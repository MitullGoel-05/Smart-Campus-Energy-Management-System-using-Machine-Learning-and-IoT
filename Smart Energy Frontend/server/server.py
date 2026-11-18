import os
import joblib
import pandas as pd
from flask import Flask, request
from datetime import datetime


app = Flask(__name__)


# -------------------------------------------------
# 1. Load Preprocessor & Training Metadata
# -------------------------------------------------
preprocess_data = joblib.load("energy_preprocessor.joblib")
scaler = preprocess_data["scaler"]
feature_names = preprocess_data["feature_names"]


# RETRIEVE THE WINNER FROM TRAINING (e.g., "Gradient Boosting")
BEST_MODEL_NAME = preprocess_data.get("best_model_name") 


print(f"Training Phase Winner: {BEST_MODEL_NAME}")


# -------------------------------------------------
# 2. Load ALL Models Dynamically
# -------------------------------------------------
models = {}
for file in os.listdir():
    if file.startswith("model_") and file.endswith(".joblib"):
        # Clean filename to get model name: "model_Gradient_Boosting.joblib" -> "Gradient Boosting"
        name = file.replace("model_", "").replace(".joblib", "").replace("_", " ")
        models[name] = joblib.load(file)


print("\nLoaded Models:")
for m in models:
    print(f" - {m}")


# Verify the winner exists
if BEST_MODEL_NAME not in models:
    print(f"WARNING: The best model '{BEST_MODEL_NAME}' was not found in the directory!")
    # Fallback to first available model if file is missing
    BEST_MODEL_NAME = list(models.keys())[0]


print(f"\nActive Primary Model: {BEST_MODEL_NAME}\n")


# -------------------------------------------------
# 3. CSV Setup
# -------------------------------------------------
DATA_CSV_PATH = "SmartEnergyFrontend/public/data.csv"
# Header adjusted to match the logic below
if not os.path.exists(DATA_CSV_PATH):
    with open(DATA_CSV_PATH, "w") as f:
        f.write("timestamp,temperature,humidity,current,predicted_energy,rf_pred,gb_pred,svr_pred,dt_pred\n")


@app.route("/iot", methods=["POST"])
def iot_data():
    try:
        data = request.get_json()
        temp = float(data["temperature"])
        hum = float(data["humidity"])
        curr = float(data["current"])


        # Build feature dict
        feat = {
            "Temperature": temp,
            "Humidity": hum,
            "Current": curr,
            "Occupancy": 30,
            "HVACUsage": 0,
            "LightingUsage": 1,
            "RenewableEnergy": 20,
            "Hour": datetime.now().hour,
            "Month": datetime.now().month,
            "day_of_week": datetime.now().weekday(),
            "is_weekend": 1 if datetime.now().weekday() >= 5 else 0,
            "Temperature_squared": temp * temp,
            "Occupancy_squared": 30 * 30
        }


        df = pd.DataFrame([feat])


        # Ensure all columns exist and are in the correct order
        for col in feature_names:
            if col not in df.columns:
                df[col] = 0
        
        df = df[feature_names]
        scaled = scaler.transform(df)


        # -------------------------------------------
        # Predict with ALL MODELS
        # -------------------------------------------
        predictions = {}
        for name, model in models.items():
            predictions[name] = float(model.predict(scaled)[0])


        # -------------------------------------------
        # FIXED LOGIC: Use the Training Winner
        # -------------------------------------------
        primary_prediction = predictions.get(BEST_MODEL_NAME, 0.0)


        print("\nLIVE PREDICTIONS:")
        for name, val in predictions.items():
            marker = "(*WINNER*)" if name == BEST_MODEL_NAME else ""
            print(f"{name}: {val:.2f} {marker}")


        # -------------------------------------------
        # Save to CSV
        # -------------------------------------------
        def get_pred(name):
            return predictions.get(name, 0.0)


        try:
            with open(DATA_CSV_PATH, "a") as f:
                ts = datetime.now().isoformat(sep=' ')
                
                # Get specific model predictions safely (Update names based on your specific files)
                # Note: Ensure these keys match how your files are named (e.g. "Gradient Boosting" vs "Gradient_Boosting")
                rf = get_pred("Random Forest")
                gb = get_pred("Gradient Boosting")
                svr = get_pred("SVR") 
                dt = get_pred("Decision Tree")


                # Structure: time, temp, hum, current, BEST_MODEL_VALUE, individual_model_cols...
                f.write(f"{ts},{temp},{hum},{curr},{gb},{rf},{svr},{dt}\n")
        except Exception as e:
            print(f"WARNING: CSV Write failed: {e}")


        return {
            "status": "success",
            "best_model_used": BEST_MODEL_NAME,
            "predicted_energy": primary_prediction,
            "all_predictions": predictions
        }, 200


    except Exception as e:
        print("SERVER ERROR:", e)
        return {"status": "error", "message": str(e)}, 400


@app.route("/")
def home():
    return f"MULTI-MODEL ENERGY SERVER ACTIVE. Using: {BEST_MODEL_NAME}"


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)



