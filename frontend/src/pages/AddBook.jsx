import React, { useState } from 'react';
import {
  TextField,
  Button,
  Box,
  Snackbar,
  Typography,
  Card,
  CardContent
} from '@mui/material';
import { addBook } from '../services/api';

export default function AddBook() {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    genre: ''
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addBook(formData);
      setSuccess(true);
      setFormData({ title: '', author: '', genre: '' });
    } catch (error) {
      console.error("Error adding book:", error);
    }
  };

  return (
    <Card sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Add New Book
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
        >
          <TextField
            label="Title"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            fullWidth
            required
            variant="outlined"
            size="small"
          />
          <TextField
            label="Author"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            fullWidth
            required
            variant="outlined"
            size="small"
          />
          <TextField
            label="Genre"
            value={formData.genre}
            onChange={(e) => setFormData({...formData, genre: e.target.value})}
            fullWidth
            variant="outlined"
            size="small"
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2, alignSelf: 'flex-end' }}
          >
            Add Book
          </Button>
        </Box>

        <Snackbar
          open={success}
          autoHideDuration={3000}
          onClose={() => setSuccess(false)}
          message="Book added successfully!"
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        />
      </CardContent>
    </Card>
  );
}