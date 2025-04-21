import { useEffect, useState } from "react";
import AuthForm from "./Components/AuthForm";
import PredictionForm from "./Components/PredictionForm";
import Navbar from "./Components/Navbar";
import Home from "./Components/Home";
import History from "./Components/History";
import About from "./Components/About";
import ModelMetrics from "./Components/ModelMetrics"; // ✅ Import this component
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./auth/firebaseConfig";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState("home");

  // 🔐 Keep user logged in after refresh & prevent flicker
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setUser(authUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);

  const handleNavigation = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <Home onNavigate={handleNavigation} user={user} />;
      case "predict":
        return <PredictionForm user={user} />;
      case "metrics":
        return <ModelMetrics />; // ✅ Added this line
      case "history":
        return <History user={user} />;
      case "about":
        return <About />;
      default:
        return <Home onNavigate={handleNavigation} user={user} />;
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {user ? (
        <>
          <Navbar onNavigate={handleNavigation} user={user} setUser={setUser} />
          {renderPage()}
        </>
      ) : (
        <AuthForm onAuthSuccess={setUser} />
      )}
    </div>
  );
}

export default App;
