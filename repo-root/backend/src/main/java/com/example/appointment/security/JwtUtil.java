package com.example.appointment.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {
  private final Key key = Keys.hmacShaKeyFor("changeit-changeit-changeit-changeit-32-bytes!".getBytes());
  private final long expiration = 1000 * 60 * 60; // 1 hour

  public String generateToken(String username){
    return Jwts.builder()
      .setSubject(username)
      .setIssuedAt(new Date())
      .setExpiration(new Date(System.currentTimeMillis() + expiration))
      .signWith(key)
      .compact();
  }

  public String extractUsername(String token){
    return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody().getSubject();
  }

  public boolean validate(String token){
    try{
      Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token);
      return true;
    }catch (JwtException e){
      return false;
    }
  }
}
