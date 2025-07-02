import React, { useState } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  Link,
} from "@mui/material";
import LandRoverLogo from "../logo.svg";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from '../api';

export default function ForgotPassword() {
  const [form, setForm] = useState({ identifier: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to submit request");
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f4f6f8">
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 6, borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <img src={LandRoverLogo} alt="Land Rover" style={{ width: 60, marginBottom: 8 }} />
            <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
              Forgot Password
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Enter your email or phone number. Your request will be reviewed by an admin within 24 hours.
            </Typography>
          </Box>
          {success ? (
            <Alert severity="success" sx={{ mb: 2 }}>
              Your request has been sent! Please wait for admin review within 24 hours.
            </Alert>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                label="Email or Phone Number"
                name="identifier"
                type="text"
                value={form.identifier}
                onChange={handleChange}
                fullWidth
                required
                sx={{ mb: 2 }}
                autoComplete="username"
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={loading}
                sx={{ mb: 1, py: 1.2, fontWeight: 600 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit Request"}
              </Button>
            </form>
          )}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Link href="#" underline="hover" onClick={() => navigate("/login")}>Back to Login</Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 