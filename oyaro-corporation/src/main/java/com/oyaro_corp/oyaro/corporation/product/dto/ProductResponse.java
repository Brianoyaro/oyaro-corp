package com.oyaro_corp.oyaro.corporation.product.dto;


import java.util.List;

public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private Double price;
    private Long categoryId;
    private String attributes;

    private List<ImageResponse> images;

    public ProductResponse() {
    }

    public ProductResponse(String name, String description, Double price, String attributes, Long categoryId, List<ImageResponse> images) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.attributes = attributes;
        this.categoryId = categoryId;
        this.images = images;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<ImageResponse> getImages() {
        return images;
    }

    public void setImages(List<ImageResponse> images) {
        this.images = images;
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
}
