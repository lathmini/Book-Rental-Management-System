package lk.newnop.brms_api.controller.response.wrapper;

import lk.newnop.brms_api.controller.response.RentalResponseDTO;
import lombok.Data;

import java.util.List;

@Data
public class RentalResponseWrapper {

    private List<RentalResponseDTO> rentals;

    private String rentalId;

    public RentalResponseWrapper(List<RentalResponseDTO> rentals) {
        this.rentals = rentals;
    }
}
