package com.example.appointment.service;

import com.example.appointment.entity.User;
import com.example.appointment.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder){
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
  }

  public User save(User u){
    u.setPassword(passwordEncoder.encode(u.getPassword()));
    return userRepository.save(u);
  }

  public Optional<User> findByUsername(String username){
    return userRepository.findByUsername(username);
  }
}
