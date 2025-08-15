import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Typography,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  InputAdornment,
  IconButton,
  Fade
} from '@mui/material';
import { addBook } from '../services/api';
import { Book as BookIcon, Close as CloseIcon } from '@mui/icons-material';

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: '',
    isbn: '',
    year: ''
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.author) newErrors.author = 'Author is required';
    if (formData.isbn && !/^\d{10,13}$/.test(formData.isbn)) newErrors.isbn = 'Invalid ISBN format';

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await addBook(formData);
      setSuccess(true);
      setFormData({ title: '', author: '', genre: '', isbn: '', year: '' });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <Fade in timeout={500}>
      <Card sx={{
        maxWidth: 800,
        mx: 'auto',
        mt: 4,
        boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
        borderRadius: 3
      }}>
        <CardHeader
          title={
            <Typography variant="h5" fontWeight="600">
              <BookIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
              Add New Book
            </Typography>
          }
          sx={{
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            py: 2.5
          }}
        />
        <CardContent sx={{ pt: 3 }}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                  error={!!errors.title}
                  helperText={errors.title}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BookIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Author"
                  value={formData.author}
                  onChange={(e) => setFormData({...formData, author: e.target.value})}
                  fullWidth
                  required
                  variant="outlined"
                  size="medium"
                  error={!!errors.author}
                  helperText={errors.author}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Genre"
                  value={formData.genre}
                  onChange={(e) => setFormData({...formData, genre: e.target.value})}
                  fullWidth
                  variant="outlined"
                  size="medium"
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="ISBN (optional)"
                  value={formData.isbn}
                  onChange={(e) => setFormData({...formData, isbn: e.target.value})}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  error={!!errors.isbn}
                  helperText={errors.isbn || "10 or 13 digits"}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Publication Year (optional)"
                  value={formData.year}
                  onChange={(e) => setFormData({...formData, year: e.target.value})}
                  fullWidth
                  variant="outlined"
                  size="medium"
                  type="number"
                  inputProps={{ min: "1000", max: new Date().getFullYear() }}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Box sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 2
            }}>
              <Button
                variant="outlined"
                color="inherit"
                size="large"
                onClick={() => setFormData({ title: '', author: '', genre: '', isbn: '', year: '' })}
              >
                Clear
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                sx={{
                  px: 4,
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.2s'
                  }
                }}
              >
                Add Book
              </Button>
            </Box>
          </Box>

          <Snackbar
            open={success}
            autoHideDuration={4000}
            onClose={() => setSuccess(false)}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            message={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BookIcon color="success" sx={{ mr: 1 }} />
                <span>Book added successfully!</span>
              </Box>
            }
            action={
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setSuccess(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{
              '& .MuiSnackbarContent-root': {
                backgroundColor: 'success.light',
                color: 'success.contrastText'
              }
            }}
          />
        </CardContent>
      </Card>
    </Fade>
  );
}