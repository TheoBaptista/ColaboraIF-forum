package br.edu.ifrs.poa.api_forum.authentication;

import br.edu.ifrs.poa.api_forum.util.JwtTokenUtil;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;

import java.io.IOException;

@Configuration
public class AuthenticationFilter implements Filter {

    private final JwtTokenUtil jwtTokenUtil;
    private final RedisService redisService;

    public AuthenticationFilter(JwtTokenUtil jwtTokenUtil, RedisService redisService) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.redisService = redisService;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;

        String requestPath = httpRequest.getRequestURI();


        if ("/api/login".equals(requestPath) || "/api/login/credentials".equals(requestPath)) {
            chain.doFilter(request, response);
            return;
        }

        String authorizationHeader = httpRequest.getHeader("Authorization");

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            String userInfo = redisService.getUserInfo(token);
            boolean isTokenValid = userInfo != null && jwtTokenUtil.validateToken(token);

            if (isTokenValid) {
                chain.doFilter(request, response);
                return;
            }
        }

        httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Token inválido ou não fornecido");
    }

}
