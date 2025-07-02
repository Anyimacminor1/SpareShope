import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Container,
  Chip,
  Paper,
  useTheme
} from "@mui/material";
import {
  Build,
  LocalShipping,
  Security,
  Star,
  ArrowForward,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import API_BASE_URL from '../api';

const landRoverModels = [
  {
    name: "Defender",
    description: "Iconic off-roader with legendary capability. From Series I to modern Defender, built for adventure.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    years: "1948-2025",
    features: ["200Tdi/300Tdi Engines", "Off-road Capability", "Classic Design"],
    color: "#1a3c34"
  },
  {
    name: "Series",
    description: "The original Land Rover. Classic models from 1948–1985, perfect for restoration enthusiasts.",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    years: "1948-1985",
    features: ["Classic Design", "Restoration Parts", "Heritage"],
    color: "#8b4513"
  },
  {
    name: "Discovery",
    description: "Versatile SUV with advanced technology. From Series I to Discovery 5, family and adventure ready.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    years: "1989-2025",
    features: ["Terrain Response", "7-Seat Capacity", "Luxury Comfort"],
    color: "#2d5a4f"
  },
  {
    name: "Range Rover",
    description: "Luxury and performance combined. From Classic to Sport, the ultimate in refinement and capability.",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop",
    years: "1970-2025",
    features: ["Luxury Interior", "Advanced Tech", "Premium Performance"],
    color: "#d4a017"
  }
];

const features = [
  {
    icon: <Build sx={{ fontSize: 40 }} />,
    title: "Genuine Parts",
    description: "Authentic Land Rover parts with full warranty and quality assurance."
  },
  {
    icon: <LocalShipping sx={{ fontSize: 40 }} />,
    title: "Fast Delivery",
    description: "Quick shipping worldwide with tracking and secure packaging."
  },
  {
    icon: <Security sx={{ fontSize: 40 }} />,
    title: "Secure Shopping",
    description: "Safe and secure payment processing with buyer protection."
  },
  {
    icon: <Star sx={{ fontSize: 40 }} />,
    title: "Expert Support",
    description: "Technical expertise and customer support for all Land Rover models."
  }
];

export default function Home() {
  const theme = useTheme();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    // Fetch featured products
    fetch(`${API_BASE_URL}/api/products?featured=true`)
      .then((res) => res.json())
      .then((data) => {
        setFeaturedProducts(data.slice(0, 4)); // Show only 4 featured products
      })
      .catch(() => {
        // Fallback data if API fails
        setFeaturedProducts([
          {
            id: 1,
            name: "200Tdi Air Filter",
            description: "Genuine air filter for Defender 200Tdi engines",
            price: 29.99,
            imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
          },
          {
            id: 2,
            name: "Brake Pads Set",
            description: "High-performance brake pads for Discovery",
            price: 49.99,
            imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
          },
          {
            id: 3,
            name: "LED Headlight Kit",
            description: "LED headlight upgrade for Series models",
            price: 89.99,
            imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
          },
          {
            id: 4,
            name: "Air Suspension Kit",
            description: "OEM air suspension for Range Rover models",
            price: 399.99,
            imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop"
          }
        ]);
      });
  }, []);

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.background.hero,
          color: 'white',
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url(https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=600&fit=crop) center/cover',
            opacity: 0.3,
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography
                variant="h1"
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  fontWeight: 700,
                  mb: 2,
                  textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                }}
              >
                Find Spare Parts for Your Land Rover
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  opacity: 0.9,
                  textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
                }}
              >
                Genuine and aftermarket parts for Series, Defender, Discovery, and Range Rover. 
                Quality you can trust for your adventure vehicle.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  component={Link}
                  to="/catalog"
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      backgroundColor: theme.palette.secondary.dark,
                    }
                  }}
                >
                  Shop Now
                </Button>
                <Button
                  component={Link}
                  to="/contact"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255,255,255,0.1)',
                    }
                  }}
                >
                  Contact Us
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: { xs: 'none', md: 'block' } }}>
              <Box
                component="img"
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop"
                alt="Land Rover"
                sx={{
                  width: '100%',
                  height: 400,
                  objectFit: 'cover',
                  borderRadius: 3,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h2"
          align="center"
          sx={{ mb: 6, color: theme.palette.primary.main }}
        >
          Why Choose SpareShop?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  textAlign: 'center',
                  height: '100%',
                  border: `1px solid ${theme.palette.grey[200]}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  }
                }}
              >
                <Box sx={{ color: theme.palette.primary.main, mb: 2 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Land Rover Models Section */}
      <Box sx={{ backgroundColor: theme.palette.grey[50], py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            align="center"
            sx={{ mb: 6, color: theme.palette.primary.main }}
          >
            Our Land Rover Models
          </Typography>
          <Grid container spacing={4}>
            {landRoverModels.map((model, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                    }
                  }}
                  component={Link}
                  to="/catalog"
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={model.image}
                    alt={model.name}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                      {model.name}
                    </Typography>
                    <Chip
                      label={model.years}
                      size="small"
                      sx={{
                        mb: 2,
                        backgroundColor: model.color,
                        color: 'white',
                        fontWeight: 500
                      }}
                    />
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {model.description}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, justifyContent: 'center' }}>
                      {model.features.map((feature, idx) => (
                        <Chip
                          key={idx}
                          label={feature}
                          size="small"
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h2" sx={{ color: theme.palette.primary.main }}>
            Featured Products
          </Typography>
          <Button
            component={Link}
            to="/catalog"
            endIcon={<ArrowForward />}
            sx={{ color: theme.palette.primary.main }}
          >
            View All
          </Button>
        </Box>
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card
                component={Link}
                to={`/product/${product.id}`}
                sx={{
                  height: '100%',
                  textDecoration: 'none',
                  color: 'inherit',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={product.imageUrl}
                  alt={product.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {product.description}
                  </Typography>
                  <Typography variant="h6" sx={{ color: theme.palette.primary.main, fontWeight: 600 }}>
                    ${product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" sx={{ mb: 3, fontWeight: 600 }}>
            Ready to Find Your Parts?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of Land Rover owners who trust SpareShop for quality parts and expert service.
          </Typography>
          <Button
            component={Link}
            to="/catalog"
            variant="contained"
            size="large"
            sx={{
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: theme.palette.secondary.dark,
              }
            }}
          >
            Browse Catalog
          </Button>
        </Container>
      </Box>
    </Box>
  );
} 