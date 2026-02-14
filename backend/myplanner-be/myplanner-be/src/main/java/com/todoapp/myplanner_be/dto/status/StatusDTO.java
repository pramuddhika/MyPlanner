package com.todoapp.myplanner_be.dto.status;

public class StatusDTO {

    public Byte statusId;
    public String statusName;

    public StatusDTO(Byte statusId, String statusName) {
        this.statusId = statusId;
        this.statusName = statusName;
    }

}
