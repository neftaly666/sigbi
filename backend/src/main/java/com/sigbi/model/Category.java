package com.sigbi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Integer idCategory;

    @Column(nullable = false, length = 60)
    private String name;

    @Column(nullable = false, length = 150)
    private String description;

    //RN-14: desactivar no borra. Una categoría inactiva deja de ofrecerse al
    //clasificar libros nuevos, pero los ya clasificados la conservan.
    @Column(nullable = false)
    private Boolean status;
}
