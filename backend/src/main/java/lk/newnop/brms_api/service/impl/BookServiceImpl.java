package lk.newnop.brms_api.service.impl;

import lk.newnop.brms_api.controller.request.BookRequestDTO;
import lk.newnop.brms_api.exception.DuplicateBookException;
import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Book;
import lk.newnop.brms_api.model.BookStatus;
import lk.newnop.brms_api.repository.BookRepository;
import lk.newnop.brms_api.service.BookService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
@AllArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Override
    public Book create(BookRequestDTO bookRequestDTO) {
        Book book = new Book();

        if (bookRequestDTO.getBookId() != null && !bookRequestDTO.getBookId().isBlank()) {
            book.setBookId(bookRequestDTO.getBookId());
        } else {
            book.setBookId(UUID.randomUUID().toString());
        }

        if (bookRepository.existsByTitleAndAuthor(
                bookRequestDTO.getTitle(),
                bookRequestDTO.getAuthor())) {
            throw new DuplicateBookException("Book already exists: " + bookRequestDTO.getTitle());
        }

        book.setTitle(bookRequestDTO.getTitle());
        book.setAuthor(bookRequestDTO.getAuthor());
        book.setGenre(bookRequestDTO.getGenre());

        // Default availability status if null
        if (bookRequestDTO.getAvailabilityStatus() == null) {
            book.setAvailabilityStatus(BookStatus.AVAILABLE);
        } else {
            book.setAvailabilityStatus(bookRequestDTO.getAvailabilityStatus());
        }

        return bookRepository.save(book);
    }




    @Override
    public Book findById(Long bookId) throws NotFoundException {
        return bookRepository.findById(bookId)
                .orElseThrow(() -> new NotFoundException("Book with ID " + bookId + " not found."));
    }

    @Override
    public List<Book> findAll() {
        return bookRepository.findAll();
    }


    @Override
    public Book updateById(Long id, BookRequestDTO bookRequestDTO) throws NotFoundException {
        Book existingBook = findById(id);
        existingBook.setTitle(bookRequestDTO.getTitle());
        existingBook.setAuthor(bookRequestDTO.getAuthor());
        existingBook.setGenre(bookRequestDTO.getGenre());
        existingBook.setAvailabilityStatus(bookRequestDTO.getAvailabilityStatus());
        return bookRepository.save(existingBook);
    }

    @Override
    public void deleteById(Long bookId) throws NotFoundException {
        Book book = findById(bookId); // will throw NotFoundException if not found
        bookRepository.delete(book);
    }

    @Override
    public List<Book> getAllBooksByStatus(BookStatus status) {
        return bookRepository.findByAvailabilityStatus(status);
    }
}
