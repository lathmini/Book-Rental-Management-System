import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TextField,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Button,
  Typography,
  Box,
  Chip,
  Card,
  CardHeader,
  CardContent,
  Tooltip,
  IconButton
} from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getBooks, createRental } from '../services/api';
import { useSnackbar } from 'notistack';
import RentalForm from '../components/RentalForm';

const BookList = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [rentalFormOpen, setRentalFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isRenting, setIsRenting] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const fetchBooks = async () => {
    try {
      const response = await getBooks();
      setBooks(response.data.books || []);
      setFilteredBooks(response.data.books || []);
    } catch (error) {
      console.error("Failed to load books:", error);
      enqueueSnackbar('Failed to load books', {
        variant: 'error',
        preventDuplicate: true
      });
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  useEffect(() => {
    const filtered = books.filter(book =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.genre?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  }, [searchTerm, books]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchBooks();
  };

  const handleRentClick = (book) => {
    setSelectedBook(book);
    setRentalFormOpen(true);
  };

  const handleRentConfirm = async ({ userName, userEmail }) => {
    setIsRenting(true);
    try {
      await createRental({
        bookId: selectedBook.id,
        userName,
        userEmail
      });

      // Refresh the book list to show updated availability
      const response = await getBooks();
      setBooks(response.data.books || []);

      enqueueSnackbar(`Successfully rented ${selectedBook.title}`, {
        variant: 'success',
        autoHideDuration: 3000
      });
    } catch (error) {
      console.error("Error renting book:", error);
      enqueueSnackbar(error.response?.data?.message || 'Error renting book', {
        variant: 'error',
        autoHideDuration: 4000
      });
    } finally {
      setIsRenting(false);
      setRentalFormOpen(false);
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
        <Typography sx={{ ml: 2 }}>Loading books...</Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ m: 2 }}>
      <CardHeader
        title="Book Inventory"
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <TextField
              label="Search books"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ width: 300 }}
            />
            <Tooltip title="Refresh book list">
              <IconButton
                onClick={handleRefresh}
                disabled={isRefreshing}
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        }
      />
      <CardContent>
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{ maxHeight: 'calc(100vh - 300px)', overflow: 'auto' }}
        >
          <Table
            sx={{ minWidth: 650 }}
            aria-label="book inventory table"
            stickyHeader
          >
            <TableHead sx={{ bgcolor: 'background.paper' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', width: '30%' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '20%' }}>Genre</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '15%' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold', width: '10%' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow
                  key={book.id}
                  hover
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    <Typography fontWeight="medium">
                      {book.title}
                    </Typography>
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={book.availabilityStatus}
                      color={book.availabilityStatus === 'AVAILABLE' ? 'success' : 'error'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    {book.availabilityStatus === 'AVAILABLE' ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleRentClick(book)}
                        sx={{
                          textTransform: 'none',
                          '&:hover': {
                            transform: 'translateY(-1px)',
                            boxShadow: 1
                          }
                        }}
                      >
                        Rent
                      </Button>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        Unavailable
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredBooks.length === 0 && (
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
            minHeight: '100px'
          }}>
            <Typography variant="h6" color="text.secondary">
              {searchTerm ? 'No matching books found' : 'No books available'}
            </Typography>
          </Box>
        )}

        <RentalForm
          open={rentalFormOpen}
          onClose={() => setRentalFormOpen(false)}
          onConfirm={handleRentConfirm}
          bookTitle={selectedBook?.title}
          isSubmitting={isRenting}
        />
      </CardContent>
    </Card>
  );
};

export default BookList;