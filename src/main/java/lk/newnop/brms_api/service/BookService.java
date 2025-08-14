package lk.newnop.brms_api.service;

import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Book;

import java.util.List;

public interface BookService {
    List<Book> getAllBooks();
    Book getBookById(Long id) throws NotFoundException;
    Book saveBook(Book book);
    void deleteBook(Long id) throws NotFoundException;
}
