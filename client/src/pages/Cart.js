import React from "react";
import { useCart } from "../context/CartContext";
import {
  Typography,
  IconButton,
  Button,
  Box,
  Grid,
  Paper,
  CardMedia,
  TextField,
  Divider,
  Snackbar,
  Alert
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import API_BASE_URL from '../api';

export default function Cart() {
  const { cart, removeFromCart, clearCart, getTotal, updateQty } = useCart();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleQtyChange = (item, value) => {
    updateQty(item.id, Math.max(1, Math.min(Number(value), item.stock ?? Infinity)), item.stock);
  };

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // Map cart items to required format
      const items = cart.map(item => ({
        productId: item.id,
        quantity: item.qty,
        price: item.price
      }));
      const total = getTotal();
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : undefined,
        },
        body: JSON.stringify({ items, total }),
      });
      if (!res.ok) throw new Error("Failed to submit order");
      setSnackbarMsg("Order submitted! Admins have been notified. You will be contacted soon.");
      setSnackbarOpen(true);
      clearCart();
    } catch (err) {
      setSnackbarMsg(err.message || "Failed to submit order");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth={900} mx="auto" my={4}>
      <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}>
        Shopping Cart
      </Typography>
      {cart.length === 0 ? (
        <Typography align="center">Your cart is empty.</Typography>
      ) : (
        <>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
              {snackbarMsg}
            </Alert>
          </Snackbar>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 2 }}>
                {cart.map((item) => (
                  <Box key={item.id} sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <CardMedia
                      component="img"
                      image={item.imageUrl || "/placeholder.png"}
                      alt={item.name}
                      sx={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 2, background: '#eee', mr: 2 }}
                    />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6">{item.name}</Typography>
                      <Typography variant="body2" color="text.secondary">${item.price} each</Typography>
                    </Box>
                    <TextField
                      type="number"
                      size="small"
                      value={item.qty}
                      onChange={e => handleQtyChange(item, e.target.value)}
                      inputProps={{ min: 1, max: item.stock ?? undefined, style: { width: 50, textAlign: 'center' } }}
                      sx={{ mx: 2 }}
                    />
                    <IconButton edge="end" color="error" onClick={() => removeFromCart(item.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ))}
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>Order Summary</Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Subtotal</Typography>
                  <Typography>${getTotal().toFixed(2)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Shipping</Typography>
                  <Typography>Free</Typography>
                </Box>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="h6">Total</Typography>
                  <Typography variant="h6">${getTotal().toFixed(2)}</Typography>
                </Box>
                <Button variant="contained" color="success" size="large" fullWidth sx={{ mt: 2 }} onClick={handleCheckout} disabled={loading}>
                  {loading ? "Submitting..." : "Checkout"}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
} 