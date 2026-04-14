package com.oyaro_corp.oyaro.corporation.category.service;

import com.oyaro_corp.oyaro.corporation.category.dto.CategoryResponse;
import com.oyaro_corp.oyaro.corporation.category.dto.CategoryTreeNode;
import com.oyaro_corp.oyaro.corporation.category.dto.CreateCategoryRequest;
import com.oyaro_corp.oyaro.corporation.category.entity.Category;
import com.oyaro_corp.oyaro.corporation.category.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional
public class CategoryService {

    private final CategoryRepository categoryRespository;

    public CategoryService(CategoryRepository categoryRespository) {
        this.categoryRespository = categoryRespository;
    }

    // create category
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        //
        Category category = new Category();
        category.setName(request.name);

        // if parenId is present, this category has a parent else it is a root node.
        if (request.parentId != null) {
            Category parent = categoryRespository.findById(request.parentId).orElseThrow(() -> new RuntimeException("Parent not found."));
            category.setParent(parent);
        }

        // save to get id
        category = categoryRespository.save(category);

        // build its path
        if (category.getParent() == null) {
            category.setPath("/" + category.getId() + "/");
        } else {
            category.setPath(category.getParent().getPath() + category.getId() + "/");
        }
        category = categoryRespository.save(category);
        return mapToResponse(category);
    }

    // get category
    public CategoryResponse getCategory(Long id) {
        Category category = categoryRespository.findById(id).orElseThrow(() -> new RuntimeException("Category NOT found."));
        return mapToResponse(category);
    }

    // get direct children
    public List<CategoryResponse> getChildren(Long parentId) {
        return categoryRespository.findByParentId(parentId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // get all descendant
    public List<CategoryResponse> getDescendants(Long id) {
        Category category = categoryRespository.findById(id).orElseThrow(() -> new RuntimeException("Category NOT found"));
        return categoryRespository.findDescendants(category.getPath())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // get ancestors
    public List<CategoryResponse> getAncestors(Long id) {
        Category category = categoryRespository.findById(id).orElseThrow();
        return categoryRespository.findAncestors(category.getPath())
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // build full tree
    public List<CategoryTreeNode> getTree() {
        List<Category> categories = categoryRespository.findAll();

        Map<Long, CategoryTreeNode> map = new HashMap<>();

        for (Category c : categories) {
            map.put(c.getId(), new CategoryTreeNode());
            map.get(c.getId()).setId(c.getId());
            map.get(c.getId()).setName(c.getName());
        }

        List<CategoryTreeNode> roots = new ArrayList<>();

        for (Category c : categories) {
            CategoryTreeNode node = map.get(c.getId());

            if (c.getParent() == null) {
                roots.add(node);
            } else {
                map.get(c.getParent().getId()).getChildren().add(node);
            }
        }

        return roots;
    }

    // ✅ MOVE CATEGORY (ADVANCED)
    public void moveCategory(Long categoryId, Long newParentId) {
        Category category = categoryRespository.findById(categoryId).orElseThrow(() -> new RuntimeException("category NOT found."));
        Category newParent = categoryRespository.findById(newParentId).orElseThrow(() -> new RuntimeException("parent NOT found."));

        String oldPath = category.getPath();
        String newPath = newParent.getPath() + category.getId() + "/";

        category.setParent(newParent);
        categoryRespository.save(category);

        // Update subtree paths
        List<Category> descendants = categoryRespository.findDescendants(oldPath);

        for (Category c : descendants) {
            c.setPath(c.getPath().replace(oldPath, newPath));
        }

        categoryRespository.saveAll(descendants);
    }

    // Mapper
    private CategoryResponse mapToResponse(Category c) {
        CategoryResponse res = new CategoryResponse();
        res.setId(c.getId());
        res.setName(c.getName());
        res.setPath(c.getPath());
        res.setParentId(c.getParent() != null ? c.getParent().getId() : null);
        return res;
    }

}