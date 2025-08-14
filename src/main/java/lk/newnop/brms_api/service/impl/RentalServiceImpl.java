package lk.newnop.brms_api.service.impl;

import lk.newnop.brms_api.controller.request.RentalRequestDTO;
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
    public List<Rental> findAll() {
        return rentalRepository.findAll();
    }

    @Override
    public Rental create(RentalRequestDTO rentalRequestDTO) throws NotFoundException, IllegalStateException {
        Book book = bookRepository.findById(rentalRequestDTO.getBookId())
                .orElseThrow(() -> new NotFoundException("Book with ID " + rentalRequestDTO.getBookId() + " not found."));

        if (book.getAvailabilityStatus() != BookStatus.AVAILABLE) {
            throw new IllegalStateException("Book is not available for rental.");
        }

        book.setAvailabilityStatus(BookStatus.RENTED);
        bookRepository.save(book);

        Rental rental = new Rental();
        rental.setUserName(rentalRequestDTO.getUserName());
        rental.setUserEmail(rentalRequestDTO.getUserEmail());
        rental.setBook(book);
        rental.setRentalDate(LocalDate.now());

        return rentalRepository.save(rental);
    }

    @Override
    public Rental updateRentalReturnDate(Long rentedId) throws NotFoundException {
        Rental existingRental = rentalRepository.findById(rentedId)
                .orElseThrow(() -> new NotFoundException("Rental with ID " + rentedId + " not found."));

        // Only update if the return date isn't already set
        if (existingRental.getReturnDate() == null) {
            existingRental.setReturnDate(LocalDate.now());
            Book book = existingRental.getBook();
            book.setAvailabilityStatus(BookStatus.AVAILABLE);
            bookRepository.save(book);
        }

        return rentalRepository.save(existingRental);
    }

}
