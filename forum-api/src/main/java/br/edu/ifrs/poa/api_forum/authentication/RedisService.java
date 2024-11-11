package br.edu.ifrs.poa.api_forum.authentication;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
public class RedisService {

    private static final String TOKEN_PREFIX = "token:";

    private final RedisTemplate<String, Object> redisTemplate;

    public RedisService(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public void saveUserSession(String token, String userId, String email) {
        String sessionData = userId + ":" + email;
        redisTemplate.opsForValue().set(TOKEN_PREFIX + token, sessionData, 1, TimeUnit.HOURS);
    }

    public String getUserInfo(String token) {
        return (String) redisTemplate.opsForValue().get(TOKEN_PREFIX + token);
    }

    public void deleteUserSession(String token) {
        redisTemplate.delete(TOKEN_PREFIX + token);
    }

}
