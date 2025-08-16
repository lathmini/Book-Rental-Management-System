package lk.newnop.brms_api.controller.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lk.newnop.brms_api.model.BookStatus;
import lombok.Data;



@Data
public class BookRequestDTO {

    private String bookId;

    @NotBlank(message = "Title is required")
    private String title;

    @NotBlank(message = "Author is required")
    private String author;

    private String genre;


    private BookStatus availabilityStatus;
}
