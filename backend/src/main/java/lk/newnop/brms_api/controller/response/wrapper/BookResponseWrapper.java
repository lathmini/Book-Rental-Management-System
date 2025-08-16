package lk.newnop.brms_api.controller.response.wrapper;

import lk.newnop.brms_api.controller.response.BookResponseDTO;
import lombok.Data;

import java.util.List;

@Data
public class BookResponseWrapper {

    private List<BookResponseDTO> books;

    public BookResponseWrapper(List<BookResponseDTO> books) {
        this.books = books;
    }
}
