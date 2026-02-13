package com.todoApp.myPlanner.status;

import jakarta.persistence.*;
import lombok.*;
import java.util.ArrayList;
import java.util.List;
import com.todoApp.myPlanner.task.TaskEntity;

@Entity
@Table(name = "status")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@ToString(exclude = "tasks")
public class StatusEntity {

    @Id
    @Column(name = "statusId")
    @EqualsAndHashCode.Include
    private Byte statusId;

    @Column(name = "statusName", length = 15)
    private String statusName;

    @OneToMany(mappedBy = "status", cascade = CascadeType.ALL)
    private List<TaskEntity> tasks = new ArrayList<>();
}
