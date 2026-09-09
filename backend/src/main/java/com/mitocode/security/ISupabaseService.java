package com.mitocode.security;

public interface ISupabaseService {

    SupabaseSession login(String username, String password);

    SupabaseUser createAuthUser(String email, String password, String username);

    void logout(String accessToken);
}
