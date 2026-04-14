package com.oyaro_corp.oyaro.corporation.product.dto;

public class CreateProductRequest {
    private String name;
    private String description;
    private Double price;
    private Long categoryId;

    // JSON string
    private String attributes;

    public CreateProductRequest() {
    }

    public CreateProductRequest(String description, Double price, Long categoryId, String attributes) {
        this.description = description;
        this.price = price;
        this.categoryId = categoryId;
        this.attributes = attributes;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getAttributes() {
        return attributes;
    }

    public void setAttributes(String attributes) {
        this.attributes = attributes;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
