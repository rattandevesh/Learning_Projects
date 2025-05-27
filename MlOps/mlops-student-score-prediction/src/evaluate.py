import pandas as pd
import joblib
from sklearn.metrics import mean_squared_error

df = pd.read_csv("data/processed/preprocessed.csv")
X = df[["Hours"]]
y = df["Scores"]

model = joblib.load("models/student_score_model.joblib")
preds = model.predict(X)

mse = mean_squared_error(y, preds)
print(f"Mean Squared Error: {mse:.2f}")
