import { useState } from "react";
import { Eye, EyeOff, Brain } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        "http://localhost:5000/api/auth/signup",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      localStorage.setItem("token", data.token);

      navigate("/dashboard");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">

      <div className="floating-icon icon-1">📚</div>
      <div className="floating-icon icon-2">✨</div>
      <div className="floating-icon icon-3">🧠</div>

      <div className="signup-card">

        <div className="signup-left">

          <div className="logo-box">
            <Brain size={35} />
          </div>

          <h1>Create Account</h1>

          <p>
            Start studying smarter with AI.
          </p>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <div className="password-field">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {
                  showPassword
                    ? <EyeOff size={18}/>
                    : <Eye size={18}/>
                }
              </button>

            </div>

            <button
              className="signup-btn"
              type="submit"
            >
              {
                loading
                  ? "Creating Account..."
                  : "Create Account"
              }
            </button>

          </form>

          <p className="login-text">
            Already have an account?{" "}
            <Link to="/log">
              Login
            </Link>
          </p>

        </div>

        <div className="signup-right">

          <div className="preview-card">

            <h3>📄 Upload Notes</h3>

            <div className="arrow">↓</div>

            <h3>🧠 AI Summary</h3>

            <div className="arrow">↓</div>

            <h3>📚 Flashcards</h3>

            <div className="arrow">↓</div>

            <h3>🎯 Ace Exams</h3>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Signup;