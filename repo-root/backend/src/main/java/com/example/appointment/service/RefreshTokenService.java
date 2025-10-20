package com.example.appointment.service;

import com.example.appointment.entity.RefreshToken;
import com.example.appointment.entity.User;
import com.example.appointment.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class RefreshTokenService {
  private final RefreshTokenRepository repo;
  // refresh token valid for 7 days
  private final long refreshTokenValiditySeconds = 7 * 24 * 60 * 60;

  public RefreshTokenService(RefreshTokenRepository repo){
    this.repo = repo;
  }

  public RefreshToken createRefreshToken(User user, String ipAddress, String userAgent){
    RefreshToken t = new RefreshToken();
    t.setToken(UUID.randomUUID().toString());
    t.setUser(user);
    t.setExpiryDate(Instant.now().plus(refreshTokenValiditySeconds, ChronoUnit.SECONDS));
    t.setRevoked(false);
    t.setIpAddress(ipAddress);
    t.setUserAgent(userAgent);
    return repo.save(t);
  }

  public Optional<RefreshToken> findByToken(String token){
    return repo.findByToken(token);
  }

  public void revokeToken(RefreshToken token){
    token.setRevoked(true);
    repo.save(token);
  }

  public void revokeAllTokensForUser(User user){
    repo.deleteByUserId(user.getId());
  }
}
