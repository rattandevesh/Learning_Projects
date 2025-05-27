import joblib
import pandas as pd

def predict(hours):
    model = joblib.load("models/student_score_model.joblib")
    df = pd.DataFrame({"Hours": [hours]})
    return model.predict(df)[0]

if __name__ == "__main__":
    hours = float(input("Enter study hours: "))
    prediction = predict(hours)
    print(f"Predicted Score: {prediction:.2f}")
