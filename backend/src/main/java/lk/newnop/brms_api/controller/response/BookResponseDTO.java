package lk.newnop.brms_api.controller.response;

import lk.newnop.brms_api.model.BookStatus;
import lombok.Data;

@Data
public class BookResponseDTO {

    private Long id;
    private String bookId;
    private String title;
    private String author;
    private String genre;
    private BookStatus availabilityStatus;
}
