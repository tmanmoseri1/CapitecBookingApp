package com.example.appointment.service;

import com.example.appointment.entity.Appointment;
import com.example.appointment.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {
  private final AppointmentRepository repo;

  public AppointmentService(AppointmentRepository repo){
    this.repo = repo;
  }

  public Appointment create(Appointment a){ return repo.save(a); }
  public Optional<Appointment> get(Long id){ return repo.findById(id); }
  public List<Appointment> list(){ return repo.findAll(); }
  public Appointment update(Appointment a){ return repo.save(a); }
  public void delete(Long id){ repo.deleteById(id); }
  public List<Appointment> findByUser(Long userId){ return repo.findByUserId(userId); }
}
