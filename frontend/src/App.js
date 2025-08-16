import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AppBar, Toolbar, Container, Button, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import BookList from './pages/BookList';
import AddBook from './pages/AddBook';
import RentalHistory from './pages/RentalHistory';
import { SnackbarProvider } from 'notistack';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2c3e50',
    },
    secondary: {
      main: '#3498db',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
      >
        <Router>
          <AppBar position="static" elevation={0}>
            <Toolbar sx={{ justifyContent: 'space-between' }}>
              <Typography
                variant="h6"
                component={Link}
                to="/"
                sx={{
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  '&:hover': {
                    color: 'rgba(255,255,255,0.9)'
                  }
                }}
              >
                Book Rental System
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/"
                  sx={{ textTransform: 'none', fontSize: '1rem' }}
                >
                  Books
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/add-book"
                  sx={{ textTransform: 'none', fontSize: '1rem' }}
                >
                  Add Book
                </Button>
                <Button
                  color="inherit"
                  component={Link}
                  to="/rentals"
                  sx={{ textTransform: 'none', fontSize: '1rem' }}
                >
                  Rentals
                </Button>
              </Box>
            </Toolbar>
          </AppBar>

          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Routes>
              <Route path="/" element={<BookList />} />
              <Route path="/add-book" element={<AddBook />} />
              <Route path="/rentals" element={<RentalHistory />} />
            </Routes>
          </Container>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;