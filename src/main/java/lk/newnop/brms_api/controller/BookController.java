package lk.newnop.brms_api.controller;

import jakarta.validation.Valid;
import lk.newnop.brms_api.controller.request.BookRequestDTO;
import lk.newnop.brms_api.controller.response.BookResponseDTO;
import lk.newnop.brms_api.controller.response.wrapper.BookResponseWrapper;
import lk.newnop.brms_api.exception.DuplicateBookException;
import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Book;
import lk.newnop.brms_api.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(value = "/books", headers = "X-Api-Version=v1")
public class BookController {

    private final BookService bookService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookResponseDTO create(@RequestBody @Valid BookRequestDTO bookRequestDTO) throws DuplicateBookException {
        Book createdBook = bookService.create(bookRequestDTO);

        BookResponseDTO bookResponse = new BookResponseDTO();
        bookResponse.setId(createdBook.getId());
        bookResponse.setBookId(createdBook.getBookId());
        bookResponse.setTitle(createdBook.getTitle());
        bookResponse.setAuthor(createdBook.getAuthor());
        bookResponse.setGenre(createdBook.getGenre());
        bookResponse.setAvailabilityStatus(createdBook.getAvailabilityStatus());

        return bookResponse;
    }

    @GetMapping("/{book-id}")
    public BookResponseDTO getById(@PathVariable("book-id") Long bookId) throws NotFoundException {
        Book getBook = bookService.findById(bookId);

        BookResponseDTO bookResponseDTO = new BookResponseDTO();
        bookResponseDTO.setId(getBook.getId());
        bookResponseDTO.setBookId(getBook.getBookId());
        bookResponseDTO.setTitle(getBook.getTitle());
        bookResponseDTO.setAuthor(getBook.getAuthor());
        bookResponseDTO.setGenre(getBook.getGenre());
        bookResponseDTO.setAvailabilityStatus(getBook.getAvailabilityStatus());

        return bookResponseDTO;
    }

    @GetMapping
    public BookResponseWrapper getAll() {
        List<Book> books = bookService.findAll();
        List<BookResponseDTO> bookResponseDTOS = new ArrayList<>();

        for (Book book : books) {
            BookResponseDTO bookResponseDTO = new BookResponseDTO();
            bookResponseDTO.setId(book.getId());
            bookResponseDTO.setBookId(book.getBookId());
            bookResponseDTO.setTitle(book.getTitle());
            bookResponseDTO.setAuthor(book.getAuthor());
            bookResponseDTO.setGenre(book.getGenre());
            bookResponseDTO.setAvailabilityStatus(book.getAvailabilityStatus());
            bookResponseDTOS.add(bookResponseDTO);
        }
        return new BookResponseWrapper(bookResponseDTOS);
    }

    @PutMapping("/{book-id}")
    public BookResponseDTO updateById(@PathVariable("book-id") Long bookId,
                                      @Valid @RequestBody BookRequestDTO bookRequestDTO) throws NotFoundException {
        Book book = bookService.updateById(bookId, bookRequestDTO);

        BookResponseDTO bookResponseDTO = new BookResponseDTO();
        bookResponseDTO.setBookId(book.getBookId());
        bookResponseDTO.setTitle(book.getTitle());
        bookResponseDTO.setAuthor(book.getAuthor());
        bookResponseDTO.setGenre(book.getGenre());
        bookResponseDTO.setAvailabilityStatus(book.getAvailabilityStatus());

        return bookResponseDTO;
    }

    @DeleteMapping("/{book-id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteById(@PathVariable("book-id") Long bookId) throws NotFoundException {
        bookService.deleteById(bookId);
    }
}
