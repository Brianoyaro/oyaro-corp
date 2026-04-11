package com.oyaro_corp.oyaro.corporation.category.repository;

import com.oyaro_corp.oyaro.corporation.category.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRespository extends JpaRepository<Category, Long> {
    //
    List<Category> findByParentId(Long parentId);

    @Query("SELECT c FROM Category c WHERE c.path LIKE CONCAT(:path, '%')")
    List<Category> findDescendants(String path);

    @Query("SELECT c FROM Category c WHERE :path LIKE CONCAT(c.path, '%') ORDER BY c.path")
    List<Category> findAncestors(String path);
}
