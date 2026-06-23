// ecommerce/frontend/src/pages/AuthPages/Register.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../../api";
import "./Auth.css"; // shared CSS file

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      await API.post("/auth/register", { name, email, password });
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed. Please try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__container">
        <h2 className="auth-page__title">Create account</h2>
        <p className="auth-page__subtitle">Join us to explore premium collections.</p>

        {error && <div className="auth-page__error">{error}</div>}
        {success && <div className="auth-page__success">{success}</div>}

        <form onSubmit={handleSubmit} className="auth-page__form">
          <div className="auth-page__field">
            <input
              type="text"
              placeholder=" "
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              className="auth-page__input"
              required
              minLength={2}
              autoComplete="name"
            />
            <label className="auth-page__label">Full name</label>
          </div>

          <div className="auth-page__field">
            <input
              type="email"
              placeholder=" "
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="auth-page__input"
              required
              autoComplete="email"
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
              minLength={6}
              autoComplete="new-password"
            />
            <label className="auth-page__label">Password</label>
          </div>

          <button
            type="submit"
            className="auth-page__button"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="auth-page__spinner-container">
                <span className="auth-page__spinner"></span>
                Creating account...
              </span>
            ) : (
              "Sign up"
            )}
          </button>
        </form>

        <div className="auth-page__footer">
          Already have an account?{" "}
          <Link to="/login" className="auth-page__link">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;