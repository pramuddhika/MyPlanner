package com.todoapp.myplanner_be.dto.categoryList;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Category information")
public class CategoryResponseDTO {
    
    @Schema(
        description = "Category ID",
        example = "1"
    )
    private Integer categoryId;
    
    @Schema(
        description = "Category name",
        example = "Work"
    )
    private String categoryName;
}
