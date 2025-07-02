import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LandRoverLogo from "../logo.svg";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from '../api';

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [contactInfo, setContactInfo] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ email: '', phone: '', address: '', hours: '' });
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/contact-info`)
      .then(res => res.json())
      .then(setContactInfo);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_BASE_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to send message");
      setSent(true);
      setForm({ name: "", email: "", phone: "", message: "" });
    } catch (err) {
      setError(err.message || "Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    setEditError("");
    setEditSuccess(false);
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/contact-info`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update contact info");
      }
      const data = await res.json();
      setContactInfo(data);
      setEditSuccess(true);
      // Dispatch event to notify Layout component to refresh contact info
      window.dispatchEvent(new Event('contactInfoUpdated'));
      setTimeout(() => {
        setEditOpen(false);
        setEditSuccess(false);
      }, 1000);
    } catch (err) {
      setEditError(err.message);
    } finally {
      setEditLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" bgcolor="#f4f6f8" py={3}>
      <Box maxWidth={1200} mx="auto" px={2}>
        <Card sx={{ boxShadow: 6, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
              <img src={LandRoverLogo} alt="Land Rover" style={{ width: 60, marginBottom: 16 }} />
              <Typography variant="h4" fontWeight={700} color="primary.main" gutterBottom>
                Contact Us
              </Typography>
              <Typography variant="body1" color="text.secondary" textAlign="center">
                Get in touch with our team for any questions about Land Rover spare parts
              </Typography>
            </Box>

            {sent && (
              <Alert severity="success" sx={{ mb: 3 }}>
                Thank you! Your message has been sent successfully. Please wait up to 24 hours for admin review.
              </Alert>
            )}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            )}

            <Grid container spacing={4}>
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3, height: 'fit-content', bgcolor: '#f9fafb' }}>
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={600} mb={3} color="primary.main">
                      Get in Touch
                    </Typography>
                    {user?.role === 'admin' && (
                      <IconButton size="small" onClick={() => { setEditForm(contactInfo); setEditOpen(true); }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    )}
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <IconButton color="primary" sx={{ mr: 2 }}>
                      <EmailIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Email</Typography>
                      <Typography variant="body1">{contactInfo?.email || '...'}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <IconButton color="primary" sx={{ mr: 2 }}>
                      <PhoneIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Phone</Typography>
                      <Typography variant="body1">{contactInfo?.phone || '...'}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center" mb={2}>
                    <IconButton color="primary" sx={{ mr: 2 }}>
                      <LocationOnIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Address</Typography>
                      <Typography variant="body1">{contactInfo?.address || '...'}</Typography>
                    </Box>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <IconButton color="primary" sx={{ mr: 2 }}>
                      <AccessTimeIcon />
                    </IconButton>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Business Hours</Typography>
                      <Typography variant="body1">{contactInfo?.hours || '...'}</Typography>
                    </Box>
                  </Box>
                  <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                    <DialogTitle>Edit Contact Info</DialogTitle>
                    <DialogContent>
                      {editSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                          Contact info updated successfully!
                        </Alert>
                      )}
                      {editError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                          {editError}
                        </Alert>
                      )}
                      <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 1, minWidth: 320 }}>
                        <TextField
                          margin="normal"
                          fullWidth
                          label="Email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          required
                        />
                        <TextField
                          margin="normal"
                          fullWidth
                          label="Phone"
                          name="phone"
                          value={editForm.phone}
                          onChange={handleEditChange}
                          required
                        />
                        <TextField
                          margin="normal"
                          fullWidth
                          label="Address"
                          name="address"
                          value={editForm.address}
                          onChange={handleEditChange}
                          required
                        />
                        <TextField
                          margin="normal"
                          fullWidth
                          label="Business Hours"
                          name="hours"
                          value={editForm.hours}
                          onChange={handleEditChange}
                          required
                          multiline
                        />
                        <DialogActions sx={{ px: 0 }}>
                          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
                          <Button type="submit" variant="contained" disabled={editLoading}>
                            {editLoading ? "Saving..." : "Save"}
                          </Button>
                        </DialogActions>
                      </Box>
                    </DialogContent>
                  </Dialog>
                </Paper>
              </Grid>

              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight={600} mb={3}>
                    Send us a Message
                  </Typography>
                  
                  <form onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Your Name"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          fullWidth
                          required
                          autoComplete="name"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Your Email"
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          fullWidth
                          required
                          autoComplete="email"
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Your Phone"
                          name="phone"
                          type="tel"
                          value={form.phone}
                          onChange={handleChange}
                          fullWidth
                          required
                          autoComplete="tel"
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          label="Your Message"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          fullWidth
                          required
                          multiline
                          rows={6}
                          placeholder="Tell us about your Land Rover parts needs..."
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <Button
                          type="submit"
                          variant="contained"
                          color="primary"
                          size="large"
                          fullWidth
                          sx={{ py: 1.5, fontWeight: 600 }}
                          disabled={loading}
                        >
                          {loading ? "Sending..." : "Send Message"}
                        </Button>
                      </Grid>
                    </Grid>
                  </form>
                </Paper>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
} 