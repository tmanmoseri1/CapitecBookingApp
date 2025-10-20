package com.example.appointment.controller;

import com.example.appointment.entity.User;
import com.example.appointment.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
public class MeController {

  private final UserRepository userRepository;

  public MeController(UserRepository userRepository){
    this.userRepository = userRepository;
  }

  @GetMapping("/me")
  public ResponseEntity<?> me(Authentication authentication){
    if(authentication == null || authentication.getName() == null){
      return ResponseEntity.status(401).build();
    }
    String username = authentication.getName();
    User u = userRepository.findByUsername(username).orElse(null);
    Set<String> roles = authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());
    return ResponseEntity.ok(new java.util.HashMap<String,Object>(){{
      put("username", username);
      put("roles", roles);
      put("id", u != null ? u.getId() : null);
    }});
  }
}
