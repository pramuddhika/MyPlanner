package com.todoapp.myplanner_be.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI myPlannerOpenAPI() {
        // Define JWT security scheme
        final String securitySchemeName = "bearerAuth";
        
        Server devServer = new Server();
        devServer.setUrl("http://localhost:8080");
        devServer.setDescription("Development Server");

        Server prodServer = new Server();
        prodServer.setUrl("https://api.myplanner.com");
        prodServer.setDescription("Production Server");

        Contact contact = new Contact();
        contact.setEmail("support@myplanner.com");
        contact.setName("MyPlanner Support Team");
        contact.setUrl("https://www.myplanner.com/support");

        License mitLicense = new License()
                .name("MIT License")
                .url("https://choosealicense.com/licenses/mit/");

        Info info = new Info()
                .title("MyPlanner Task Management API")
                .version("1.0.0")
                .contact(contact)
                .description("This API exposes endpoints to manage tasks, users, and statuses in the MyPlanner application. " +
                            "It provides comprehensive task management features including user authentication, " +
                            "task creation, status tracking, and more. " +
                            "\n\nTo use protected endpoints, first login via /api/user/login to get a JWT token, " +
                            "then click the 'Authorize' button and enter: Bearer {your-token}")
                .termsOfService("https://www.myplanner.com/terms")
                .license(mitLicense);

        return new OpenAPI()
                .info(info)
                .servers(List.of(devServer, prodServer))
                .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
                .components(new Components()
                    .addSecuritySchemes(securitySchemeName, new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Enter JWT token obtained from /api/user/login endpoint")));
    }
}
