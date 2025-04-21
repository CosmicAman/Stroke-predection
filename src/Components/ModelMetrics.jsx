import React, { useEffect, useState } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

import "./ModelMetrics.css"

// Register required Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const ModelMetrics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/metrics")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          throw new Error(data.error);
        }
        setMetrics(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching metrics:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="loading-message">Loading metrics...</p>;
  if (error) return <p className="error-message"> <img className="error-message-img" src="shy.png"></img>Opps {error} Data.</p>;
  if (!metrics) return <p className="error-message"> No metrics data availabl</p>;

  return (
    <div className="metrics-container">
      <h2>📊 Model Performance Metrics</h2>

      <div className="chart-container">
        <Bar
          data={{
            labels: ["Accuracy", "Precision", "Recall", "F1-Score", "AUC"],
            datasets: [
              {
                label: "Score",
                data: [
                  metrics.accuracy,
                  metrics.precision,
                  metrics.recall,
                  metrics.f1_score,
                  metrics.auc,
                ],
                backgroundColor: ["#4caf50", "#2196f3", "#ff9800", "#9c27b0", "#e91e63"],
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 16,
                  },
                },
              },
              tooltip: {
                bodyFont: {
                  size: 16,
                },
                titleFont: {
                  size: 18,
                },
              },
              title: {
                display: false,
              },
            },
            scales: {
              x: {
                ticks: {
                  font: {
                    size: 16,
                  },
                },
              },
              y: {
                beginAtZero: true,
                max: 1,
                ticks: {
                  font: {
                    size: 16,
                  },
                },
              },
            },
          }}
          
        />
      </div>

      <h3>🧮 Confusion Matrix</h3>
      <div className="chart-container doughnut-chart">
        <Doughnut
          data={{
            labels: ["True Negative", "False Positive", "False Negative", "True Positive"],
            datasets: [
              {
                data: [
                  metrics.confusion_matrix?.tn || 0,
                  metrics.confusion_matrix?.fp || 0,
                  metrics.confusion_matrix?.fn || 0,
                  metrics.confusion_matrix?.tp || 0,
                ],
                backgroundColor: ["#4caf50", "#f44336", "#ff9800", "#2196f3"],
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                labels: {
                  font: {
                    size: 16,
                  },
                },
              },
              tooltip: {
                bodyFont: {
                  size: 16,
                },
                titleFont: {
                  size: 18,
                },
              },
            },
          }}
          
        />
      </div>
    </div>
  );
};

export default ModelMetrics;
