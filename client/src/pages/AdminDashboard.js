import React, { useState, useEffect } from "react";
import {
  Typography,
  Tabs,
  Tab,
  Box,
  List,
  ListItem,
  ListItemText,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  MenuItem,
  Card,
  CardContent,
  Paper,
  Divider,
  Chip,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import LandRoverLogo from "../logo.svg";
import ImageIcon from '@mui/icons-material/Image';
import API_BASE_URL from '../api';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [resetRequests, setResetRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', model: '', year: '', compatibility: '', partNumber: '' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [search, setSearch] = useState("");
  const superAdminEmails = ["ofecaleb2@gmail.com", "anyimac86@gmail.com"];

  useEffect(() => {
    if (user?.token && user?.role === "admin") {
      fetch(`${API_BASE_URL}/api/products`).then(res => res.json()).then(setProducts);
      fetch(`${API_BASE_URL}/api/users`, { headers: { Authorization: `Bearer ${user.token}` } }).then(res => res.json()).then(setUsers);
      fetch(`${API_BASE_URL}/api/orders`, { headers: { Authorization: `Bearer ${user.token}` } }).then(res => res.json()).then(setOrders);
      fetch(`${API_BASE_URL}/api/forgot-password-requests`, { headers: { Authorization: `Bearer ${user.token}` } }).then(res => res.json()).then(setResetRequests);
      fetch(`${API_BASE_URL}/api/contact-messages`, { headers: { Authorization: `Bearer ${user.token}` } }).then(res => res.json()).then(setContactMessages).catch(err => console.error('Error fetching contact messages:', err));
    }
  }, [user]);

  const handleOpen = (product = null) => {
    setEditProduct(product);
    setForm(product ? { ...product } : { name: '', description: '', price: '', stock: '', model: '', year: '', compatibility: '', partNumber: '' });
    setImageFile(null);
    setImagePreview(product?.imageUrl || null);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    setImagePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSave = async () => {
    const method = editProduct ? 'PUT' : 'POST';
    const url = editProduct ? `${API_BASE_URL}/api/products/${editProduct.id}` : `${API_BASE_URL}/api/products`;
    let body;
    let headers = { Authorization: `Bearer ${user.token}` };
    if (imageFile) {
      body = new FormData();
      body.append('name', form.name);
      body.append('description', form.description);
      body.append('price', form.price);
      body.append('stock', form.stock);
      body.append('model', form.model);
      body.append('year', form.year);
      body.append('compatibility', form.compatibility);
      body.append('partNumber', form.partNumber);
      body.append('image', imageFile);
      headers = { Authorization: `Bearer ${user.token}` };
    } else {
      body = JSON.stringify(form);
      headers = { ...headers, 'Content-Type': 'application/json' };
    }
    await fetch(url, {
      method,
      headers,
      body,
    });
    fetch(`${API_BASE_URL}/api/products`).then(res => res.json()).then(setProducts);
    setOpen(false);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE_URL}/api/products/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setProducts(products.filter(p => p.id !== id));
  };

  const handleRoleChange = async (id, role) => {
    await fetch(`${API_BASE_URL}/api/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ role })
    });
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const handleDeleteUser = async (id) => {
    await fetch(`${API_BASE_URL}/api/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${user.token}` }
    });
    setUsers(users.filter(u => u.id !== id));
  };

  const handleOrderStatus = async (id, status) => {
    await fetch(`${API_BASE_URL}/api/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status })
    });
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  const handleMessageStatus = async (id, status) => {
    await fetch(`${API_BASE_URL}/api/contact-messages/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${user.token}` },
      body: JSON.stringify({ status })
    });
    setContactMessages(contactMessages.map(m => m.id === id ? { ...m, status } : m));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'paid': return 'info';
      case 'shipped': return 'primary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const filteredUsers = users
    .filter(u => {
      const emailMatch = u.email && u.email.toLowerCase().includes(search.toLowerCase());
      const nameMatch = u.name && u.name.toLowerCase().includes(search.toLowerCase());
      return emailMatch || nameMatch;
    })
    .sort((a, b) => {
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (a.role !== 'admin' && b.role === 'admin') return 1;
      if (superAdminEmails.includes(a.email) && !superAdminEmails.includes(b.email)) return -1;
      if (!superAdminEmails.includes(a.email) && superAdminEmails.includes(b.email)) return 1;
      return 0;
    });

  if (!user || !user.role || user.role !== "admin") {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="#f4f6f8">
        <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 6, borderRadius: 3 }}>
          <CardContent>
            <Alert severity="error">Admin access only.</Alert>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" bgcolor="#f4f6f8" py={3}>
      <Box maxWidth={1200} mx="auto" px={2}>
        <Card sx={{ boxShadow: 6, borderRadius: 3 }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={3}>
              <img src={LandRoverLogo} alt="Land Rover" style={{ width: 50, marginRight: 16 }} />
              <Typography variant="h4" fontWeight={700} color="primary.main">
                Admin Dashboard
              </Typography>
            </Box>
            
            <Paper sx={{ mb: 3 }}>
              <Tabs 
                value={tab} 
                onChange={(_, v) => setTab(v)} 
                sx={{ 
                  '& .MuiTab-root': { 
                    fontWeight: 600,
                    textTransform: 'none',
                    fontSize: '1rem'
                  }
                }}
              >
                <Tab label="Products" />
                <Tab label="Users" />
                <Tab label="Orders" />
                <Tab label="Contact Messages" />
                <Tab label="Password Reset Requests" />
              </Tabs>
            </Paper>

            {tab === 0 && (
              <Box>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h6" fontWeight={600}>Products Management</Typography>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<AddIcon />}
                    onClick={() => handleOpen()}
                    sx={{ fontWeight: 600 }}
                  >
                    Add Product
                  </Button>
                </Box>
                <List>
                  {products.map((p) => (
                    <ListItem 
                      key={p.id} 
                      sx={{ 
                        mb: 1, 
                        bgcolor: '#f9fafb', 
                        borderRadius: 2, 
                        boxShadow: 1 
                      }}
                      secondaryAction={
                        <Box>
                          <IconButton edge="end" onClick={() => handleOpen(p)} color="primary">
                            <EditIcon />
                          </IconButton>
                          <IconButton edge="end" onClick={() => handleDelete(p.id)} color="error">
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText 
                        primary={p.name} 
                        secondary={`$${p.price} | Stock: ${p.stock}`} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {tab === 1 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={3}>User Management</Typography>
                <TextField
                  label="Search Users"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  fullWidth
                  sx={{ mb: 2 }}
                />
                <List>
                  {filteredUsers.map((u) => (
                    <ListItem 
                      key={u.id} 
                      sx={{ mb: 1, bgcolor: '#f9fafb', borderRadius: 2, boxShadow: 1 }}
                      secondaryAction={
                        <Box display="flex" alignItems="center">
                          <TextField
                            select
                            value={u.role}
                            onChange={e => handleRoleChange(u.id, e.target.value)}
                            size="small"
                            sx={{ width: 120, mr: 1 }}
                            disabled={u.email && superAdminEmails.includes(u.email)}
                          >
                            <MenuItem value="user">User</MenuItem>
                            <MenuItem value="admin">Admin</MenuItem>
                          </TextField>
                          <IconButton edge="end" onClick={() => handleDeleteUser(u.id)} color="error" disabled={u.email && superAdminEmails.includes(u.email)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      }
                    >
                      <ListItemText 
                        primary={u.email || u.phone || 'No contact info'} 
                        secondary={
                          <Box display="flex" alignItems="center" gap={1}>
                            <Chip label={u.role} size="small" color={u.role === 'admin' ? 'primary' : 'default'} />
                            {u.email && superAdminEmails.includes(u.email) && <Chip label="Super Admin" size="small" color="secondary" />}
                            {user.email && superAdminEmails.includes(user.email) && u.email && !superAdminEmails.includes(u.email) && (
                              <Button size="small" variant="outlined" sx={{ ml: 1 }} onClick={() => {
                                const userInfo = {
                                  ID: u.id,
                                  Name: u.name,
                                  Email: u.email,
                                  Phone: u.phone || 'Not provided',
                                  WhatsApp: u.whatsapp || 'Not provided',
                                  Role: u.role,
                                  Created: new Date(u.createdAt).toLocaleString(),
                                  Updated: new Date(u.updatedAt).toLocaleString()
                                };
                                alert(Object.entries(userInfo).map(([key, value]) => `${key}: ${value}`).join('\n'));
                              }}>
                                View Info
                              </Button>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {tab === 2 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={3}>Order Management</Typography>
                <List>
                  {orders.map((o) => (
                    <ListItem 
                      key={o.id}
                      sx={{ 
                        mb: 1, 
                        bgcolor: '#f9fafb', 
                        borderRadius: 2, 
                        boxShadow: 1 
                      }}
                    >
                      <ListItemText 
                        primary={`Order #${o.id}`} 
                        secondary={
                          <Box>
                            <Typography variant="body2">Total: ${o.total}</Typography>
                            {o.User && (
                              <>
                                <Typography variant="body2" color="text.secondary">Name: {o.User.name}</Typography>
                                <Typography variant="body2" color="text.secondary">Email: {o.User.email}</Typography>
                                <Typography variant="body2" color="text.secondary">Phone: {o.User.phone}</Typography>
                              </>
                            )}
                            <Typography variant="caption" color="text.secondary">
                              {new Date(o.createdAt).toLocaleString()}
                            </Typography>
                          </Box>
                        }
                      />
                      <Box display="flex" alignItems="center" gap={1}>
                        <Chip 
                          label={o.status} 
                          color={getStatusColor(o.status)}
                          size="small"
                        />
                        <TextField
                          select
                          value={o.status}
                          onChange={e => handleOrderStatus(o.id, e.target.value)}
                          size="small"
                          sx={{ width: 140 }}
                        >
                          <MenuItem value="pending">Pending</MenuItem>
                          <MenuItem value="paid">Paid</MenuItem>
                          <MenuItem value="shipped">Shipped</MenuItem>
                          <MenuItem value="completed">Completed</MenuItem>
                          <MenuItem value="cancelled">Cancelled</MenuItem>
                        </TextField>
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}

            {tab === 3 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={3}>Contact Messages</Typography>
                <List>
                  {contactMessages.length === 0 ? (
                    <ListItem><ListItemText primary="No messages." /></ListItem>
                  ) : (
                    contactMessages.map((msg) => (
                      <ListItem key={msg.id} sx={{ mb: 1, bgcolor: '#f9fafb', borderRadius: 2, boxShadow: 1 }}
                        secondaryAction={
                          <Box display="flex" alignItems="center" gap={1}>
                            <TextField
                              select
                              value={msg.status}
                              onChange={e => handleMessageStatus(msg.id, e.target.value)}
                              size="small"
                              sx={{ width: 140 }}
                            >
                              <MenuItem value="pending">Pending</MenuItem>
                              <MenuItem value="reviewed">Reviewed</MenuItem>
                              <MenuItem value="responded">Responded</MenuItem>
                            </TextField>
                          </Box>
                        }
                      >
                        <ListItemText 
                          primary={`${msg.name} (${msg.email})`} 
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary" mb={1}>
                                Phone: {msg.phone}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" mb={1}>
                                {msg.message}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(msg.createdAt).toLocaleString()}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            )}

            {tab === 4 && (
              <Box>
                <Typography variant="h6" fontWeight={600} mb={2}>Password Reset Requests</Typography>
                <List>
                  {resetRequests.length === 0 ? (
                    <ListItem><ListItemText primary="No requests." /></ListItem>
                  ) : (
                    resetRequests.map((req) => (
                      <ListItem key={req.id} sx={{ mb: 1, bgcolor: '#f9fafb', borderRadius: 2, boxShadow: 1 }}
                        secondaryAction={
                          req.status === 'pending' && (
                            <Button variant="contained" color="success" size="small" onClick={async () => {
                              await fetch(`${API_BASE_URL}/api/forgot-password-requests/${req.id}/process`, {
                                method: 'PUT',
                                headers: { Authorization: `Bearer ${user.token}` }
                              });
                              setResetRequests(resetRequests.map(r => r.id === req.id ? { ...r, status: 'processed' } : r));
                            }}>Mark as Processed</Button>
                          )
                        }
                      >
                        <ListItemText primary={req.identifier} secondary={`Status: ${req.status}`} />
                      </ListItem>
                    ))
                  )}
                </List>
              </Box>
            )}
          </CardContent>
        </Card>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>
            {editProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent>
            <TextField 
              label="Name" 
              name="name" 
              value={form.name} 
              onChange={handleChange} 
              fullWidth 
              sx={{ mb: 2 }} 
            />
            <TextField 
              label="Description" 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              fullWidth 
              multiline
              rows={3}
              sx={{ mb: 2 }} 
            />
            <TextField 
              label="Price" 
              name="price" 
              type="number" 
              value={form.price} 
              onChange={handleChange} 
              fullWidth 
              sx={{ mb: 2 }} 
            />
            <TextField 
              label="Stock" 
              name="stock" 
              type="number" 
              value={form.stock} 
              onChange={handleChange} 
              fullWidth 
              sx={{ mb: 2 }} 
            />
            <TextField 
              label="Model" 
              name="model" 
              value={form.model} 
              onChange={handleChange} 
              fullWidth 
              sx={{ mb: 2 }} 
            />
            <TextField 
              label="Year" 
              name="year" 
              value={form.year} 
              onChange={handleChange} 
              fullWidth 
              sx={{ mb: 2 }} 
            />
            <TextField 
              label="Compatibility" 
              name="compatibility" 
              value={form.compatibility} 
              onChange={handleChange} 
              fullWidth 
              sx={{ mb: 2 }} 
            />
            <TextField 
              label="Part Number" 
              name="partNumber" 
              value={form.partNumber} 
              onChange={handleChange} 
              fullWidth 
              sx={{ mb: 2 }} 
            />
            <Box sx={{ mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                startIcon={<ImageIcon />}
                fullWidth
              >
                {imageFile ? imageFile.name : 'Upload Image'}
                <input type="file" accept="image/*" hidden onChange={handleImageChange} />
              </Button>
              {imagePreview && (
                <Box mt={2} display="flex" justifyContent="center">
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: 180, maxHeight: 180, borderRadius: 8 }} />
                </Box>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ fontWeight: 600 }}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  );
} 