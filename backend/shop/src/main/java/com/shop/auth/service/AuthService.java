package com.shop.auth.service;

import com.shop.auth.dto.JwtResponse;
import com.shop.auth.dto.LoginRequest;
import com.shop.auth.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service // ← acesta lipsește sau este șters
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authManager;
    private final UserDetailsService userDetailsService;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public JwtResponse login(LoginRequest dto) {
        // 1. autentificare
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(dto.username(), dto.password())
        );

        // 2. extragem UserDetails (conține și autoritățile)
        UserDetails user = (UserDetails) auth.getPrincipal();
        String role = user.getAuthorities().iterator().next().getAuthority(); // "ADMIN" sau "CUSTOMER"

        // 3. generăm token cu rolul real
        String token = jwtUtils.generateToken(user.getUsername(), role);

        return new JwtResponse(token, role);
    }
}