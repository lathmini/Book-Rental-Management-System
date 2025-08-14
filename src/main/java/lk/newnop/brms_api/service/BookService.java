package lk.newnop.brms_api.service;

import lk.newnop.brms_api.controller.request.BookRequestDTO;
import lk.newnop.brms_api.exception.DuplicateBookException;
import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Book;
import lk.newnop.brms_api.model.BookStatus;

import java.util.List;

public interface BookService {

    Book create(BookRequestDTO bookRequestDTO) throws DuplicateBookException;

    Book findById(Long bookId) throws NotFoundException;

    List<Book> findAll();

    Book updateById(Long bookId, BookRequestDTO bookRequestDTO) throws NotFoundException;

    void deleteById(Long bookId) throws NotFoundException;

    List<Book> getAllBooksByStatus(BookStatus status) throws NotFoundException;
}


