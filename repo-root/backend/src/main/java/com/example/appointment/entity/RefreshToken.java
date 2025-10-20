package com.example.appointment.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "refresh_tokens")
public class RefreshToken {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, unique = true)
  private String token;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  @Column(name = "expiry_date", nullable = false)
  private Instant expiryDate;

  @Column(nullable = false)
  private boolean revoked = false;

  @Column(name = "ip_address")
  private String ipAddress;

  @Column(name = "user_agent", length = 2000)
  private String userAgent;

  // getters/setters
  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getToken(){return token;}
  public void setToken(String token){this.token=token;}
  public User getUser(){return user;}
  public void setUser(User user){this.user=user;}
  public Instant getExpiryDate(){return expiryDate;}
  public void setExpiryDate(Instant expiryDate){this.expiryDate=expiryDate;}
  public boolean isRevoked(){return revoked;}
  public void setRevoked(boolean revoked){this.revoked=revoked;}
  public String getIpAddress(){return ipAddress;}
  public void setIpAddress(String ipAddress){this.ipAddress=ipAddress;}
  public String getUserAgent(){return userAgent;}
  public void setUserAgent(String userAgent){this.userAgent=userAgent;}
}
