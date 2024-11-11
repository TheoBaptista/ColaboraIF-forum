package br.edu.ifrs.poa.api_forum.config;

import br.edu.ifrs.poa.api_forum.questions.cateogories.Category;
import br.edu.ifrs.poa.api_forum.questions.cateogories.CategoryRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.io.InputStream;
import java.util.List;

@Slf4j
@Configuration
public class DatabaseConfiguration {

    private final CategoryRepository categoryRepository;
    private final ObjectMapper objectMapper;

    public DatabaseConfiguration(CategoryRepository categoryRepository, ObjectMapper objectMapper) {
        this.categoryRepository = categoryRepository;
        this.objectMapper = objectMapper;
    }

    @Bean
    CommandLineRunner initDatabase() {
        return args -> {

            categoryRepository.deleteAll();

            try (InputStream inputStream = getClass().getResourceAsStream("/categories.json")) {
                List<String> categories = objectMapper.readValue(inputStream, new TypeReference<>() {});

                categories.forEach(categoryName -> {
                        categoryRepository.save(new Category(categoryName));
                });

                log.info("Categorias inicializadas com sucesso.");
            } catch (Exception e) {
                log.error("Erro ao carregar as categorias do arquivo JSON", e);
            }
        };
    }
}
