package com.todoapp.myplanner_be.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserCreationDTO {

    private String email;
    private String name;
    private String password;

}