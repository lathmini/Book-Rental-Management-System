// src/components/RentalForm.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box
} from '@mui/material';

export default function RentalForm({ open, onClose, onConfirm, bookTitle }) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!userName) newErrors.userName = 'Name is required';
    if (!userEmail) newErrors.userEmail = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(userEmail)) newErrors.userEmail = 'Invalid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onConfirm({ userName, userEmail });
      onClose();
    }
  };

  RentalForm.propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onConfirm: PropTypes.func.isRequired,
    bookTitle: PropTypes.string,
    isSubmitting: PropTypes.bool
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rent "{bookTitle}"</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Your Name"
            fullWidth
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            error={!!errors.userName}
            helperText={errors.userName}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Email Address"
            fullWidth
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            error={!!errors.userEmail}
            helperText={errors.userEmail}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
        >
          Confirm Rental
        </Button>
      </DialogActions>
    </Dialog>
  );
}