package lk.newnop.brms_api.repository;

import lk.newnop.brms_api.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RentalRepository extends JpaRepository<Rental, Long> {

    @Query("SELECT r FROM Rental r JOIN FETCH r.book")
    List<Rental> findAllWithBooks();

}
