import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  CircularProgress,
  Typography,
  Box,
  Card,
  CardHeader,
  Chip
} from '@mui/material';
import { getRentals, returnBook } from '../services/api';

const RentalHistory = () => {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRentals = async () => {
      try {
        setLoading(true);
        const response = await getRentals();
        const rentalsData = response.data.rentals || response.data.data || response.data;

        if (!Array.isArray(rentalsData)) {
          throw new Error('Invalid data format received from API');
        }

        setRentals(rentalsData);
        setError(null);
      } catch (err) {
        console.error("Error loading rentals:", err);
        setError(err.message);
        setRentals([]);
      } finally {
        setLoading(false);
      }
    };

    loadRentals();
  }, []);

  const handleReturn = async (rentalId) => {
    try {
      await returnBook(rentalId);
      setRentals(rentals.map(r =>
        r.id === rentalId ? {...r, returnDate: new Date().toISOString()} : r
      ));
    } catch (error) {
      console.error("Error returning book:", error);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader title="Rental History" />
      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="rental history table">
          <TableHead sx={{ bgcolor: 'background.paper' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Book</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rented By</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Rental Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Return Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rentals.length > 0 ? (
              rentals.map((rental) => (
                <TableRow key={rental.id}>
                  <TableCell>{rental.book?.title}</TableCell>
                  <TableCell>
                    <Box>
                      <Typography variant="body2">{rental.userName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {rental.userEmail}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {new Date(rental.rentalDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {rental.returnDate
                      ? new Date(rental.returnDate).toLocaleDateString()
                      : '-'}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={rental.returnDate ? 'Returned' : 'Active'}
                      color={rental.returnDate ? 'success' : 'primary'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {!rental.returnDate && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleReturn(rental.id)}
                        sx={{ textTransform: 'none' }}
                      >
                        Mark Returned
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography color="text.secondary" sx={{ py: 3 }}>
                    No rental records found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Card>
  );
};

export default RentalHistory;