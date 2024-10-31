package br.edu.ifrs.poa.api_forum.authentication;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/login")
public class AuthController {

    private final AuthService authService;
    private final RedisService redisService;

    public AuthController(AuthService authService, RedisService redisService) {
        this.authService = authService;
        this.redisService = redisService;
    }

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String idToken = loginRequest.idToken();
        if (idToken == null) {
            return ResponseEntity.badRequest().body("ID Token é obrigatório");
        }

        try {
            var userInfo = authService.authenticateUser(idToken);

            return ResponseEntity.ok(userInfo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String authorizationHeader) {

        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            return ResponseEntity.badRequest().body("Token é obrigatório");
        }

        String token = authorizationHeader.substring(7);

        try {
            authService.logout(token);
            return ResponseEntity.ok("Logout realizado com sucesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erro ao fazer logout");
        }
    }

}
