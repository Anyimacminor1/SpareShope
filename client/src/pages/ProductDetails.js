import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, CardMedia, Button, Box, Chip, Grid, Paper } from "@mui/material";
import { useCart } from "../context/CartContext";
import API_BASE_URL from '../api';

function getImage(product) {
  if (product.imageUrl) return product.imageUrl;
  if (product.model === "Defender") return "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop";
  if (product.model === "Series") return "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=600&h=400&fit=crop";
  if (product.model === "Discovery") return "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&h=400&fit=crop";
  if (product.model === "Range Rover") return "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=600&h=400&fit=crop";
  return "/placeholder.png";
}

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <Typography align="center">Loading...</Typography>;
  if (!product) return <Typography align="center">Product not found.</Typography>;

  return (
    <Box maxWidth={800} mx="auto" my={4}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <CardMedia
              component="img"
              height="420"
              image={getImage(product)}
              alt={product.name}
              sx={{ borderRadius: 2, objectFit: 'cover', background: '#eee' }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }}>{product.name}</Typography>
              {product.model && <Chip label={product.model} color="primary" sx={{ fontWeight: 600 }} />}
              {product.year && <Chip label={product.year} sx={{ background: '#d4a017', color: '#1a3c34', fontWeight: 600 }} />}
            </Box>
            <Typography variant="body1" sx={{ mb: 2 }}>{product.description}</Typography>
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
            <Typography variant="h5" sx={{ color: 'primary.main', fontWeight: 700, mb: 2 }}>
              ${product.price}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>Stock: {product.stock ?? 'N/A'}</Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ mt: 2, px: 4, py: 1.5, fontSize: '1.1rem' }}
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </Button>
            <Button
              component={Link}
              to="/catalog"
              variant="text"
              sx={{ mt: 2, ml: 2 }}
            >
              Back to Catalog
            </Button>
          </Grid>
        </Grid>
      </Paper>
      {/* Related parts placeholder */}
      <Box mt={6}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Related Parts (coming soon)
        </Typography>
      </Box>
    </Box>
  );
} 