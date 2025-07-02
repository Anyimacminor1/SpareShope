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

export default function Register({ onRegister }) {
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const payload = { name: form.name, password: form.password };
      if (form.email) payload.email = form.email;
      if (form.phone) payload.phone = form.phone;
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");
      navigate("/"); // Redirect to home after registration
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
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              Join SpareShope for Land Rover parts
            </Typography>
          </Box>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
              autoComplete="name"
            />
            <TextField
              label="Email (Optional)"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              autoComplete="email"
              helperText="Either email or phone number is required"
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              fullWidth
              required
              sx={{ mb: 2 }}
              autoComplete="new-password"
            />
            <TextField
              label="Phone Number (Optional)"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              fullWidth
              sx={{ mb: 2 }}
              autoComplete="tel"
              helperText="Either email or phone number is required"
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
              {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
            </Button>
          </form>
          <Box display="flex" justifyContent="flex-end" mt={1}>
            <Typography variant="body2" color="text.secondary" mr={0.5}>
              Already have an account?
            </Typography>
            <Link href="#" underline="hover" onClick={() => navigate("/login")}>Login</Link>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
} 