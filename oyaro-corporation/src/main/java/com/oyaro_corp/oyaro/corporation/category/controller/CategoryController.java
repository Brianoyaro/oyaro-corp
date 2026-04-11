package com.oyaro_corp.oyaro.corporation.category.controller;

import com.oyaro_corp.oyaro.corporation.category.dto.CategoryResponse;
import com.oyaro_corp.oyaro.corporation.category.dto.CategoryTreeNode;
import com.oyaro_corp.oyaro.corporation.category.dto.CreateCategoryRequest;
import com.oyaro_corp.oyaro.corporation.category.service.CategoryService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService service;

    public CategoryController(CategoryService service) {
        this.service = service;
    }

    // ✅ CREATE
    @PostMapping
    public CategoryResponse create(@RequestBody CreateCategoryRequest req) {
        return service.createCategory(req);
    }

    // ✅ GET ONE
    @GetMapping("/{id}")
    public CategoryResponse get(@PathVariable Long id) {
        return service.getCategory(id);
    }

    // ✅ GET CHILDREN
    @GetMapping("/{id}/children")
    public List<CategoryResponse> children(@PathVariable Long id) {
        return service.getChildren(id);
    }

    // ✅ GET DESCENDANTS
    @GetMapping("/{id}/descendants")
    public List<CategoryResponse> descendants(@PathVariable Long id) {
        return service.getDescendants(id);
    }

    // ✅ GET ANCESTORS
    @GetMapping("/{id}/ancestors")
    public List<CategoryResponse> ancestors(@PathVariable Long id) {
        return service.getAncestors(id);
    }

    // ✅ GET FULL TREE
    @GetMapping("/tree")
    public List<CategoryTreeNode> tree() {
        return service.getTree();
    }

    // ✅ MOVE CATEGORY
    @PutMapping("/{id}/move")
    public void move(@PathVariable Long id, @RequestParam Long newParentId) {
        service.moveCategory(id, newParentId);
    }
}
