import React from "react";
import "./Home.css";

const Home = ({ onNavigate, user }) => {
  const displayName = user?.displayName || user?.email?.split("@")[0] || "User";

  return (
    <div className="home-container">
      {/* Welcome Message */}
      {user && (
        <div className="welcome-banner">
          <h2>Welcome, {user.displayName} 👋</h2>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <h1>Stroke Prediction System</h1>
        <p>Empowering early diagnosis with intelligent health analytics.</p>
        <button className="get-started-btn" onClick={() => onNavigate("predict")}>
          Get Started
        </button>
      </section>

      {/* Features */}
      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <h3>Machine Learning</h3>
            <p>Trained using Random Forest to ensure accurate stroke risk prediction.</p>
          </div>
          <div className="feature-card">
            <h3>User-Friendly Interface</h3>
            <p>Minimalistic, responsive design for ease of use on all devices.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Prediction</h3>
            <p>Instant feedback based on user health parameters.</p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <ol>
          <li>Login with your credentials.</li>
          <li>Fill out the health form with relevant details.</li>
          <li>Submit to get real-time stroke risk prediction.</li>
          <li>View past predictions in the history section.</li>
        </ol>
      </section>

      {/* Stats Section */}
      <section className="stats">
        <h2>Project Statistics</h2>
        <div className="stat-grid">
          <div>
            <h3>95%+</h3>
            <p>Model Accuracy</p>
          </div>
          <div>
            <h3>500+</h3>
            <p>Test Data Records Used</p>
          </div>
          <div>
            <h3>100%</h3>
            <p>Mobile Friendly UI</p>
          </div>
        </div>
      </section>

      {/* Project Highlights */}
      <section className="highlights">
        <h2>Project Highlights</h2>
        <ul>
          <li>Developed using <strong>React</strong> for the frontend and <strong>Flask</strong> for the backend.</li>
          <li>Implements a <strong>Random Forest Classifier</strong> for stroke prediction.</li>
          <li>Includes secure authentication and personalized history tracking.</li>
          <li>Designed with modern CSS for responsiveness and accessibility.</li>
        </ul>
      </section>

      {/* FAQ Section */}
      <section className="faq">
        <h2>FAQs</h2>
        <div className="faq-item">
          <h4>What dataset was used?</h4>
          <p>The model was trained on a publicly available stroke prediction dataset from Kaggle.</p>
        </div>
        <div className="faq-item">
          <h4>Is this tool for real medical use?</h4>
          <p>No. This is an academic project built to demonstrate machine learning in healthcare.</p>
        </div>
        <div className="faq-item">
          <h4>Can users track past predictions?</h4>
          <p>Yes. A dedicated history section displays your previous prediction data.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2025 StrokePredict | Built for Academic Purpose</p>
      </footer>
    </div>
  );
};

export default Home;
