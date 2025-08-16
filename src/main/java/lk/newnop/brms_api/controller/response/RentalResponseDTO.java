package lk.newnop.brms_api.controller.response;

import lombok.Data;

import java.time.LocalDate;

@Data
public class RentalResponseDTO {

    private Long id;
    private String userName;
    private String userEmail;
    private LocalDate rentalDate;
    private LocalDate returnDate;
    private BookResponseDTO book;
}
