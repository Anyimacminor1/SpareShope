import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Avatar,
  Divider,
  CircularProgress,
  TextField,
  Button,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import LandRoverLogo from "../logo.svg";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from '../api';

export default function Profile() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);
  const [pwForm, setPwForm] = useState({ current: '', new: '', confirm: '' });
  const [pwLoading, setPwLoading] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');

  useEffect(() => {
    if (user && user.token) {
      setLoading(true);
      fetch(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
        .then((res) => res.json())
        .then((data) => setOrders(data))
        .finally(() => setLoading(false));
    }
  }, [user]);

  const handlePwChange = (e) => setPwForm({ ...pwForm, [e.target.name]: e.target.value });
  const handlePwSubmit = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    if (pwForm.new !== pwForm.confirm) {
      setPwError('New passwords do not match');
      setPwLoading(false);
      return;
    }
    try {
      const token = user?.token || localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/users/me/password`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ current: pwForm.current, new: pwForm.new }),
      });
      if (!res.ok) throw new Error('Failed to change password');
      setPwSuccess('Password changed successfully!');
      setPwForm({ current: '', new: '', confirm: '' });
      setPwOpen(false);
    } catch (err) {
      setPwError(err.message || 'Failed to change password');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f4f6f8">
      <Card sx={{ maxWidth: 500, width: "100%", boxShadow: 6, borderRadius: 3 }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <img src={LandRoverLogo} alt="Land Rover" style={{ width: 60, marginBottom: 8 }} />
            <Avatar sx={{ width: 72, height: 72, mb: 1, bgcolor: "primary.main", fontSize: 32 }}>
              {user?.name ? user.name[0].toUpperCase() : user?.email?.[0]?.toUpperCase() || "U"}
            </Avatar>
            <Typography variant="h5" fontWeight={700} color="primary.main" gutterBottom>
              {user?.name || user?.email || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
            {user?.whatsapp && (
              <Typography variant="body2" color="text.secondary">
                WhatsApp: {user.whatsapp}
              </Typography>
            )}
            <Typography variant="body2" color="text.secondary" mb={2}>
              Role: {user?.role || "user"}
            </Typography>
            <Button variant="outlined" color="primary" sx={{ mt: 1 }} onClick={() => setPwOpen(true)}>
              Change Password
            </Button>
          </Box>
          {pwSuccess && <Alert severity="success" sx={{ mb: 2 }}>{pwSuccess}</Alert>}
          {pwError && <Alert severity="error" sx={{ mb: 2 }}>{pwError}</Alert>}
          <Dialog open={pwOpen} onClose={() => setPwOpen(false)}>
            <DialogTitle>Change Password</DialogTitle>
            <DialogContent>
              <Box component="form" onSubmit={handlePwSubmit} sx={{ mt: 1, minWidth: 320 }}>
                <TextField
                  margin="normal"
                  fullWidth
                  label="Current Password"
                  name="current"
                  type="password"
                  value={pwForm.current}
                  onChange={handlePwChange}
                  required
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="New Password"
                  name="new"
                  type="password"
                  value={pwForm.new}
                  onChange={handlePwChange}
                  required
                />
                <TextField
                  margin="normal"
                  fullWidth
                  label="Confirm New Password"
                  name="confirm"
                  type="password"
                  value={pwForm.confirm}
                  onChange={handlePwChange}
                  required
                />
                <DialogActions sx={{ px: 0 }}>
                  <Button onClick={() => setPwOpen(false)}>Cancel</Button>
                  <Button type="submit" variant="contained" disabled={pwLoading}>
                    {pwLoading ? "Saving..." : "Save"}
                  </Button>
                </DialogActions>
              </Box>
            </DialogContent>
          </Dialog>
          <Divider sx={{ mb: 2 }} />
          <Typography variant="h6" fontWeight={600} gutterBottom>
            Order History
          </Typography>
          {loading ? (
            <Box display="flex" justifyContent="center" my={3}>
              <CircularProgress />
            </Box>
          ) : orders.length === 0 ? (
            <Typography color="text.secondary">No orders yet.</Typography>
          ) : (
            <List>
              {orders.map((order) => (
                <ListItem key={order.id} sx={{ borderRadius: 2, mb: 1, bgcolor: "#f9fafb", boxShadow: 1 }}>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <span>Order #{order.id}</span>
                        <Typography variant="subtitle2" color="primary.main">${order.total}</Typography>
                      </Box>
                    }
                    secondary={`Status: ${order.status}`}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </CardContent>
      </Card>
    </Box>
  );
} 