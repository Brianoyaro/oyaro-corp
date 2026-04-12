package com.oyaro_corp.oyaro.corporation.category.dto;

import jakarta.annotation.Nullable;

public class CreateCategoryRequest {
    public String name;

    @Nullable
    public Long parentId; // nullable

    public CreateCategoryRequest() {}

    public CreateCategoryRequest(String name) {
        this.name = name;
    }

    //

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
}
