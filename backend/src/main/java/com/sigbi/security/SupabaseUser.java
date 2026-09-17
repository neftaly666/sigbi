package com.sigbi.security;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

//Supabase devuelve muchos más campos y cambia entre versiones, solo se leen los dos que se usan
@JsonIgnoreProperties(ignoreUnknown = true)
public record SupabaseUser(
        String id,
        String email
) {
}
