package com.mitocode.security;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

//Supabase devuelve muchos mas campos y cambia entre versiones, solo se leen los dos que se usan
@JsonIgnoreProperties(ignoreUnknown = true)
public record SupabaseUser(
        String id,
        String email
) {
}
