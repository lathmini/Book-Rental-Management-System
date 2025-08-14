package lk.newnop.brms_api.service.impl;

import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Book;
import lk.newnop.brms_api.repository.BookRepository;
import lk.newnop.brms_api.service.BookService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class BookServiceImpl implements BookService {

    private final BookRepository bookRepository;

    @Override
    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    @Override
    public Book getBookById(Long id) throws NotFoundException {
        return bookRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Book with ID " + id + " not found."));
    }

    @Override
    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    @Override
    public void deleteBook(Long id) throws NotFoundException {
        if (!bookRepository.existsById(id)) {
            throw new NotFoundException("Book with ID " + id + " not found.");
        }
        bookRepository.deleteById(id);
    }
}
