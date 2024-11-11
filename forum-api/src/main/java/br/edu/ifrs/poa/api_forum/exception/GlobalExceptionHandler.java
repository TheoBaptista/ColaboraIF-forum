package br.edu.ifrs.poa.api_forum.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(SecurityException.class)
    public ResponseEntity<Object> handleUnauthorizedException(SecurityException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.UNAUTHORIZED, ex.getMessage(), request);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Object> handleNotFoundException(ResourceNotFoundException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.NOT_FOUND, ex.getMessage(), request);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Object> handleResponseStatusException(ResponseStatusException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.valueOf(ex.getStatusCode().value()), ex.getReason(), request);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(Exception ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Ocorreu um erro inesperado", request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Object> handleValidationException(MethodArgumentNotValidException ex, HttpServletRequest request) {
        return buildValidationErrorResponse(ex, request);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Object> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex, HttpServletRequest request) {
        return buildErrorResponse(HttpStatus.BAD_REQUEST, "Corpo da requisição ausente ou inválido", request);
    }

    private ResponseEntity<Object> buildErrorResponse(HttpStatus status, String message, HttpServletRequest request) {
        Map<String, Object> errorDetails = createBaseErrorDetails(status, message, request);
        logError(message, status, request.getRequestURI());
        return new ResponseEntity<>(errorDetails, status);
    }

    private ResponseEntity<Object> buildValidationErrorResponse(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<String> validationErrors = extractValidationErrors(ex);
        Map<String, Object> errorDetails = createBaseErrorDetails(HttpStatus.BAD_REQUEST, "Erro de validação", request);
        errorDetails.put("errors", validationErrors);

        logValidationError(validationErrors);
        return new ResponseEntity<>(errorDetails, HttpStatus.BAD_REQUEST);
    }

    private Map<String, Object> createBaseErrorDetails(HttpStatus status, String message, HttpServletRequest request) {
        Map<String, Object> errorDetails = new LinkedHashMap<>();
        errorDetails.put("timestamp", LocalDateTime.now());
        errorDetails.put("status", status.value());
        errorDetails.put("error", status.getReasonPhrase());
        errorDetails.put("message", message);
        errorDetails.put("path", request.getRequestURI());
        return errorDetails;
    }

    private List<String> extractValidationErrors(MethodArgumentNotValidException ex) {
        return ex.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();
    }

    private void logError(String message, HttpStatus status, String path) {
        log.error("Erro: {} | Status: {} | Path: {}", message, status.value(), path);
    }

    private void logValidationError(List<String> validationErrors) {
        log.error("Erro de validação: {}", validationErrors);
    }
}
