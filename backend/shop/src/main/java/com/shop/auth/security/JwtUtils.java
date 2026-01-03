package com.shop.auth.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtils {

    @Value("${jwt.secret}")
    private String secret;          // at least 256-bit (32-byte) hex or base64

    @Value("${jwt.expiration}")
    private int expirationSeconds;

    /* ---------- generate ---------- */
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("role",  role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationSeconds * 1000L))
                .signWith(signKey())   // modern signature
                .compact();
    }

    /* ---------- validate ---------- */
    public boolean validate(String token) {
        try {
            Jwts.parser()
                    .verifyWith(signKey()) // modern verification
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /* ---------- helpers ---------- */
    public String getUsername(String token) {
        return getClaims(token).getSubject();
    }

    public String getRole(String token) {
        return getClaims(token).get("role", String.class);
    }

    private Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(signKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey signKey() {
        return Keys.hmacShaKeyFor(secret.getBytes()); // 256-bit key
    }
}