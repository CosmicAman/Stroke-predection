import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./ModelMetrics.css";

const COLORS = ["#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#e91e63"];

const API_BASE_URL = "http://127.0.0.1:5000";

const ModelMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`${API_BASE_URL}/metrics`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.error);
        }

        setMetrics(data);
      } catch (err) {
        console.error("Error fetching metrics:", err);
        setError(err.message || "Failed to fetch metrics. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading metrics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h3>Error Loading Metrics</h3>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="error-container">
        <h3>No Data Available</h3>
        <p>Unable to load metrics data. Please try again later.</p>
      </div>
    );
  }

  // Prepare data for charts using backend metrics
  const performanceMetrics = [
    { name: "Accuracy", value: metrics.accuracy },
    { name: "Precision", value: metrics.precision },
    { name: "Recall", value: metrics.recall },
    { name: "F1-Score", value: metrics.f1_score },
    { name: "Specificity", value: metrics.specificity },
    { name: "AUC", value: metrics.auc },
  ];

  // Calculate confusion matrix metrics
  const total = metrics.confusion_matrix.tn + metrics.confusion_matrix.fp + 
                metrics.confusion_matrix.fn + metrics.confusion_matrix.tp;
  
  const confusionMatrixData = [
    { 
      name: "True Negative", 
      value: metrics.confusion_matrix.tn,
      percentage: ((metrics.confusion_matrix.tn / total) * 100).toFixed(2),
      description: "Correctly predicted no stroke"
    },
    { 
      name: "False Positive", 
      value: metrics.confusion_matrix.fp,
      percentage: ((metrics.confusion_matrix.fp / total) * 100).toFixed(2),
      description: "Incorrectly predicted stroke"
    },
    { 
      name: "False Negative", 
      value: metrics.confusion_matrix.fn,
      percentage: ((metrics.confusion_matrix.fn / total) * 100).toFixed(2),
      description: "Missed stroke prediction"
    },
    { 
      name: "True Positive", 
      value: metrics.confusion_matrix.tp,
      percentage: ((metrics.confusion_matrix.tp / total) * 100).toFixed(2),
      description: "Correctly predicted stroke"
    }
  ];

  // Prepare ROC curve data from backend
  const rocCurveData = metrics.roc_curve.fpr.map((fpr, index) => ({
    fpr: fpr,
    tpr: metrics.roc_curve.tpr[index]
  }));

  // Generate precision-recall curve data
  const precisionRecallData = Array.from({ length: 20 }, (_, i) => {
    const threshold = i * 0.05;
    const predictedPositive = metrics.confusion_matrix.tp + metrics.confusion_matrix.fp;
    const actualPositive = metrics.confusion_matrix.tp + metrics.confusion_matrix.fn;
    const truePositives = Math.round(actualPositive * threshold);
    const falsePositives = Math.round(predictedPositive * (1 - threshold));
    
    const precision = truePositives / (truePositives + falsePositives || 1);
    const recall = truePositives / actualPositive;
    const f1 = (2 * precision * recall) / (precision + recall || 1);
    
    return {
      threshold: threshold,
      precision: precision,
      recall: recall,
      f1: f1
    };
  });

  return (
    <div className="metrics-container">
      <h2>📊 Model Performance Metrics</h2>

      {/* Performance Metrics Chart */}
      <div className="chart-container">
        <h3>Model Performance Metrics</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={performanceMetrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 1]} />
            <Tooltip
              formatter={(value) => (value * 100).toFixed(2) + "%"}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px",
              }}
            />
            <Bar dataKey="value" fill="#4caf50">
              {performanceMetrics.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Model Metrics Heatmap */}
      <div className="chart-container">
        <h3>Model Metrics Heatmap</h3>
        <div className="metrics-heatmap-container">
          <div className="heatmap-header">
            <h4>Performance Metrics Distribution</h4>
            <div className="heatmap-legend">
              <div className="legend-item">
                <span className="legend-color" style={{ background: 'linear-gradient(to right, #ff4444, #ffbb33, #00C851)' }}></span>
                <span>Performance Scale</span>
              </div>
            </div>
          </div>
          
          <div className="metrics-heatmap">
            <div className="heatmap-labels">
              <div className="heatmap-label-row">
                <span className="label-header">Metrics</span>
                {performanceMetrics.map(metric => (
                  <span key={metric.name}>{metric.name}</span>
                ))}
              </div>
            </div>
            
            <div className="heatmap-grid">
              {performanceMetrics.map((metric, index) => (
                <div 
                  key={metric.name}
                  className="heatmap-cell"
                  style={{
                    backgroundColor: `rgba(${
                      metric.value > 0.8 ? '0, 200, 81' : 
                      metric.value > 0.6 ? '255, 187, 51' : '255, 68, 68'
                    }, ${metric.value})`,
                    color: metric.value > 0.6 ? '#2c3e50' : 'white'
                  }}
                >
                  <div className="cell-content">
                    <span className="cell-value">{(metric.value * 100).toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="heatmap-scale">
            <span>0%</span>
            <div className="scale-gradient"></div>
            <span>100%</span>
          </div>
        </div>
      </div>

      {/* ROC Curve */}
      <div className="chart-container">
        <h3>ROC Curve (AUC: {(metrics.auc * 100).toFixed(2)}%)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={rocCurveData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="fpr"
              type="number"
              domain={[0, 1]}
              label={{ value: "False Positive Rate", position: "bottom" }}
            />
            <YAxis
              type="number"
              domain={[0, 1]}
              label={{ value: "True Positive Rate", angle: -90, position: "left" }}
            />
            <Tooltip
              formatter={(value) => value.toFixed(3)}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px",
              }}
            />
            <Line
              type="monotone"
              dataKey="tpr"
              stroke="#4caf50"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              data={[{ fpr: 0, tpr: 0 }, { fpr: 1, tpr: 1 }]}
              stroke="#9e9e9e"
              strokeDasharray="5 5"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Precision-Recall Curve */}
      <div className="chart-container">
        <h3>Precision-Recall Curve</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={precisionRecallData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="recall"
              type="number"
              domain={[0, 1]}
            />
            <YAxis
              type="number"
              domain={[0, 1]}
              label={{ value: "Precision", angle: -90, position: "left" }}
            />
            <Tooltip
              formatter={(value) => Number(value).toFixed(3)}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                border: "1px solid #ccc",
                borderRadius: "4px",
                padding: "10px",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="precision"
              name="Precision"
              stroke="#2196f3"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="f1"
              name="F1-Score"
              stroke="#ff9800"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Confusion Matrix */}
      <div className="chart-container">
        <h3>Confusion Matrix</h3>
        <div className="confusion-matrix-container">
          <div className="confusion-matrix-grid">
            <div className="confusion-matrix-cell true-negative" 
                 style={{
                   background: `linear-gradient(135deg, rgba(76, 175, 80, ${metrics.confusion_matrix.tn / total}), rgba(76, 175, 80, 0.1))`
                 }}>
              <h4>True Negative</h4>
              <p className="value">{metrics.confusion_matrix.tn}</p>
              <p className="percentage">({((metrics.confusion_matrix.tn / total) * 100).toFixed(2)}%)</p>
              <p className="description">Correctly predicted no stroke</p>
              <div className="cell-tooltip">
                <p>Actual: No Stroke</p>
                <p>Predicted: No Stroke</p>
                <p>Accuracy: {((metrics.confusion_matrix.tn / (metrics.confusion_matrix.tn + metrics.confusion_matrix.fp)) * 100).toFixed(2)}%</p>
              </div>
            </div>
            <div className="confusion-matrix-cell false-positive"
                 style={{
                   background: `linear-gradient(135deg, rgba(244, 67, 54, ${metrics.confusion_matrix.fp / total}), rgba(244, 67, 54, 0.1))`
                 }}>
              <h4>False Positive</h4>
              <p className="value">{metrics.confusion_matrix.fp}</p>
              <p className="percentage">({((metrics.confusion_matrix.fp / total) * 100).toFixed(2)}%)</p>
              <p className="description">Incorrectly predicted stroke</p>
              <div className="cell-tooltip">
                <p>Actual: No Stroke</p>
                <p>Predicted: Stroke</p>
                <p>Type I Error</p>
              </div>
            </div>
            <div className="confusion-matrix-cell false-negative"
                 style={{
                   background: `linear-gradient(135deg, rgba(244, 67, 54, ${metrics.confusion_matrix.fn / total}), rgba(244, 67, 54, 0.1))`
                 }}>
              <h4>False Negative</h4>
              <p className="value">{metrics.confusion_matrix.fn}</p>
              <p className="percentage">({((metrics.confusion_matrix.fn / total) * 100).toFixed(2)}%)</p>
              <p className="description">Missed stroke prediction</p>
              <div className="cell-tooltip">
                <p>Actual: Stroke</p>
                <p>Predicted: No Stroke</p>
                <p>Type II Error</p>
              </div>
            </div>
            <div className="confusion-matrix-cell true-positive"
                 style={{
                   background: `linear-gradient(135deg, rgba(76, 175, 80, ${metrics.confusion_matrix.tp / total}), rgba(76, 175, 80, 0.1))`
                 }}>
              <h4>True Positive</h4>
              <p className="value">{metrics.confusion_matrix.tp}</p>
              <p className="percentage">({((metrics.confusion_matrix.tp / total) * 100).toFixed(2)}%)</p>
              <p className="description">Correctly predicted stroke</p>
              <div className="cell-tooltip">
                <p>Actual: Stroke</p>
                <p>Predicted: Stroke</p>
                <p>Sensitivity: {((metrics.confusion_matrix.tp / (metrics.confusion_matrix.tp + metrics.confusion_matrix.fn)) * 100).toFixed(2)}%</p>
              </div>
            </div>
          </div>
          <div className="confusion-matrix-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: "#4caf50" }}></span>
              <span>Correct Predictions</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: "#f44336" }}></span>
              <span>Incorrect Predictions</span>
            </div>
          </div>
          <div className="confusion-matrix-summary">
            <p>Total Predictions: {total}</p>
            <p>Overall Accuracy: {((metrics.confusion_matrix.tp + metrics.confusion_matrix.tn) / total * 100).toFixed(2)}%</p>
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="metrics-table-container">
        <h3>Detailed Metrics</h3>
        <table className="metrics-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            {performanceMetrics.map((metric, index) => (
              <tr key={index}>
                <td>{metric.name}</td>
                <td>{metric.value.toFixed(4)}</td>
                <td>{(metric.value * 100).toFixed(2)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ModelMetrics;

