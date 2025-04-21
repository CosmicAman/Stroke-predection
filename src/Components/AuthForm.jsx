import React, { useState } from "react";
import { auth } from "../auth/firebaseConfig";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import "./AuthForm.css";

const AuthForm = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        onAuthSuccess(userCredential.user);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        // ✅ Set display name after sign-up
        await userCredential.user.updateProfile({
          displayName: email.split('@')[0],  // or use actual name input if available
        });

        // ✅ Trigger app state update
        onAuthSuccess({
          ...userCredential.user,
          displayName: email.split('@')[0],
        });

      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please try again.");
    }
  };

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || "Google Sign-In failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-info">
        <h1>Stroke Prediction System</h1>
        <p>
          Welcome to the Stroke Prediction System — a machine learning-powered web application
          that helps users assess their risk of stroke based on various health parameters.
        </p>
        <p>
          ✨ Built using React, Firebase, and Python (Random Forest Model), our system ensures
          security, accuracy, and a user-friendly experience.
        </p>
        <p>
          🧠 Login to access the prediction tool, track history, and explore insights from your health data.
        </p>
      </div>

      <div className="auth-form-container">
        <div className="auth-form">
          <h2>{isLogin ? "Sign In" : "Create Account"}</h2>

          {error && <div className="auth-form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="auth-form-group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="auth-form-button">
              {isLogin ? "Sign In" : "Sign Up"}
            </button>
          </form>

          <div className="auth-form-divider">
            <span>Or</span>
          </div>

          <button onClick={handleGoogleSignIn} className="auth-google-button">
            Sign in with Google <img className="google-logo" src="google logo.svg" alt="Google" />
          </button>

          <div className="auth-form-toggle">
            <a href="#" onClick={toggleMode}>
              {isLogin ? "Need an account? Sign Up" : "Already have an account? Sign In"}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
