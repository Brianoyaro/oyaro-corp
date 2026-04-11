package com.oyaro_corp.oyaro.corporation.category.dto;

import jakarta.annotation.Nullable;

public class CategoryResponse {
    private Long id;
    private String  name;
    private String path;

    @Nullable
    private Long parentId;

    public CategoryResponse() {}

    public CategoryResponse(Long id, String name, String path, Long parentId) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.parentId = parentId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    @Nullable
    public Long getParentId() {
        return parentId;
    }

    public void setParentId(@Nullable Long parentId) {
        this.parentId = parentId;
    }
}
