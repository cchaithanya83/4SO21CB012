import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";

interface Product {
  productName: string;
  price: number;
  rating: number;
  discount: number;
  availability: string;
}

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState<string>("Phone");
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">(2000);
  const [searchProductId, setSearchProductId] = useState<string>("");

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/categories/${categoryName}/products/`,
        {
          params: {
            minPrice: minPrice === "" ? undefined : minPrice,
            maxPrice: maxPrice === "" ? undefined : maxPrice,
            product_id: searchProductId === "" ? undefined : searchProductId,
          },
        }
      );
      setProducts(response.data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleSearch = () => {
    fetchProducts();
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Products
      </Typography>

      <Grid container spacing={2} alignItems="center">
        <Grid item xs={4}>
          <TextField
            label="Category Name"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Min Price"
            value={minPrice === "" ? "" : minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value === "" ? "" : parseInt(e.target.value))
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            type="number"
            label="Max Price"
            value={maxPrice === "" ? "" : maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value === "" ? "" : parseInt(e.target.value))
            }
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Search Product by name"
            value={searchProductId}
            onChange={(e) => setSearchProductId(e.target.value)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleSearch}>
            Search
          </Button>
        </Grid>
      </Grid>

      <Grid container spacing={2} style={{ marginTop: 20 }}>
        {products.map((product, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2">
                  {product.productName}
                </Typography>
                <Typography color="textSecondary">
                  Price: {product.price}
                </Typography>
                <Typography color="textSecondary">
                  Rating: {product.rating}
                </Typography>
                <Typography color="textSecondary">
                  Discount: {product.discount}%
                </Typography>
                <Typography color="textSecondary">
                  Availability: {product.availability}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary">
                  View Details
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ProductList;
