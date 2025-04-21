import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-container">
      <div className="about-wrapper">
        <h1>About <span className="brand-name">StrokePredict</span></h1>

        {/* Introduction */}
        <p className="intro">
          <strong>StrokePredict</strong> is a powerful AI-driven platform designed to help individuals assess their risk of stroke using personalized health data and intelligent machine learning algorithms. Our mission is to empower proactive health decisions and increase stroke awareness globally.
        </p>

        {/* Mission & Vision */}
        <div className="about-section">
          <h2>🚀 Our Mission & Vision</h2>
          <p>
            Our mission is to enable early detection of stroke risk by providing accessible and accurate risk assessments through technology. We envision a world where individuals are equipped with insights to prevent critical health conditions before they occur.
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

        {/* Testimonials */}
        <div className="about-section">
          <h2>🗣️ What Users Are Saying</h2>
          <p><em>“StrokePredict gave me peace of mind and helped me understand my risk. It’s easy, fast, and reliable.”</em> — <strong>Aman T.</strong></p>
          <p><em>“This tool made me rethink my health habits. The visual feedback is super helpful!”</em> — <strong>Sarah K.</strong></p>
        </div>

        {/* Call to Action */}
        <div className="about-section call-to-action">
          <h2>📬 Ready to Take Control of Your Health?</h2>
          <p>
            Start assessing your stroke risk today. <a href="/predict">Make your first prediction</a> or <a href="/signup">create an account</a> to save your history. Your health is your wealth—let's protect it together.
          </p>
        </div>

        {/* How It Works + Tech Stack */}
        <div className="about-section">
          <h2>🔬 How It Works</h2>
          <ul>
            <li>Secure login with Firebase Authentication.</li>
            <li>User enters data like age, glucose level, and BMI.</li>
            <li>A trained Random Forest model calculates the stroke risk.</li>
            <li>Predictions are visualized and stored for future reference.</li>
          </ul>
        </div>

        <div className="about-section">
          <h2>🛠️ Tech Stack</h2>
          <p>
            Built with <strong>React</strong> (frontend), <strong>Flask</strong> (backend), and integrated with <strong>Firebase</strong> for authentication and history tracking. The model uses real-world stroke data sourced from <em>Kaggle</em>.
          </p>
        </div>

        {/* Disclaimer */}
        <div className="about-section disclaimer">
          <h2>⚠️ Disclaimer</h2>
          <p>
            StrokePredict is an informational tool and does not replace professional medical advice or diagnosis. Always consult with a qualified healthcare provider for health-related concerns.
          </p>
        </div>

        {/* Footer Tagline */}
        <div className="about-footer">
          <p><strong>Stay informed. Stay proactive. Prioritize your health. 💙</strong></p>
        </div>
      </div>
    </div>
  );
};

export default About;
