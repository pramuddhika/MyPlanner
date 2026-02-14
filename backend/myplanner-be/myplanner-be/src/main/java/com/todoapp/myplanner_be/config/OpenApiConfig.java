package com.todoapp.myplanner_be.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI myPlannerOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");

        Info info = new Info()
                .title("MyPlanner Task Management API")
                .version("1.0.0")
                .description("This API exposes endpoints to manage tasks, users, and statuses in the MyPlanner application. " +
                            "It provides comprehensive task management features including user authentication, " +
                            "task creation, status tracking, and more.");

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer));
    }
}
