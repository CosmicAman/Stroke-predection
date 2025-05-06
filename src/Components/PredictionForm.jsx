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

  const [prediction, setPrediction] = useState(() => {
    // Initialize prediction from localStorage if available
    const savedPrediction = localStorage.getItem('strokePrediction');
    return savedPrediction ? JSON.parse(savedPrediction) : null;
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [validationErrors, setValidationErrors] = useState({});

  const validateNumericalInput = (name, value) => {
    const numValue = parseFloat(value);
    switch (name) {
      case "age":
        return numValue >= 0 && numValue <= 120;
      case "avg_glucose_level":
        return numValue >= 50 && numValue <= 300;
      case "bmi":
        return numValue >= 10 && numValue <= 50;
      default:
        return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Check for empty fields
    Object.entries(formData).forEach(([key, value]) => {
      if (!value) {
        errors[key] = "This field is required";
        isValid = false;
      }
    });

    // Validate numerical inputs
    if (formData.age && !validateNumericalInput("age", formData.age)) {
      errors.age = "Age must be between 0 and 120";
      isValid = false;
    }
    if (formData.avg_glucose_level && !validateNumericalInput("avg_glucose_level", formData.avg_glucose_level)) {
      errors.avg_glucose_level = "Glucose level must be between 50 and 300 mg/dL";
      isValid = false;
    }
    if (formData.bmi && !validateNumericalInput("bmi", formData.bmi)) {
      errors.bmi = "BMI must be between 10 and 50";
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  };

  const getRiskFactors = (data) => {
    const factors = [];
    if (parseInt(data.age) > 60) factors.push("Age above 60");
    if (parseInt(data.hypertension) === 1) factors.push("Hypertension");
    if (parseInt(data.heart_disease) === 1) factors.push("Heart Disease");
    if (parseFloat(data.avg_glucose_level) > 140) factors.push("High Glucose Level");
    if (parseFloat(data.bmi) > 30) factors.push("High BMI");
    if (data.smoking_status === "smokes") factors.push("Current Smoking");
    return factors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setErrorMsg("Please correct the errors in the form.");
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

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Calculate additional metrics
      const riskFactors = getRiskFactors(formData);
      const riskScore = parseFloat(data.confidence);
      
      // Enhanced prediction object with more precise data
      const enhancedPrediction = {
        ...data,
        riskFactors,
        riskScore,
        confidence: parseFloat(riskScore.toFixed(2)),
        riskCategory: data.risk_category,
        timestamp: new Date().toISOString(),
        inputData: { ...formData }
      };

      // Save prediction to localStorage
      localStorage.setItem('strokePrediction', JSON.stringify(enhancedPrediction));
      setPrediction(enhancedPrediction);

      // Save prediction to Firestore if user is logged in
      try {
        const user = auth.currentUser;
        if (user) {
          const userHistoryRef = doc(db, "predictions", user.uid);
          const timestamp = new Date();
          
          await setDoc(userHistoryRef, {
            lastPrediction: enhancedPrediction
          }, { merge: true });
      
          const historyRef = doc(
            db,
            "predictions",
            user.uid,
            "history",
            timestamp.getTime().toString()
          );
          await setDoc(historyRef, enhancedPrediction);
        }
      } catch (firestoreError) {
        console.error("Firestore write error:", firestoreError);
      }
      
    } catch (error) {
      console.error("Prediction error:", error);
      setErrorMsg("Failed to get prediction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Add a function to clear prediction
  const clearPrediction = () => {
    localStorage.removeItem('strokePrediction');
    setPrediction(null);
  };

  // Enhanced data for Charts with descriptions
  const riskData = prediction ? [
    { 
      name: "Confidence", 
      value: prediction.confidence,
      description: "Model's confidence in the prediction"
    },
    { 
      name: "Risk Level", 
      value: prediction.result ? 75 : 25,
      description: "Overall stroke risk assessment"
    },
    { 
      name: "Risk Factors", 
      value: prediction.riskFactors.length * 10,
      description: "Number of identified risk factors"
    }
  ] : [];

  const factorsData = prediction ? [
    { name: "Age", value: parseInt(prediction.inputData.age) },
    { name: "Glucose", value: parseFloat(prediction.inputData.avg_glucose_level) },
    { name: "BMI", value: parseFloat(prediction.inputData.bmi) }
  ] : [];

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
                <select 
                  id="gender" 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  className={validationErrors.gender ? "error" : ""}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {validationErrors.gender && <span className="error-message">{validationErrors.gender}</span>}
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
                  className={validationErrors.age ? "error" : ""}
                />
                {validationErrors.age && <span className="error-message">{validationErrors.age}</span>}
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
                <label htmlFor="avg_glucose_level">Glucose Level (mg/dL)</label>
                <input
                  type="number"
                  id="avg_glucose_level"
                  name="avg_glucose_level"
                  placeholder="Average Glucose Level"
                  value={formData.avg_glucose_level}
                  onChange={handleChange}
                  min="50"
                  max="300"
                  step="0.1"
                  className={validationErrors.avg_glucose_level ? "error" : ""}
                />
                {validationErrors.avg_glucose_level && <span className="error-message">{validationErrors.avg_glucose_level}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="bmi">BMI (kg/m²)</label>
                <input
                  type="number"
                  id="bmi"
                  name="bmi"
                  placeholder="Body Mass Index"
                  value={formData.bmi}
                  onChange={handleChange}
                  min="10"
                  max="50"
                  step="0.1"
                  className={validationErrors.bmi ? "error" : ""}
                />
                {validationErrors.bmi && <span className="error-message">{validationErrors.bmi}</span>}
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
              {prediction && (
                <button 
                  type="button" 
                  className="clear-button" 
                  onClick={clearPrediction}
                >
                  Clear Results
                </button>
              )}
            </div>
          </form>
        </div>

        {prediction && (
          <div className="results-section">
            <div className="result-container">
              <div className="result-header">
                <h2>Prediction Result</h2>
                <div className={`result-badge ${prediction.result === 1 ? 'high-risk' : 'low-risk'}`}>
                  {prediction.result === 1 ? 'High Risk' : 'Low Risk'}
                </div>
              </div>
              
              <div className="result-details">
                <div className="confidence-section">
                  <h3>Confidence Level</h3>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill"
                      style={{ width: `${prediction.confidence}%` }}
                    />
                  </div>
                  <p className="confidence-text">
                    {prediction.confidence}% confidence
                    {prediction.confidence_interval && (
                      <span className="confidence-interval">
                        (95% CI: {prediction.confidence_interval.lower}% - {prediction.confidence_interval.upper}%)
                      </span>
                    )}
                  </p>
                </div>

                <div className="risk-category-section">
                  <h3>Risk Assessment</h3>
                  {prediction.riskCategory && (
                    <div className={`risk-category ${prediction.riskCategory.category?.toLowerCase()}`}>
                      <h4>{prediction.riskCategory.category || 'Unknown'}</h4>
                      <p>{prediction.riskCategory.description || 'No description available'}</p>
                      <p className="recommendation">{prediction.riskCategory.recommendation || 'No recommendation available'}</p>
                    </div>
                  )}
                </div>

                {prediction.riskFactors && prediction.riskFactors.length > 0 && (
                  <div className="risk-factors-section">
                    <h3>Identified Risk Factors</h3>
                    <ul className="risk-factors-list">
                      {prediction.riskFactors.map((factor, index) => (
                        <li key={index} className="risk-factor-item">
                          {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {prediction.risk_scores && Object.keys(prediction.risk_scores).length > 0 && (
                  <div className="risk-scores-section">
                    <h3>Risk Factor Contributions</h3>
                    <div className="risk-scores-grid">
                      {Object.entries(prediction.risk_scores).map(([factor, score]) => (
                        <div key={factor} className="risk-score-item">
                          <span className="factor-name">{factor.replace('_', ' ').toUpperCase()}</span>
                          <div className="score-bar">
                            <div 
                              className="score-fill"
                              style={{ width: `${score * 100}%` }}
                            />
                          </div>
                          <span className="score-value">{Math.round(score * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
                      <Tooltip 
                        formatter={(value) => value.toFixed(2)}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '8px'
                        }}
                      />
                      <Legend />
                      <Bar 
                        dataKey="value" 
                        fill="url(#colorUv)" 
                        radius={[8, 8, 0, 0]}
                        label={{ 
                          position: 'top',
                          fill: '#666',
                          fontSize: 12
                        }}
                      />
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
                <div className="chart-description">
                  <p>This chart shows the distribution of different risk indicators:</p>
                  <ul>
                    <li><strong>Confidence:</strong> How certain the model is about its prediction</li>
                    <li><strong>Risk Level:</strong> Overall assessment of stroke risk (higher percentage indicates higher risk)</li>
                    <li><strong>Risk Factors:</strong> Number of identified risk factors present (each factor contributes 10%)</li>
                  </ul>
                </div>
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
                        label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => `${value.toFixed(2)}%`}
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="custom-tooltip">
                                <p className="tooltip-label">{data.name}</p>
                                <p className="tooltip-value">{data.value.toFixed(2)}%</p>
                                <p className="tooltip-description">{data.description}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
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