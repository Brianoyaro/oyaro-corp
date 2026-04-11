package com.oyaro_corp.oyaro.corporation.category.dto;

import java.util.ArrayList;
import java.util.List;

public class CategoryTreeNode {
    private Long id;
    private String name;
    private List<CategoryTreeNode> children = new ArrayList<>();

    //
    public CategoryTreeNode() {}

    public CategoryTreeNode(Long id, List<CategoryTreeNode> children, String name) {
        this.id = id;
        this.children = children;
        this.name = name;
    }

    //

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CategoryTreeNode> getChildren() {
        return children;
    }

    public void setChildren(List<CategoryTreeNode> children) {
        this.children = children;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
