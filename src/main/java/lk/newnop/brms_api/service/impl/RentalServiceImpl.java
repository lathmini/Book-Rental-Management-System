package lk.newnop.brms_api.service.impl;

import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Book;
import lk.newnop.brms_api.model.BookStatus;
import lk.newnop.brms_api.model.Rental;
import lk.newnop.brms_api.repository.BookRepository;
import lk.newnop.brms_api.repository.RentalRepository;
import lk.newnop.brms_api.service.RentalService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class RentalServiceImpl implements RentalService {

    private final RentalRepository rentalRepository;
    private final BookRepository bookRepository;

    @Override
    public List<Rental> getAllRentals() {
        return rentalRepository.findAll();
    }

    @Override
    public Rental createRental(Rental rental) throws NotFoundException, IllegalStateException {
        Book book = bookRepository.findById(rental.getBook().getId())
                .orElseThrow(() -> new NotFoundException("Book with ID " + rental.getBook().getId() + " not found."));

        if (book.getAvailabilityStatus() != BookStatus.AVAILABLE) {
            throw new IllegalStateException("Book is not available for rental.");
        }

        book.setAvailabilityStatus(BookStatus.RENTED);
        bookRepository.save(book);
        rental.setRentalDate(LocalDate.now());
        return rentalRepository.save(rental);
    }

    @Override
    public Rental updateRental(Long id, Rental updatedRental) throws NotFoundException {
        Rental existingRental = rentalRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Rental with ID " + id + " not found."));

        existingRental.setReturnDate(updatedRental.getReturnDate());

        if (updatedRental.getReturnDate() != null) {
            Book book = existingRental.getBook();
            book.setAvailabilityStatus(BookStatus.AVAILABLE);
            bookRepository.save(book);
        }

        return rentalRepository.save(existingRental);
    }

}
