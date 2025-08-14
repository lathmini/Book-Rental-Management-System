package lk.newnop.brms_api.service;

import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Rental;

import java.util.List;

public interface RentalService {
    List<Rental> getAllRentals();
    Rental createRental(Rental rental) throws NotFoundException, IllegalStateException;
    Rental updateRental(Long id, Rental updatedRental) throws NotFoundException;
}
