import React, { useEffect, useState } from "react";
import { Typography, Grid, Card, CardContent, CardMedia, TextField, MenuItem, Box, Button, Chip, Paper, InputAdornment, Snackbar, Alert } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import API_BASE_URL from '../api';

const modelOptions = ["All", "Defender", "Series", "Discovery", "Range Rover"];
const yearOptions = ["All", "1948-1985", "1986-2000", "2001-2015", "2016-2025"];

export default function Catalog() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [model, setModel] = useState("All");
  const [year, setYear] = useState("All");
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  const filtered = products.filter((p) => {
    const matchesModel = model === "All" || (p.model && p.model === model);
    const matchesYear = year === "All" || (p.year && p.year === year);
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesModel && matchesYear && matchesSearch;
  });

  const getImage = (product) => {
    if (product.imageUrl) return product.imageUrl;
    // Fallback Unsplash image by model
    if (product.model === "Defender") return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop";
    if (product.model === "Series") return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop";
    if (product.model === "Discovery") return "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=300&fit=crop";
    if (product.model === "Range Rover") return "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=400&h=300&fit=crop";
    return "/placeholder.png";
  };

  return (
    <Box>
      <Typography variant="h3" align="center" sx={{ mb: 4, fontWeight: 700, color: 'primary.main' }}>
        Parts Catalog
      </Typography>
      <Paper sx={{ display: 'flex', gap: 2, mb: 4, p: 2, flexWrap: 'wrap', justifyContent: 'center', alignItems: 'center' }} elevation={2}>
        <TextField
          select
          label="Model"
          value={model}
          onChange={e => setModel(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          {modelOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
        </TextField>
        <TextField
          select
          label="Year"
          value={year}
          onChange={e => setYear(e.target.value)}
          sx={{ minWidth: 150 }}
        >
          {yearOptions.map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
        </TextField>
        <TextField
          label="Search"
          value={search}
          onChange={e => setSearch(e.target.value)}
          sx={{ minWidth: 220 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
          Added to cart! Go to the menu and select 'Cart' to view your items.
        </Alert>
      </Snackbar>
      {loading ? (
        <Typography align="center">Loading...</Typography>
      ) : (
        <Grid container spacing={4}>
          {filtered.length === 0 ? (
            <Grid item xs={12}><Typography align="center">No parts found.</Typography></Grid>
          ) : (
            filtered.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <Card
                  component={Link}
                  to={`/product/${product.id}`}
                  sx={{
                    textDecoration: 'none',
                    color: 'inherit',
                    transition: 'box-shadow 0.2s',
                    boxShadow: 2,
                    border: '1px solid #d4a017',
                    borderRadius: 3,
                    '&:hover': { boxShadow: 6, borderColor: '#1a3c34', transform: 'translateY(-4px)' }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="260"
                    image={getImage(product)}
                    alt={product.name}
                    sx={{ objectFit: 'cover', background: '#eee', borderRadius: 2 }}
                  />
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                      {product.model && <Chip label={product.model} size="small" sx={{ background: '#1a3c34', color: '#fff' }} />}
                      {product.year && <Chip label={product.year} size="small" sx={{ background: '#d4a017', color: '#1a3c34' }} />}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {product.description}
                    </Typography>
                    {product.compatibility && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <b>Compatibility:</b> {product.compatibility}
                      </Typography>
                    )}
                    {product.partNumber && (
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        <b>Part #:</b> {product.partNumber}
                      </Typography>
                    )}
                    <Typography variant="subtitle1" sx={{ color: 'primary.main', fontWeight: 700, mb: 1 }}>
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {product.stock ?? 'N/A'}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{ mt: 2, width: '100%' }}
                      onClick={e => { e.preventDefault(); addToCart(product); setSnackbarOpen(true); }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}
    </Box>
  );
} 