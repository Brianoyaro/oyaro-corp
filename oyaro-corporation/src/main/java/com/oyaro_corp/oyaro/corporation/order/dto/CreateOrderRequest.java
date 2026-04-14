package com.oyaro_corp.oyaro.corporation.order.dto;


import java.util.List;

public class CreateOrderRequest {
    private List<OrderItemRequest> items;

    public CreateOrderRequest(List<OrderItemRequest> items) {
        this.items = items;
    }

    public CreateOrderRequest() {
    }

    public List<OrderItemRequest> getItems() {
        return items;
    }

    public void setItems(List<OrderItemRequest> items) {
        this.items = items;
    }
}
