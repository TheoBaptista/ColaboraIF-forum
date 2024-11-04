package br.edu.ifrs.poa.api_forum.authentication;

import br.edu.ifrs.poa.api_forum.users.User;
import br.edu.ifrs.poa.api_forum.users.UserRepository;
import br.edu.ifrs.poa.api_forum.util.JwtTokenUtil;
import com.nimbusds.jose.jwk.source.RemoteJWKSet;
import com.nimbusds.jose.proc.SecurityContext;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.net.MalformedURLException;
import java.net.URI;
import java.text.ParseException;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtTokenUtil jwtTokenUtil;
    private final RemoteJWKSet<SecurityContext> jwkSet;
    private final RedisService redisService;

    @Autowired
    public AuthService(UserRepository userRepository, JwtTokenUtil jwtTokenUtil, RedisService redisService) throws MalformedURLException {
        this.userRepository = userRepository;
        this.jwtTokenUtil = jwtTokenUtil;
        this.redisService = redisService;
        this.jwkSet = new RemoteJWKSet<>(URI.create("https://www.googleapis.com/oauth2/v3/certs").toURL());
    }

    public LoginResponse authenticateUser(String idToken) {
        try {
            var payload = parseTokenPayload(idToken);
            String email = payload.getStringClaim("email");

            validateEmailDomain(email);

            User user = findOrCreateUser(email, payload.getStringClaim("name"));

            var userInfo = new LoginResponse(jwtTokenUtil.generateToken(user.getId(), email), user.getName(), user.getEmail(), user.getId());

            redisService.saveUserSession(userInfo.token(), userInfo.name(), userInfo.email());

            return userInfo;

        } catch (ParseException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token enviado é inválido", e);
        }
    }

    public void logout(String token) {
        if (!token.startsWith("Bearer ")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token é obrigatório");
        }
        token = token.substring(7);

        redisService.deleteUserSession(token);
    }

    private void validateEmailDomain(String email) {
        if (!email.endsWith("ifrs.edu.br")) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail não autorizado");
        }
    }

    private User findOrCreateUser(String email, String name) {
        return userRepository.findByEmail(email)
                .orElseGet(() -> userRepository.save(new User(email, name)));
    }

    private JWTClaimsSet parseTokenPayload(String idToken) throws ParseException {
        JWT jwt = JWTParser.parse(idToken);
        return jwt.getJWTClaimsSet();
    }
}