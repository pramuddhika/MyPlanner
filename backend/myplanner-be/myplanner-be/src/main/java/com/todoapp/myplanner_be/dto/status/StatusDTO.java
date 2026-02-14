package com.todoapp.myplanner_be.dto.status;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StatusDTO {

    private Byte statusId;
    private String statusName;

}
