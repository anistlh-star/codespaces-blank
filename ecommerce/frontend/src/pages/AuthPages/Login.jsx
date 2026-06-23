// ecommerce/frontend/src/pages/AuthPages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import "./Auth.css"; // shared CSS file

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await login(email, password);
      if (!result.success) {
        throw new Error(result.message || "Login failed");
      }
      navigate("/");
    } catch (err) {
      setError(err.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h2 className="auth-page__title">Sign in</h2>
        <p className="auth-page__subtitle">Welcome back! Please enter your details.</p>

        {error && <div className="auth-page__error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-page__form">
          <div className="auth-page__field">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="auth-page__input"
              required
              autoComplete="email"
              autoFocus
            />
            <label className="auth-page__label">Email address</label>
          </div>

          <div className="auth-page__field">
            <input
              type="password"
              placeholder=" "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-page__input"
              required
              autoComplete="current-password"
            />
            <label className="auth-page__label">Password</label>
          </div>

          <div className="auth-page__actions">
            <Link to="/forgot-password" className="auth-page__forgot-link">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="auth-page__button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-page__spinner-container">
                <span className="auth-page__spinner"></span>
                Signing in...
              </span>
            ) : (
              "Sign in"
            )}
          </button>
        </form>

        <div className="auth-page__footer">
          Don't have an account?{" "}
          <Link to="/register" className="auth-page__link">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;