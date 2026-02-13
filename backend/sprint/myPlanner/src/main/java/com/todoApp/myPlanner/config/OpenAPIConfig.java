package com.todoApp.myPlanner.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenAPIConfig {

    @Value("${myplanner.openapi.dev-url:http://localhost:8080}")
    private String devUrl;

    @Bean
    public OpenAPI myPlannerOpenAPI() {
        Server devServer = new Server();
        devServer.setUrl(devUrl);

        Info info = new Info()
                .title("MyPlanner Task Management API")
                .version("1.0.0")
                .description("This API provides endpoints for managing tasks, categories, users, and status in the MyPlanner application.");

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer));
    }
}
