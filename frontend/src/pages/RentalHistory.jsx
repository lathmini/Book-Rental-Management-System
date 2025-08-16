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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  InputAdornment
} from '@mui/material';
import { getRentals, returnBook } from '../services/api';
import { useSnackbar } from 'notistack';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchIcon from '@mui/icons-material/Search';

const RentalHistory = () => {
  const [rentals, setRentals] = useState([]);
  const [filteredRentals, setFilteredRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [currentRental, setCurrentRental] = useState(null);
  const [isReturning, setIsReturning] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { enqueueSnackbar } = useSnackbar();

  const loadRentals = async () => {
    try {
      setIsRefreshing(true);
      const response = await getRentals();
      const rentalsData = response.data.rentals || response.data.data || response.data;

      if (!Array.isArray(rentalsData)) {
        throw new Error('Invalid data format received from API');
      }

      setRentals(rentalsData);
      setFilteredRentals(rentalsData);
      setError(null);
    } catch (err) {
      console.error("Error loading rentals:", err);
      setError(err.message);
      setRentals([]);
      setFilteredRentals([]);
      enqueueSnackbar('Failed to load rental history', { variant: 'error' });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadRentals();
  }, []);

  useEffect(() => {
    let results = rentals;

    // Apply status filter
    if (statusFilter !== 'all') {
      const isReturned = statusFilter === 'returned';
      results = results.filter(rental =>
        isReturned ? rental.returnDate : !rental.returnDate
      );
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(rental =>
        rental.book?.title?.toLowerCase().includes(term) ||
        rental.userName?.toLowerCase().includes(term) ||
        rental.userEmail?.toLowerCase().includes(term)
      );
    }

    setFilteredRentals(results);
  }, [rentals, statusFilter, searchTerm]);

  const handleReturnClick = (rental) => {
    setCurrentRental(rental);
    setConfirmOpen(true);
  };

  const handleConfirmReturn = async () => {
    setIsReturning(true);
    try {
      await returnBook(currentRental.id);
      const updatedRentals = rentals.map(r =>
        r.id === currentRental.id ? {...r, returnDate: new Date().toISOString()} : r
      );
      setRentals(updatedRentals);
      enqueueSnackbar(`"${currentRental.book?.title}" marked as returned`, {
        variant: 'success',
        autoHideDuration: 3000
      });
    } catch (error) {
      console.error("Error returning book:", error);
      enqueueSnackbar(error.response?.data?.message || 'Error marking book as returned', {
        variant: 'error',
        autoHideDuration: 4000
      });
    } finally {
      setIsReturning(false);
      setConfirmOpen(false);
    }
  };

  const handleStatusFilter = (event, newFilter) => {
    if (newFilter !== null) {
      setStatusFilter(newFilter);
    }
  };

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '200px'
      }}>
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
        <Button
          variant="outlined"
          onClick={loadRentals}
          sx={{ mt: 2 }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        title="Rental History"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Refresh rental history">
              <IconButton
                onClick={loadRentals}
                disabled={isRefreshing}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />

      {/* Filter Controls */}
      <Box sx={{
        p: 2,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: 2,
        borderBottom: '1px solid',
        borderColor: 'divider'
      }}>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search rentals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
          <FilterListIcon color="action" sx={{ mr: 1 }} />
          <ToggleButtonGroup
            value={statusFilter}
            exclusive
            onChange={handleStatusFilter}
            size="small"
          >
            <ToggleButton value="all" aria-label="All rentals">
              <Typography variant="body2">All</Typography>
            </ToggleButton>
            <ToggleButton value="active" aria-label="Active rentals">
              <Typography variant="body2">Active</Typography>
            </ToggleButton>
            <ToggleButton value="returned" aria-label="Returned rentals">
              <Typography variant="body2">Returned</Typography>
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Box>

      <TableContainer component={Paper} elevation={0}>
        <Table sx={{ minWidth: 650 }} aria-label="rental history table">
          <TableHead sx={{ bgcolor: 'background.paper' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Book</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Rented By</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Rental Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Return Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredRentals.length > 0 ? (
              filteredRentals.map((rental) => (
                <TableRow key={rental.id} hover>
                  <TableCell>
                    <Typography fontWeight="medium">
                      {rental.book?.title}
                    </Typography>
                  </TableCell>
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
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {!rental.returnDate && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleReturnClick(rental)}
                        sx={{
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'primary.main',
                            color: 'primary.contrastText'
                          }
                        }}
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
                    {searchTerm || statusFilter !== 'all'
                      ? 'No matching rentals found'
                      : 'No rental records found'}
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Return</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to mark "{currentRental?.book?.title}" as returned?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmOpen(false)}
            disabled={isReturning}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirmReturn}
            color="primary"
            variant="contained"
            disabled={isReturning}
          >
            {isReturning ? (
              <>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                Processing...
              </>
            ) : (
              'Confirm Return'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default RentalHistory;