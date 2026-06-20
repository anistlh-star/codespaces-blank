//ecommerce/frontend/src/pages/Misc/ForgotPassword.jsx
import { useState } from "react";
import axios from "axios";

import { Link } from "react-router-dom";
import API from "../../../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await API.post("/password/request", {
        email,
      });
      setMessage(data.message);
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

return (
    <div className="forgotpassword-container">
        <div className="card">
            <h2 className="title">Reset Password</h2>
            <p className="subtitle">
                Enter your email address and we'll send you a link to reset your
                password.
            </p>

            {message && <div className="success">{message}</div>}
            {error && <div className="error">{error}</div>}

            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label className="label">Email Address</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input"
                        placeholder="Enter your email"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`button ${loading ? "button-disabled" : ""}`}
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>
            </form>

            <div className="links">
                <Link to="/login" className="link">
                    Back to Login
                </Link>
            </div>
        </div>
    </div>
);
}
export default ForgotPassword;
