package lk.newnop.brms_api.repository;

import jakarta.validation.constraints.NotBlank;
import lk.newnop.brms_api.model.Book;
import lk.newnop.brms_api.model.BookStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByAvailabilityStatus(BookStatus status);
    boolean existsByTitleAndAuthor(String title, String author);


}
