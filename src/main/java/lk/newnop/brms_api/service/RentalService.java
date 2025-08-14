package lk.newnop.brms_api.service;

import lk.newnop.brms_api.controller.request.RentalRequestDTO;
import lk.newnop.brms_api.exception.NotFoundException;
import lk.newnop.brms_api.model.Rental;

import java.util.List;

public interface RentalService {
    List<Rental> findAll();
    Rental create(RentalRequestDTO rentalRequestDTO) throws NotFoundException, IllegalStateException;
    Rental updateRentalReturnDate(Long id) throws NotFoundException;
}
