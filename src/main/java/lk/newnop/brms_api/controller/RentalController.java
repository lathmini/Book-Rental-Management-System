package lk.newnop.brms_api.controller;

import jakarta.validation.Valid;
import lk.newnop.brms_api.controller.request.RentalRequestDTO;
import lk.newnop.brms_api.controller.response.BookResponseDTO;
import lk.newnop.brms_api.controller.response.RentalResponseDTO;
import lk.newnop.brms_api.controller.response.wrapper.RentalResponseWrapper;
import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Book;
import lk.newnop.brms_api.model.Rental;
import lk.newnop.brms_api.service.RentalService;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@AllArgsConstructor
@RequestMapping("/api")
public class RentalController {


    private final RentalService rentalService;

    @PostMapping(value = "/rentals", headers = "X-Api-Version=v1")
    public RentalResponseDTO create(@Valid @RequestBody RentalRequestDTO rentalRequestDTO)
            throws NotFoundException, IllegalStateException {

        Rental newRental = rentalService.create(rentalRequestDTO);

        // Build response directly
        RentalResponseDTO rentalResponse = new RentalResponseDTO();
        rentalResponse.setId(newRental.getId());
        rentalResponse.setUserName(newRental.getUserName());
        rentalResponse.setUserEmail(newRental.getUserEmail());
        rentalResponse.setRentalDate(newRental.getRentalDate());
        rentalResponse.setReturnDate(newRental.getReturnDate());

        if (newRental.getBook() != null) {
            Book book = newRental.getBook();
            BookResponseDTO bookDto = new BookResponseDTO();
            bookDto.setId(book.getId());
            bookDto.setBookId(book.getBookId());
            bookDto.setTitle(book.getTitle());
            bookDto.setAuthor(book.getAuthor());
            bookDto.setGenre(book.getGenre());
            bookDto.setAvailabilityStatus(book.getAvailabilityStatus());
            rentalResponse.setBook(bookDto);
        }

        return rentalResponse;
    }

    @GetMapping(value = "/rentals",headers = "X-Api-Version=v1")
    public RentalResponseWrapper getAllRentals() {
        List<RentalResponseDTO> rentalResponses = rentalService.findAll()
                .stream()
                .map(rental -> {
                    RentalResponseDTO rentalResponse = new RentalResponseDTO();
                    rentalResponse.setId(rental.getId());
                    rentalResponse.setUserName(rental.getUserName());
                    rentalResponse.setUserEmail(rental.getUserEmail());
                    rentalResponse.setRentalDate(rental.getRentalDate());
                    rentalResponse.setReturnDate(rental.getReturnDate());

                    if (rental.getBook() != null) {
                        Book book = rental.getBook();
                        BookResponseDTO bookDto = new BookResponseDTO();
                        bookDto.setId(book.getId());
                        bookDto.setBookId(book.getBookId());
                        bookDto.setTitle(book.getTitle());
                        bookDto.setAuthor(book.getAuthor());
                        bookDto.setGenre(book.getGenre());
                        bookDto.setAvailabilityStatus(book.getAvailabilityStatus());
                        rentalResponse.setBook(bookDto);
                    }

                    return rentalResponse;
                })
                .collect(Collectors.toList());

        return new RentalResponseWrapper(rentalResponses);
    }

    @PutMapping(value = "/rentals/{rentalId}/return", headers = "X-Api-Version=v1")
    public RentalResponseDTO updateRentalReturnDate(@PathVariable Long rentalId) throws NotFoundException {
        Rental updatedRental = rentalService.updateRentalReturnDate(rentalId);

        RentalResponseDTO rentalResponse = new RentalResponseDTO();
        rentalResponse.setId(updatedRental.getId());
        rentalResponse.setUserName(updatedRental.getUserName());
        rentalResponse.setUserEmail(updatedRental.getUserEmail());
        rentalResponse.setRentalDate(updatedRental.getRentalDate());
        rentalResponse.setReturnDate(updatedRental.getReturnDate());

        if (updatedRental.getBook() != null) {
            Book book = updatedRental.getBook();
            BookResponseDTO bookDto = new BookResponseDTO();
            bookDto.setId(book.getId());
            bookDto.setBookId(book.getBookId());
            bookDto.setTitle(book.getTitle());
            bookDto.setAuthor(book.getAuthor());
            bookDto.setGenre(book.getGenre());
            bookDto.setAvailabilityStatus(book.getAvailabilityStatus());
            rentalResponse.setBook(bookDto);
        }

        return rentalResponse;
    }

}
