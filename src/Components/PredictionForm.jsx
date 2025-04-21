import React, { useState, useEffect } from "react";
import "./PredictionForm.css";
import { db, auth } from "../auth/firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#00C49F", "#FFBB28", "#0088FE", "#FF8042"];

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    gender: "",
    age: "",
    hypertension: "",
    heart_disease: "",
    ever_married: "",
    work_type: "",
    Residence_type: "",
    avg_glucose_level: "",
    bmi: "",
    smoking_status: "",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    return Object.values(formData).every((value) => value !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setErrorMsg("");
    setPrediction(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setPrediction(data);

      // Save prediction to Firestore if user is logged in
      try {
        const user = auth.currentUser;
        if (user) {
          const userHistoryRef = doc(db, "predictions", user.uid);
          const timestamp = new Date();
          
          await setDoc(userHistoryRef, {
            lastPrediction: {
              ...data,
              timestamp: timestamp.toISOString()
            }
          }, { merge: true });
      
          const historyRef = doc(
            db,
            "predictions",
            user.uid,
            "history",
            timestamp.getTime().toString()
          );
          await setDoc(historyRef, {
            ...formData,
            ...data,
            timestamp: timestamp.toISOString()
          });
        }
      } catch (firestoreError) {
        console.error("Firestore write error:", firestoreError);
      }
      
    } finally {
      setLoading(false);
    }
  };

  // Data for Charts
  const riskData = [
    { name: "Confidence", value: prediction ? prediction.confidence : 0 },
    { name: "Risk Level", value: prediction ? (prediction.result ? 75 : 25) : 0 },
  ];

  const factorsData = [
    { name: "Age", value: formData.age ? parseInt(formData.age) : 0 },
    { name: "Glucose", value: formData.avg_glucose_level ? parseFloat(formData.avg_glucose_level) : 0 },
    { name: "BMI", value: formData.bmi ? parseFloat(formData.bmi) : 0 },
  ];

  return (
    <div className="prediction-container">
      <div className="prediction-header">
        <h1>Stroke Risk Prediction</h1>
        <p className="subtitle">Enter your health information to assess potential stroke risk factors</p>
      </div>

      <div className="prediction-content">
        <div className="form-section">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="gender">Gender</label>
                <select id="gender" name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="age">Age</label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  placeholder="Enter Age"
                  value={formData.age}
                  onChange={handleChange}
                  min="0"
                  max="120"
                />
              </div>

              <div className="form-group">
                <label htmlFor="hypertension">Hypertension</label>
                <select id="hypertension" name="hypertension" value={formData.hypertension} onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="heart_disease">Heart Disease</label>
                <select id="heart_disease" name="heart_disease" value={formData.heart_disease} onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="0">No</option>
                  <option value="1">Yes</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ever_married">Marital Status</label>
                <select id="ever_married" name="ever_married" value={formData.ever_married} onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="Yes">Married</option>
                  <option value="No">Not Married</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="work_type">Work Type</label>
                <select id="work_type" name="work_type" value={formData.work_type} onChange={handleChange}>
                  <option value="">Select Work Type</option>
                  <option value="Private">Private</option>
                  <option value="Self-employed">Self-employed</option>
                  <option value="Govt_job">Government Job</option>
                  <option value="children">Children</option>
                  <option value="Never_worked">Never Worked</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="Residence_type">Residence Type</label>
                <select id="Residence_type" name="Residence_type" value={formData.Residence_type} onChange={handleChange}>
                  <option value="">Select Type</option>
                  <option value="Urban">Urban</option>
                  <option value="Rural">Rural</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="avg_glucose_level">Glucose Level</label>
                <input
                  type="number"
                  id="avg_glucose_level"
                  name="avg_glucose_level"
                  placeholder="Average Glucose Level"
                  value={formData.avg_glucose_level}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bmi">BMI</label>
                <input
                  type="number"
                  id="bmi"
                  name="bmi"
                  placeholder="Body Mass Index"
                  value={formData.bmi}
                  onChange={handleChange}
                  min="0"
                  step="0.1"
                />
              </div>

              <div className="form-group">
                <label htmlFor="smoking_status">Smoking Status</label>
                <select id="smoking_status" name="smoking_status" value={formData.smoking_status} onChange={handleChange}>
                  <option value="">Select Status</option>
                  <option value="formerly smoked">Formerly Smoked</option>
                  <option value="never smoked">Never Smoked</option>
                  <option value="smokes">Currently Smokes</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>
            </div>

            {errorMsg && <div className="error-message">{errorMsg}</div>}

            <div className="submit-container">
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Analyzing..." : "Predict Stroke Risk"}
              </button>
            </div>
          </form>
        </div>

        {prediction && (
          <div className="results-section">
            <div className="result-header">
              <div className={`result-status ${prediction.result === 1 ? "high-risk" : "low-risk"}`}>
                <span className="result-icon">
                  {prediction.result === 1 ? "⚠️" : "✅"}
                </span>
                <h2>
                  {prediction.result === 1
                    ? "Stroke Risk Detected"
                    : "No Significant Stroke Risk"}
                </h2>
              </div>
              
              <div className="result-stats">
                <div className="stat-item">
                  <span className="stat-label">Confidence:</span>
                  <span className="stat-value">{prediction.confidence}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Risk Category:</span>
                  <span className="stat-value">{prediction.risk_category}</span>
                </div>
              </div>
            </div>

            <div className="charts-container">
              <div className="chart-box">
                <h3>📊 Key Health Factors</h3>
                <div className="chart-wrapper">
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={factorsData} barSize={40}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="url(#colorUv)" radius={[8, 8, 0, 0]} />
                      <defs>
                        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.9} />
                          <stop offset="95%" stopColor="#81C784" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-box">
                <h3>🌀 Risk Breakdown</h3>
                <div className="chart-wrapper">
                <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={riskData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, value }) => `${name}: ${Math.round(value)}%`}
                        >
                          {riskData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => `${Math.round(value)}%`} />
                        <Legend />
                      </PieChart>
                  </ResponsiveContainer>


                </div>
              </div>
            </div>

            <div className="disclaimer-section">
              <h4>⚠️ Disclaimer</h4>
              <p>
                StrokePredict is an educational and informational tool only. It is not a substitute 
                for professional medical diagnosis, advice, or treatment. Always consult a licensed 
                physician for medical concerns.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionForm;