package com.oyaro_corp.oyaro.corporation.category.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name="categories",
        indexes = {
        @Index(name="idx_path", columnList = "path"), @Index(name = "idx_parent", columnList = "parent_id")}
)
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, length = 255)
    private String path;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_id")
    private Category parent;

    @OneToMany(mappedBy = "parent")
    private List<Category> children = new ArrayList<>();

    private LocalDateTime createdAt = LocalDateTime.now();

    // No args
    public Category() {}

    // All Args
    // path attribute will be set in the service layer when creating the category
    public Category(String name) {
        this.name = name;
    }

    /*
    // version 2
    // -------------
    @PrePersist
    private void generate Path() {
        if (parent != null) {
            this.path = parent.getPath() + this.id
        } else {
            this.path = '/' + this.id + '/'
        }
    }
     */


    // getters and setters

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

    public Category getParent() {
        return parent;
    }

    public void setParent(Category parent) {
        this.parent = parent;
    }

    public List<Category> getChildren() {
        return children;
    }

    public void setChildren(List<Category> children) {
        this.children = children;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
