package br.edu.ifrs.poa.api_forum.users;

public record FavoriteQuestionResponse(String userId, String questionId) {
    public FavoriteQuestionResponse(FavoriteQuestion newFavorite) {
        this(newFavorite.getUserId(), newFavorite.getQuestionId());
    }
}
