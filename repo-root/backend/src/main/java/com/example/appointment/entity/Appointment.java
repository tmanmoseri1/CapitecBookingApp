package com.example.appointment.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
public class Appointment {
  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String title;

  private String description;

  private LocalDateTime startAt;

  private LocalDateTime endAt;

  @ManyToOne
  @JoinColumn(name = "user_id")
  private User user;

  // getters/setters
  public Long getId(){return id;}
  public void setId(Long id){this.id=id;}
  public String getTitle(){return title;}
  public void setTitle(String title){this.title=title;}
  public String getDescription(){return description;}
  public void setDescription(String description){this.description=description;}
  public LocalDateTime getStartAt(){return startAt;}
  public void setStartAt(LocalDateTime startAt){this.startAt=startAt;}
  public LocalDateTime getEndAt(){return endAt;}
  public void setEndAt(LocalDateTime endAt){this.endAt=endAt;}
  public User getUser(){return user;}
  public void setUser(User user){this.user=user;}
}
