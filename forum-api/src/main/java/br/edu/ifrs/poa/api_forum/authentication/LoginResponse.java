package br.edu.ifrs.poa.api_forum.authentication;

public record LoginResponse(String token, String name, String email, String id) {

}
