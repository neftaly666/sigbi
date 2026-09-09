package com.mitocode.dto;

/*public record ConsultProcDTO(
        Integer quantity,
        String consultdate
) {
}*/

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultProcDTO {
    public Integer quantity;
    public String consultdate;
}
