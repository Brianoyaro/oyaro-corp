package com.oyaro_corp.oyaro.corporation.category.dto;

public class CreateCategoryRequest {
    public String name;
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
