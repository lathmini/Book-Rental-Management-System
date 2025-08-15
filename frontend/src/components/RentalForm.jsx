import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress
} from '@mui/material';

export default function RentalForm({ open, onClose, onConfirm, bookTitle, isSubmitting }) {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [errors, setErrors] = useState({});

  // Reset form when opening/closing
  useEffect(() => {
    if (open) {
      setUserName('');
      setUserEmail('');
      setErrors({});
    }
  }, [open]);

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
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Rent "{bookTitle}"</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            autoFocus
            label="Your Name"
            fullWidth
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            error={!!errors.userName}
            helperText={errors.userName}
            sx={{ mb: 2 }}
            disabled={isSubmitting}
          />
          <TextField
            label="Email Address"
            fullWidth
            type="email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            error={!!errors.userEmail}
            helperText={errors.userEmail}
            disabled={isSubmitting}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? <CircularProgress size={24} /> : 'Confirm Rental'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

RentalForm.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  bookTitle: PropTypes.string,
  isSubmitting: PropTypes.bool
};

RentalForm.defaultProps = {
  bookTitle: '',
  isSubmitting: false
};