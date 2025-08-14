package lk.newnop.brms_api.controller.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RentalRequestDTO {

    @NotBlank(message = "User name is required")
    private String userName;

    private String rentalId;

    @NotBlank(message = "User email is required")
    @Email(message = "User email must be a valid email address")
    private String userEmail;

    @NotNull(message = "Book ID is required")
    private Long bookId;
}
