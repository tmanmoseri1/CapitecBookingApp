package com.example.appointment.controller;

import com.example.appointment.entity.RefreshToken;
import com.example.appointment.entity.Role;
import com.example.appointment.entity.User;
import com.example.appointment.security.JwtUtil;
import com.example.appointment.service.RefreshTokenService;
import com.example.appointment.service.UserService;
import com.example.appointment.repository.RoleRepository;
import com.example.appointment.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserService userService;
  private final UserRepository userRepository;
  private final RoleRepository roleRepository;
  private final PasswordEncoder passwordEncoder;
  private final JwtUtil jwtUtil;
  private final RefreshTokenService refreshTokenService;

  public AuthController(UserService userService, UserRepository userRepository, RoleRepository roleRepository,
                        PasswordEncoder passwordEncoder, JwtUtil jwtUtil, RefreshTokenService refreshTokenService){
    this.userService = userService;
    this.userRepository = userRepository;
    this.roleRepository = roleRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtUtil = jwtUtil;
    this.refreshTokenService = refreshTokenService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody Map<String, String> body){
    String username = body.get("username");
    String password = body.get("password");
    if(username == null || password == null) return ResponseEntity.badRequest().body(Map.of("message", "username and password required"));
    if(userRepository.findByUsername(username).isPresent()) return ResponseEntity.badRequest().body(Map.of("message", "username already exists"));
    User u = new User();
    u.setUsername(username);
    u.setPassword(password);
    // assign ROLE_USER if exists
    Optional<Role> r = roleRepository.findByName("ROLE_USER");
    if(r.isPresent()){
      u.setRoles(Set.of(r.get()));
    }
    User saved = userService.save(u);
    return ResponseEntity.ok(Map.of("id", saved.getId(), "username", saved.getUsername()));
  }

  @PostMapping("/login")
  public ResponseEntity<?> login(@RequestBody Map<String, String> body, HttpServletRequest request){
    String username = body.get("username");
    String password = body.get("password");
    if(username == null || password == null) return ResponseEntity.badRequest().body(Map.of("message", "username and password required"));

    Optional<User> ou = userRepository.findByUsername(username);
    if(ou.isEmpty()) return ResponseEntity.status(401).body(Map.of("message", "invalid credentials"));
    User u = ou.get();
    if(!passwordEncoder.matches(password, u.getPassword())){
      return ResponseEntity.status(401).body(Map.of("message", "invalid credentials"));
    }

    String token = jwtUtil.generateToken(u.getUsername());
    String ip = extractClientIp(request);
    String ua = Optional.ofNullable(request.getHeader("User-Agent")).orElse("");
    RefreshToken refresh = refreshTokenService.createRefreshToken(u, ip, ua);

    Map<String, Object> resp = new HashMap<>();
    resp.put("token", token);
    resp.put("refreshToken", refresh.getToken());
    resp.put("username", u.getUsername());
    return ResponseEntity.ok(resp);
  }

  @PostMapping("/refresh")
  public ResponseEntity<?> refresh(@RequestBody Map<String, String> body, HttpServletRequest request){
    String refreshToken = body.get("refreshToken");
    if(refreshToken == null) return ResponseEntity.badRequest().body(Map.of("message", "refreshToken required"));

    Optional<RefreshToken> ort = refreshTokenService.findByToken(refreshToken);
    if(ort.isEmpty()) return ResponseEntity.status(401).body(Map.of("message", "invalid refresh token"));
    RefreshToken rt = ort.get();
    if(rt.isRevoked()) return ResponseEntity.status(401).body(Map.of("message", "refresh token revoked"));
    if(rt.getExpiryDate().isBefore(java.time.Instant.now())) return ResponseEntity.status(401).body(Map.of("message", "refresh token expired"));

    // rotate: revoke old token and create a new one
    refreshTokenService.revokeToken(rt);
    String ip = extractClientIp(request);
    String ua = Optional.ofNullable(request.getHeader("User-Agent")).orElse("");
    RefreshToken newRt = refreshTokenService.createRefreshToken(rt.getUser(), ip, ua);
    String token = jwtUtil.generateToken(rt.getUser().getUsername());

    Map<String, Object> resp = new HashMap<>();
    resp.put("token", token);
    resp.put("refreshToken", newRt.getToken());
    return ResponseEntity.ok(resp);
  }

  @PostMapping("/logout")
  public ResponseEntity<?> logout(@RequestBody(required = false) Map<String, String> body){
    // If refreshToken provided, revoke that single token; otherwise revoke all for user if username provided.
    if(body != null && body.containsKey("refreshToken")){
      String rt = body.get("refreshToken");
      Optional<RefreshToken> ort = refreshTokenService.findByToken(rt);
      ort.ifPresent(refreshTokenService::revokeToken);
      return ResponseEntity.ok(Map.of("message", "logged out"));
    }
    // else no body: client can include username to revoke all tokens for that user
    if(body != null && body.containsKey("username")){
      String username = body.get("username");
      Optional<User> ou = userRepository.findByUsername(username);
      ou.ifPresent(refreshTokenService::revokeAllTokensForUser);
    }
    return ResponseEntity.ok(Map.of("message", "logged out"));
  }

  private String extractClientIp(HttpServletRequest request){
    String xf = request.getHeader("X-Forwarded-For");
    if(xf != null && !xf.isBlank()){
      return xf.split(",")[0].trim();
    }
    return request.getRemoteAddr();
  }
}
