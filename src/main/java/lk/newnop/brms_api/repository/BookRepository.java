package lk.newnop.brms_api.repository;

import lk.newnop.brms_api.model.Book;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookRepository extends JpaRepository<Book, Long> {
}
