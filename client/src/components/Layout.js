import React, { useState, useEffect } from "react";
import {
  AppBar, Toolbar, Typography, Button, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Container, Grid, Link as MuiLink, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import BuildIcon from "@mui/icons-material/Build";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import DirectionsCarFilledIcon from "@mui/icons-material/DirectionsCarFilled";
import EditIcon from "@mui/icons-material/Edit";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from '../api';

export default function Layout({ children }) {
  const { user, logout, updateProfile } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: user?.name || '', email: user?.email || '', whatsapp: user?.whatsapp || '' });
  const [editError, setEditError] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const navigate = useNavigate();
  const [contactInfo, setContactInfo] = useState(null);

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, to: "/" },
    { text: "Catalog", icon: <BuildIcon />, to: "/catalog" },
    { text: "Cart", icon: <ShoppingCartIcon />, to: "/cart" },
    { text: "Contact", icon: <ContactMailIcon />, to: "/contact" },
  ];

  // Profile edit handlers (placeholder, needs backend API)
  const handleEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditLoading(true);
    try {
      const token = user?.token || localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editForm.name, whatsapp: editForm.whatsapp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      updateProfile(data);
      setEditOpen(false);
    } catch (err) {
      setEditError(err.message || "Failed to update profile");
    } finally {
      setEditLoading(false);
    }
  };

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/contact-info`)
      .then(res => res.json())
      .then(setContactInfo);
  }, []);

  // Listen for contact info updates from other components
  useEffect(() => {
    const handleContactInfoUpdate = () => {
      fetch(`${API_BASE_URL}/api/contact-info`)
        .then(res => res.json())
        .then(setContactInfo);
    };

    window.addEventListener('contactInfoUpdated', handleContactInfoUpdate);
    return () => window.removeEventListener('contactInfoUpdated', handleContactInfoUpdate);
  }, []);

  return (
    <>
      {/* Header / AppBar */}
      <AppBar position="sticky" elevation={2} sx={{ background: '#1a3c34' }}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: 'inline-flex', md: 'none' } }}
            onClick={() => setDrawerOpen(true)}
          >
            {/* Modern hamburger icon: three parallel lines */}
            <Box sx={{ width: 28, height: 28, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '5px' }}>
              <Box sx={{ height: 3, bgcolor: 'white', borderRadius: 2 }} />
              <Box sx={{ height: 3, bgcolor: 'white', borderRadius: 2 }} />
              <Box sx={{ height: 3, bgcolor: 'white', borderRadius: 2 }} />
            </Box>
          </IconButton>
          <DirectionsCarFilledIcon sx={{ fontSize: 32, mr: 1, color: '#d4a017' }} />
          <Typography
            variant="h5"
            sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1, cursor: 'pointer' }}
            onClick={() => navigate("/")}
          >
            SpareShope
          </Typography>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {menuItems.map((item) => (
              <Button key={item.text} color="inherit" component={Link} to={item.to} startIcon={item.icon}>
                {item.text}
              </Button>
            ))}
            {user ? (
              <>
                <Button color="inherit" onClick={() => setEditOpen(true)} startIcon={<AccountCircleIcon />}>Profile</Button>
                <Button color="inherit" onClick={logout} startIcon={<LogoutIcon />}>Logout</Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={Link} to="/login" startIcon={<LoginIcon />}>Login</Button>
                <Button color="inherit" component={Link} to="/register" startIcon={<PersonAddIcon />}>Register</Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      {/* Drawer for mobile menu */}
      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, pt: 2 }} role="presentation" onClick={() => setDrawerOpen(false)}>
          {/* Profile section in drawer */}
          {user && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
              <Avatar sx={{ width: 56, height: 56, mb: 1, bgcolor: 'primary.main', fontSize: 28 }}>
                {(user?.name && user.name[0]) ? user.name[0].toUpperCase()
                  : (user?.email && user.email[0]) ? user.email[0].toUpperCase()
                  : "?"}
              </Avatar>
              <Typography variant="subtitle1" fontWeight={700}>{user.name}</Typography>
              <Typography variant="body2" color="text.secondary">{user.email}</Typography>
              {user.whatsapp && <Typography variant="body2" color="text.secondary">WhatsApp: {user.whatsapp}</Typography>}
              <Button size="small" startIcon={<EditIcon />} sx={{ mt: 1, mb: 1 }} onClick={e => { e.stopPropagation(); setEditOpen(true); }}>Edit Profile</Button>
            </Box>
          )}
          <List>
            {menuItems.map((item) => (
              <ListItem button key={item.text} component={Link} to={item.to}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
            {user ? (
              <>
                <ListItem button onClick={logout}>
                  <ListItemIcon><LogoutIcon /></ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={Link} to="/login">
                  <ListItemIcon><LoginIcon /></ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={Link} to="/register">
                  <ListItemIcon><PersonAddIcon /></ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
      {/* Profile Edit Modal */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleEditSubmit} sx={{ mt: 1, minWidth: 320 }}>
            <TextField
              margin="normal"
              fullWidth
              label="Name"
              name="name"
              value={editForm.name}
              onChange={handleEditChange}
              required
            />
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              name="email"
              value={editForm.email}
              onChange={handleEditChange}
              required
              disabled
            />
            <TextField
              margin="normal"
              fullWidth
              label="WhatsApp Number"
              name="whatsapp"
              value={editForm.whatsapp}
              onChange={handleEditChange}
            />
            {editError && <Typography color="error" sx={{ mt: 1 }}>{editError}</Typography>}
            <DialogActions sx={{ px: 0 }}>
              <Button onClick={() => setEditOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" disabled={editLoading}>
                {editLoading ? "Saving..." : "Save"}
              </Button>
            </DialogActions>
          </Box>
        </DialogContent>
      </Dialog>
      {/* Main Content */}
      <Container sx={{ mt: 4, mb: 4, minHeight: '60vh' }}>{children}</Container>
      {/* Footer */}
      <Box component="footer" sx={{ background: '#1a3c34', color: '#fff', py: 6, mt: 8 }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DirectionsCarFilledIcon sx={{ fontSize: 32, mr: 1, color: '#d4a017' }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>SpareShope</Typography>
              </Box>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Your trusted source for Land Rover parts. Quality, expertise, and fast delivery worldwide.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <IconButton color="inherit" component="a" href="#" aria-label="Facebook"><FacebookIcon /></IconButton>
                <IconButton color="inherit" component="a" href="#" aria-label="Instagram"><InstagramIcon /></IconButton>
                <IconButton color="inherit" component="a" href="#" aria-label="Twitter"><TwitterIcon /></IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Quick Links</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <MuiLink component={Link} to="/catalog" color="inherit" underline="hover">Catalog</MuiLink>
                <MuiLink component={Link} to="/cart" color="inherit" underline="hover">Cart</MuiLink>
                <MuiLink component={Link} to="/contact" color="inherit" underline="hover">Contact</MuiLink>
                <MuiLink component={Link} to="/profile" color="inherit" underline="hover">Profile</MuiLink>
                <MuiLink component={Link} to="/admin" color="inherit" underline="hover">Admin</MuiLink>
              </Box>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h6" sx={{ mb: 2 }}>Contact</Typography>
              <Typography variant="body2">Email: {contactInfo?.email || 'support@spareshop.com'}</Typography>
              <Typography variant="body2">Phone: {contactInfo?.phone || '+1 234 567 8901'}</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>{contactInfo?.address || '123 Land Rover Ave, London, UK'}</Typography>
              <Typography variant="body2" sx={{ mt: 2 }}>{contactInfo?.hours || 'Mon-Fri: 9:00 AM - 6:00 PM\nSat: 10:00 AM - 4:00 PM'}</Typography>
            </Grid>
          </Grid>
          <Box sx={{ textAlign: 'center', mt: 4, color: '#d4a017' }}>
            <Typography variant="body2">© {new Date().getFullYear()} SpareShope. All rights reserved.</Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
} 