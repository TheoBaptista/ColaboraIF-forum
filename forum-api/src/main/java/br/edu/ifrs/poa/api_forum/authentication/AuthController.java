package br.edu.ifrs.poa.api_forum.authentication;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.val;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody @Valid  @NotNull LoginRequest loginRequest) {
        String idToken = loginRequest.idToken();

        val loginResponse = authService.authenticateUser(idToken);

        return ResponseEntity.ok(loginResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logout(@RequestHeader("Authorization") String authorizationHeader) {
        authService.logout(authorizationHeader);
        return ResponseEntity.ok("Logout realizado com sucesso");

    }

}
