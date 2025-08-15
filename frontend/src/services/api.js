import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',  // Changed from just '/api'
  headers: {
    'X-Api-Version': 'v1',
    'Content-Type': 'application/json'
  }
});

// Book Endpoints
export const getBooks = () => api.get('/books');          // Full URL: http://localhost:8080/api/books
export const addBook = (book) => api.post('/books', book);
export const deleteBook = (id) => api.delete(`/books/${id}`);

// Rental Endpoints
export const getRentals = () => api.get('/rentals');      // Full URL: http://localhost:8080/api/rentals
export const createRental = (rental) => api.post('/rentals', rental);
export const returnBook = (id) => api.put(`/rentals/${id}/return`);