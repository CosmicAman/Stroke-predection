import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-wrapper">
        <h1>About <span className="brand-name">StrokePredict</span></h1>

        {/* Introduction */}
        <p className="intro">
          <strong>StrokePredict</strong> is an advanced AI-powered platform that provides personalized stroke risk assessment using machine learning. Our system analyzes multiple health factors including age, hypertension, heart disease, glucose levels, BMI, and smoking status to deliver accurate risk predictions with detailed insights.
        </p>

        {/* Mission & Vision */}
        <div className="about-section">
          <h2>🚀 Our Mission & Vision</h2>
          <p>
            Our mission is to provide accessible and accurate stroke risk assessment through advanced machine learning technology. We aim to help individuals understand their health risks and make informed decisions about their well-being.
          </p>
        </div>

        {/* Brand Story */}
        <div className="about-section">
          <h2>📖 Our Story</h2>
          <p>
            StrokePredict was born out of a passion for preventive healthcare and data science. Our journey began with a research project analyzing stroke-related data. Recognizing the power of AI in early diagnosis, we transformed our findings into a full-fledged application aimed at saving lives.
          </p>
        </div>

        {/* Core Values */}
        <div className="about-section">
          <h2>💡 Core Values</h2>
          <ul>
            <li><strong>Empathy:</strong> We care deeply about our users and their well-being.</li>
            <li><strong>Accuracy:</strong> We are committed to precision and data integrity.</li>
            <li><strong>Transparency:</strong> We openly communicate how our tools work and how your data is used.</li>
            <li><strong>Innovation:</strong> We embrace new technology to improve healthcare outcomes.</li>
          </ul>
        </div>

        {/* Team Highlights */}
        <div className="about-section">
          <h2>👩‍💻 Meet the Team</h2>
          <p>
            Our team consists of data scientists, developers, and healthcare advocates united by a shared goal: using AI to improve lives. From model development to UX design, each member brings unique expertise to the table.
            {/* Optionally include team headshots here */}
          </p>
        </div>

        {/* Unique Selling Proposition */}
        <div className="about-section">
          <h2>🌟 Why Choose StrokePredict?</h2>
          <p>
            Unlike generic health apps, StrokePredict provides real-time stroke risk prediction backed by a machine learning model trained on actual stroke patient data. Our interactive dashboard, intuitive UI, and personalized history tracking make health monitoring smarter and simpler.
          </p>
        </div>

        {/* How It Works */}
        <div className="about-section">
          <h2>🔬 How It Works</h2>
          <ul>
            <li><strong>Data Input:</strong> Enter your health metrics including age, hypertension status, heart disease history, glucose levels, BMI, and smoking status.</li>
            <li><strong>Advanced Analysis:</strong> Our Random Forest model processes your data through multiple health risk factors.</li>
            <li><strong>Risk Assessment:</strong> Get a detailed risk prediction with confidence intervals and specific risk factors identified.</li>
            <li><strong>Personalized Insights:</strong> Receive a comprehensive breakdown of your risk factors and their individual contributions.</li>
          </ul>
        </div>

        {/* Risk Categories */}
        <div className="about-section">
          <h2>📊 Risk Categories</h2>
          <ul>
            <li><strong>Very Low Risk:</strong> Minimal stroke risk detected - Maintain healthy lifestyle</li>
            <li><strong>Low Risk:</strong> Slight stroke risk detected - Monitor health indicators regularly</li>
            <li><strong>Medium Risk:</strong> Moderate stroke risk detected - Regular medical check-ups recommended</li>
            <li><strong>High Risk:</strong> Significant stroke risk detected - Immediate medical consultation recommended</li>
          </ul>
        </div>

        {/* Key Features */}
        <div className="about-section">
          <h2>🌟 Key Features</h2>
          <ul>
            <li><strong>Comprehensive Analysis:</strong> Evaluates multiple health factors including age, hypertension, heart disease, glucose levels, BMI, and smoking status</li>
            <li><strong>Confidence Intervals:</strong> Provides 95% confidence intervals for predictions</li>
            <li><strong>Risk Factor Breakdown:</strong> Detailed explanation of individual risk factors and their contributions</li>
            <li><strong>Secure Authentication:</strong> Protected user accounts with Firebase Authentication</li>
            <li><strong>History Tracking:</strong> Save and monitor your risk assessments over time</li>
          </ul>
        </div>

        {/* Tech Stack */}
        <div className="about-section">
          <h2>🛠️ Technical Implementation</h2>
          <p>
            Built with modern technologies including:
          </p>
          <ul>
            <li><strong>Frontend:</strong> React.js with responsive design</li>
            <li><strong>Backend:</strong> Flask API with advanced machine learning integration</li>
            <li><strong>Authentication:</strong> Firebase Authentication for secure user management</li>
            <li><strong>Machine Learning:</strong> Random Forest model with SMOTE for balanced predictions</li>
            <li><strong>Data Processing:</strong> Advanced feature engineering and data normalization</li>
          </ul>
        </div>

        {/* Model Performance */}
        <div className="about-section">
          <h2>📈 Model Performance</h2>
          <p>
            Our machine learning model is trained on comprehensive stroke data and provides:
          </p>
          <ul>
            <li>High accuracy in risk prediction</li>
            <li>Balanced sensitivity and specificity</li>
            <li>Detailed feature importance analysis</li>
            <li>ROC curve analysis for model evaluation</li>
          </ul>
        </div>

        {/* Call to Action */}
        <div className="about-section call-to-action">
          <h2>📬 Ready to Assess Your Risk?</h2>
          <p>
            Start your personalized stroke risk assessment today. <a href="/predict">Make your first prediction</a> or <a href="/signup">create an account</a> to track your health journey.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="about-section disclaimer">
          <h2>⚠️ Important Disclaimer</h2>
          <p>
            StrokePredict is designed as an informational tool and should not replace professional medical advice or diagnosis. Always consult with qualified healthcare providers for medical decisions and concerns.
          </p>
        </div>

        {/* Footer Tagline */}
        <div className="about-footer">
          <p><strong>Empowering health decisions through technology. 💙</strong></p>
        </div>
      </div>
    </div>
  );
};

export default About;
