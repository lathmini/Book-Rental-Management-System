package lk.newnop.brms_api.service.impl;

import lk.newnop.brms_api.controller.request.RentalRequestDTO;
import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Book;
import lk.newnop.brms_api.model.BookStatus;
import lk.newnop.brms_api.model.Rental;
import lk.newnop.brms_api.repository.BookRepository;
import lk.newnop.brms_api.repository.RentalRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RentalServiceImplUnitTest {

    @Mock
    private RentalRepository rentalRepository;

    @Mock
    private BookRepository bookRepository;

    @InjectMocks
    private RentalServiceImpl rentalService;

    @Test
    @DisplayName("Find all rentals - Success")
    void findAllRentals_Success() {
        Rental r1 = new Rental();
        r1.setId(1L);
        Rental r2 = new Rental();
        r2.setId(2L);

        when(rentalRepository.findAllWithBooks()).thenReturn(Arrays.asList(r1, r2));

        var result = rentalService.findAll();

        assertEquals(2, result.size());
        verify(rentalRepository, times(1)).findAllWithBooks();
    }

    @Test
    @DisplayName("Create rental - Success")
    void createRental_Success() throws NotFoundException {
        Long bookId = 1L;
        RentalRequestDTO request = new RentalRequestDTO();
        request.setBookId(bookId);
        request.setUserName("John Doe");
        request.setUserEmail("john@example.com");

        Book availableBook = new Book();
        availableBook.setId(bookId);
        availableBook.setAvailabilityStatus(BookStatus.AVAILABLE);

        when(bookRepository.findById(bookId)).thenReturn(Optional.of(availableBook));
        when(bookRepository.save(any(Book.class))).thenReturn(availableBook);

        Rental savedRental = new Rental();
        savedRental.setId(1L);
        savedRental.setBook(availableBook);
        savedRental.setUserName("John Doe");
        savedRental.setUserEmail("john@example.com");
        savedRental.setRentalDate(LocalDate.now());

        when(rentalRepository.save(any(Rental.class))).thenReturn(savedRental);

        Rental result = rentalService.create(request);

        assertNotNull(result);
        assertEquals("John Doe", result.getUserName());
        assertEquals(BookStatus.RENTED, result.getBook().getAvailabilityStatus());
        verify(bookRepository, times(1)).findById(bookId);
        verify(bookRepository, times(1)).save(any(Book.class));
        verify(rentalRepository, times(1)).save(any(Rental.class));
    }

    @Test
    @DisplayName("Create rental - Book not found")
    void createRental_BookNotFound() {
        RentalRequestDTO request = new RentalRequestDTO();
        request.setBookId(99L);

        when(bookRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> rentalService.create(request));
        verify(rentalRepository, never()).save(any());
    }

    @Test
    @DisplayName("Create rental - Book already rented")
    void createRental_BookAlreadyRented() {
        RentalRequestDTO request = new RentalRequestDTO();
        request.setBookId(1L);

        Book rentedBook = new Book();
        rentedBook.setId(1L);
        rentedBook.setAvailabilityStatus(BookStatus.RENTED);

        when(bookRepository.findById(1L)).thenReturn(Optional.of(rentedBook));

        assertThrows(IllegalStateException.class, () -> rentalService.create(request));
        verify(rentalRepository, never()).save(any());
    }

    @Test
    @DisplayName("Update rental return date - Success")
    void updateRentalReturnDate_Success() throws NotFoundException {
        Long rentalId = 1L;
        Book rentedBook = new Book();
        rentedBook.setAvailabilityStatus(BookStatus.RENTED);

        Rental existingRental = new Rental();
        existingRental.setId(rentalId);
        existingRental.setBook(rentedBook);
        existingRental.setRentalDate(LocalDate.now());

        when(rentalRepository.findById(rentalId)).thenReturn(Optional.of(existingRental));
        when(rentalRepository.save(any(Rental.class))).thenReturn(existingRental);

        Rental result = rentalService.updateRentalReturnDate(rentalId);

        assertNotNull(result.getReturnDate());
        assertEquals(BookStatus.AVAILABLE, rentedBook.getAvailabilityStatus());
        verify(bookRepository, times(1)).save(any(Book.class));
        verify(rentalRepository, times(1)).save(existingRental);
    }

    @Test
    @DisplayName("Update rental return date - Rental not found")
    void updateRentalReturnDate_NotFound() {
        when(rentalRepository.findById(99L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> rentalService.updateRentalReturnDate(99L));
        verify(rentalRepository, never()).save(any());
    }

    @Test
    @DisplayName("Update rental return date - Already returned")
    void updateRentalReturnDate_AlreadyReturned() {
        Long rentalId = 1L;
        Rental existingRental = new Rental();
        existingRental.setId(rentalId);
        existingRental.setReturnDate(LocalDate.of(2025, 1, 1));

        when(rentalRepository.findById(rentalId)).thenReturn(Optional.of(existingRental));

        assertThrows(IllegalStateException.class, () -> rentalService.updateRentalReturnDate(rentalId));
        verify(bookRepository, never()).save(any());
        verify(rentalRepository, never()).save(any());
    }
}
