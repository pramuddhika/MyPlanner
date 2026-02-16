package com.todoapp.myplanner_be;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MyplannerBeApplication {

	public static void main(String[] args) {
		SpringApplication.run(MyplannerBeApplication.class, args);
	}

}
