package lk.newnop.brms_api.repository;

import lk.newnop.brms_api.model.Rental;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RentalRepository extends JpaRepository<Rental, Long> {
}
