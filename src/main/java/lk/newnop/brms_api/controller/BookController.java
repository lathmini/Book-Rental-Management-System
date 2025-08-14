package lk.newnop.brms_api.controller;

import jakarta.validation.Valid;
import lk.newnop.brms_api.controller.request.BookRequestDTO;
import lk.newnop.brms_api.controller.response.BookResponseDTO;
import lk.newnop.brms_api.controller.response.wrapper.BookResponseWrapper;
import lk.newnop.brms_api.exception.DuplicateBookException;
import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Book;
import lk.newnop.brms_api.service.BookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;


@RestController
public class BookController {
    @Autowired
    private BookService bookService;

    @PostMapping(value = "/books", headers = "X-Api-Version=v1")
    public BookResponseDTO create(@RequestBody @Validated BookRequestDTO bookRequestDTO) throws DuplicateBookException {

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

    @GetMapping(value = "/books/{book-id}", headers = "X-Api-Version=v1")
    public BookResponseDTO getById(@PathVariable("book-id") Long bookId) throws NotFoundException {
        Book getBook = bookService.findById(bookId);

        BookResponseDTO bookResponseDTO = new BookResponseDTO();
        bookResponseDTO.setId(getBook.getId());
        bookResponseDTO.setBookId(getBook.getBookId());
        bookResponseDTO.setTitle(getBook.getTitle());
        bookResponseDTO.setAuthor(getBook.getAuthor());
        bookResponseDTO.setGenre(getBook.getGenre());
       // bookResponseDTO.getAvailabilityStatus(getBook.setAvailabilityStatus());

        return bookResponseDTO;
    }


    @GetMapping(value = "/books", headers = "X-Api-Version=v1")
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
            bookResponseDTOS.add(bookResponseDTO); // This line was missing
        }
        return new BookResponseWrapper(bookResponseDTOS);
    }

    @PutMapping(value = "/books/{book-id}", headers = "X-Api-Version=v1")
    public BookResponseDTO updateById(@PathVariable("book-id") Long bookId, @Valid @RequestBody BookRequestDTO bookRequestDTO) throws NotFoundException {
        BookResponseDTO bookResponseDTO = new BookResponseDTO();
        Book book = bookService.updateById(bookId, bookRequestDTO);

        bookResponseDTO.setBookId(book.getBookId());
        bookResponseDTO.setTitle(book.getTitle());
        bookResponseDTO.setAuthor(book.getAuthor());
        bookResponseDTO.setGenre(book.getGenre());
        //bookResponseDTO.setAvailabilityStatus(book.getAvailabilityStatus());
        return bookResponseDTO;
    }

    @DeleteMapping(value = "/books/{book-id}", headers = "X-Api-Version=v1")
    public void deleteById(@PathVariable("book-id") Long bookId) throws NotFoundException {
        bookService.deleteById(bookId);
    }


}
