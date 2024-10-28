package br.edu.ifrs.poa.api_forum.questions.cateogories;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public List<String> getCategories() {
        return categoryRepository.findAll()
                .stream()
                .map(Category::getName)
                .toList();
    }

    public boolean existsCategory(String name) {
        return categoryRepository.existsByName(name);
    }

}
