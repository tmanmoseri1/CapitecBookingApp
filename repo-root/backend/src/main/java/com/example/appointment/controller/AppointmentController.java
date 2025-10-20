package com.example.appointment.controller;

import com.example.appointment.entity.Appointment;
import com.example.appointment.service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {
  private final AppointmentService service;

  public AppointmentController(AppointmentService service){ this.service = service; }

  @PostMapping
  public ResponseEntity<Appointment> create(@RequestBody Appointment a){
    return ResponseEntity.ok(service.create(a));
  }

  @GetMapping("/{id}")
  public ResponseEntity<Appointment> get(@PathVariable Long id){
    return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
  }

  @GetMapping
  public ResponseEntity<List<Appointment>> list(){ return ResponseEntity.ok(service.list()); }

  @PutMapping("/{id}")
  public ResponseEntity<Appointment> update(@PathVariable Long id, @RequestBody Appointment a){
    a.setId(id);
    return ResponseEntity.ok(service.update(a));
  }

  @DeleteMapping("/{id}")
  public ResponseEntity<?> delete(@PathVariable Long id){
    service.delete(id);
    return ResponseEntity.noContent().build();
  }
}
