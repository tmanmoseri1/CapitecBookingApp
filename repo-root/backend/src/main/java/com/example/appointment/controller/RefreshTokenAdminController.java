package com.example.appointment.controller;

import com.example.appointment.entity.RefreshToken;
import com.example.appointment.service.RefreshTokenService;
import com.example.appointment.repository.RefreshTokenRepository;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin")
public class RefreshTokenAdminController {

  private final RefreshTokenRepository repo;
  private final RefreshTokenService service;

  public RefreshTokenAdminController(RefreshTokenRepository repo, RefreshTokenService service){
    this.repo = repo;
    this.service = service;
  }

  @GetMapping("/refresh-tokens")
  @PreAuthorize("hasRole('ADMIN')")
  public List<RefreshToken> listAll(@RequestParam(value = "username", required = false) String username){
    if(username == null) return repo.findAll();
    return repo.findAll().stream().filter(rt -> rt.getUser() != null && username.equals(rt.getUser().getUsername())).toList();
  }

  @PostMapping("/refresh-tokens/{id}/revoke")
  @PreAuthorize("hasRole('ADMIN')")
  public void revoke(@PathVariable Long id){
    Optional<RefreshToken> ort = repo.findById(id);
    ort.ifPresent(service::revokeToken);
  }
}
