import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../auth/firebaseConfig";
import "./History.css";

// Charts
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const History = ({ user }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    if (!user) return;

    try {
      const historyRef = collection(db, "predictions", user.uid, "history");
      const q = query(historyRef, orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistory(data);
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [user]);

  const handleDeleteAll = async () => {
    const confirm = window.confirm("Are you sure you want to delete all history?");
    if (!confirm || !user) return;

    try {
      const historyRef = collection(db, "predictions", user.uid, "history");
      const querySnapshot = await getDocs(historyRef);

      const deletePromises = querySnapshot.docs.map((docItem) =>
        deleteDoc(doc(db, "predictions", user.uid, "history", docItem.id))
      );

      await Promise.all(deletePromises);
      setHistory([]); // Clear UI
    } catch (error) {
      console.error("Error deleting history:", error);
    }
  };

  const handleDeleteEntry = async (entryId) => {
    const confirm = window.confirm("Delete this entry?");
    if (!confirm || !user) return;

    try {
      await deleteDoc(doc(db, "predictions", user.uid, "history", entryId));
      setHistory((prev) => prev.filter((entry) => entry.id !== entryId));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  if (!user) return <p className="history-info">Please log in to view your history.</p>;
  if (loading) return <p className="history-info">Loading prediction history...</p>;

  return (
    <div className="history-container">
      <div className="history-header">
        <h2>Prediction History</h2>
        {history.length > 0 && (
          <button className="delete-button" onClick={handleDeleteAll}>
            Delete All
          </button>
        )}
      </div>

      {history.length === 0 ? (
        <p className="history-info">No predictions found yet.</p>
      ) : (
        <div className="history-grid">
          {history.map((entry) => {
            const confidence = parseFloat(entry.confidence) || 0;
            const riskData = [
              { 
                name: "Confidence", 
                value: confidence,
                fill: "#0088FE"
              },
              { 
                name: "Risk Level", 
                value: entry.result === 1 ? 75 : 25,
                fill: entry.result === 1 ? "#FF8042" : "#00C49F"
              }
            ];

            return (
              <div key={entry.id} className="history-card">
                <div className="history-card-header">
                  <p><strong>Date:</strong> {new Date(entry.timestamp).toLocaleString()}</p>
                  <button 
                    className="delete-entry-button"
                    onClick={() => handleDeleteEntry(entry.id)}
                    title="Delete this entry"
                  >
                    <img src="delete.png" alt="" />
                  </button>
                </div>

                <p><strong>Risk:</strong> {entry.result === 1 ? "Stroke Risk ⚠️" : "No Risk ✅"}</p>
                <p><strong>Confidence:</strong> {confidence}%</p>
                {entry.risk_category && (
                  <div className="risk-category-info">
                    <p><strong>Category:</strong> {entry.risk_category.category || 'Unknown'}</p>
                    <p><strong>Description:</strong> {entry.risk_category.description || 'No description available'}</p>
                    <p><strong>Recommendation:</strong> {entry.risk_category.recommendation || 'No recommendation available'}</p>
                  </div>
                )}

                <div className="mini-chart">
                  <h4>Risk Breakdown</h4>
                  <ResponsiveContainer width="100%" height={350}>
                    <PieChart margin={{ top: 20, right: 50, left: 50, bottom: 60 }}>
                      <Pie
                        data={riskData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="45%"
                        outerRadius={70}
                        innerRadius={25}
                        paddingAngle={2}
                        label={({ name, value }) => {
                          const label = `${name}: ${value}%`;
                          return label.length > 15 ? `${name}\n${value}%` : label;
                        }}
                        labelLine={{ stroke: '#666', strokeWidth: 1 }}
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value}%`, 'Value']}
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          padding: '8px'
                        }}
                      />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        layout="horizontal"
                        align="center"
                        wrapperStyle={{
                          paddingTop: '20px',
                          fontSize: '12px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
