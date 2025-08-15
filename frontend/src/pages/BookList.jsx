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
  CardContent
} from '@mui/material';
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
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.data.books || []);
        setFilteredBooks(response.data.books || []);
      } catch (error) {
        console.error("Failed to load books:", error);
        enqueueSnackbar('Failed to load books', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };
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

      const response = await getBooks();
      setBooks(response.data.books || []);

      enqueueSnackbar(`Successfully rented ${selectedBook.title}`, {
        variant: 'success'
      });
    } catch (error) {
      console.error("Error renting book:", error);
      enqueueSnackbar(error.response?.data?.message || 'Error renting book', {
        variant: 'error'
      });
    } finally {
      setIsRenting(false);
      setRentalFormOpen(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
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
          <TextField
            label="Search books"
            variant="outlined"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{ width: 300 }}
          />
        }
      />
      <CardContent>
        <TableContainer component={Paper} elevation={0}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead sx={{ bgcolor: 'background.paper' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Title</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Author</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Genre</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBooks.map((book) => (
                <TableRow
                  key={book.id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {book.title}
                  </TableCell>
                  <TableCell>{book.author}</TableCell>
                  <TableCell>{book.genre || '-'}</TableCell>
                  <TableCell>
                    <Chip
                      label={book.availabilityStatus}
                      color={book.availabilityStatus === 'AVAILABLE' ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {book.availabilityStatus === 'AVAILABLE' ? (
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => handleRentClick(book)}
                        sx={{ textTransform: 'none' }}
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
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <Typography color="text.secondary">
              No books found matching your search
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