package com.oyaro_corp.oyaro.corporation.product.dto;

public class ImageResponse {
    private Long id;
    private String imageUrl;
    private boolean isPrimary;

    public ImageResponse() {
    }

    public ImageResponse(boolean isPrimary, String imageUrl) {
        this.isPrimary = isPrimary;
        this.imageUrl = imageUrl;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public boolean getPrimary() {
        return isPrimary;
    }

    public void setPrimary(boolean primary) {
        isPrimary = primary;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
