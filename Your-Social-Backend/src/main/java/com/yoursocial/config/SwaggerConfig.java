package com.yoursocial.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class SwaggerConfig {

    @Value("${website.base.url}")
    private String url;

    @Bean
    public OpenAPI openAPI() {

        OpenAPI api = new OpenAPI();


        Info info = new Info();
        info.setTitle("Your Social Api");
        info.setDescription("Simple Social Media (Your Social) api using java and spring boot");
        info.setVersion("1.0.0");
        info.setContact(new Contact().email("bilalkhan.devse@gmail.com").name("Bilal Khan").url("https://www.linkedin.com/in/muhammad-bilal-khan-83660931b/"));
        info.setLicense(new License().url("https://www.linkedin.com/in/muhammad-bilal-khan-83660931b/").name("Bilal Khan"));

        List<Server> serverList = List.of(
                new Server().description("dev").url("http://localhost:8081"),
                new Server().description("prod").url(url)
        );

        SecurityScheme securityScheme = new SecurityScheme()
                .name("Authorization")
                .scheme("bearer")
                .type(SecurityScheme.Type.HTTP)
                .bearerFormat("JWT")
                .in(SecurityScheme.In.HEADER);

        Components components = new Components().addSecuritySchemes("Token", securityScheme);

        api.setServers(serverList);
        api.setSecurity(List.of(new SecurityRequirement().addList("Token")));
        api.setComponents(components);
        api.setInfo(info);

        return api;
    }
}
