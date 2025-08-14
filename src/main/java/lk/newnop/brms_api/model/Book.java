package lk.newnop.brms_api.model;

import jakarta.persistence.*;
import lombok.*;

import java.util.List;

@Entity
@Data
@Table(name = "books")

public class Book {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    private String genre;

    @Enumerated(EnumType.STRING)
    @Column(name= "availability_status")
    private BookStatus availabilityStatus;

    @OneToMany(mappedBy = "book")
    private List<Rental> rentals;

}
