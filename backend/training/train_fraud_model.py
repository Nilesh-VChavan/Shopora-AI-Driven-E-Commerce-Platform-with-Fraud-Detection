# Run this once: python train_fraud_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report
from sklearn.preprocessing import StandardScaler
import joblib


# Features: order_value, user_age, order_count, ip_frequency, device_type, is_fraud
data = pd.DataFrame({
    'order_value': [50, 150, 500, 20, 1000, 30, 200, 800, 40, 600],  # High value = higher risk
    'user_age': [25, 35, 22, 45, 28, 60, 32, 18, 50, 30],
    'order_count': [1, 5, 1, 10, 1, 20, 3, 1, 15, 2],
    'ip_frequency': [1, 10, 1, 50, 1, 100, 5, 1, 30, 4],
    'device_type': [0, 1, 0, 1, 0, 1, 1, 0, 1, 0],  
    'is_fraud': [0, 0, 1, 0, 1, 0, 0, 1, 0, 1]  
})

# Features (exclude target)
X = data.drop('is_fraud', axis=1)
y = data['is_fraud']

# Split data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train Random Forest (balanced for fraud imbalance)
model = RandomForestClassifier(n_estimators=100, random_state=42, class_weight='balanced')
model.fit(X_train_scaled, y_train)

# Evaluate
y_pred = model.predict(X_test_scaled)
print("Fraud Detection Model Report:")
print(classification_report(y_test, y_pred))

# Save model 
joblib.dump(model, 'models/fraud_model.pkl')
joblib.dump(scaler, 'models/scaler.pkl')
print("Model saved! Ready for FastAPI.")