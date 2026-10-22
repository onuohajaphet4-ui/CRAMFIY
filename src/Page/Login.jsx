import { useState } from "react";
import { Eye, EyeOff, Brain } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
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
        "https://cramfiy.onrender.com/api/auth/login",
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
       localStorage.setItem("user", JSON.stringify(data.user));
       console.log(data.user)


      navigate("/hub");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="floating-icon icon-1">📚</div>
      <div className="floating-icon icon-2">📝</div>
      <div className="floating-icon icon-3">🧠</div>

      <div className="login-card">

        <div className="login-left">

          <div className="logo-box">
            <Brain size={35} />
          </div>

          <h1>Welcome Back</h1>

          <p>
            Continue turning your notes into knowledge.
          </p>

          <form onSubmit={handleSubmit}>

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
                {showPassword
                  ? <EyeOff size={18} />
                  : <Eye size={18} />
                }
              </button>

            </div>

            <button
              type="submit"
              className="loginn-btn"
            >
              {
                loading
                  ? "Logging in..."
                  : "Login"
              }
            </button>

          </form>

          <p className="signup-text">
            New here?{" "}
            <Link to="/signup">
              Create Account
            </Link>
          </p>

        </div>

        <div className="login-right">

          <div className="preview-card">
            <h3>📄 Biology Notes</h3>

            <div className="arrow">
              ↓
            </div>

            <h3>🧠 AI Summary</h3>

            <div className="arrow">
              ↓
            </div>

            <h3>📚 Flashcards</h3>

            <div className="arrow">
              ↓
            </div>

            <h3>🎯 Quiz Ready</h3>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;