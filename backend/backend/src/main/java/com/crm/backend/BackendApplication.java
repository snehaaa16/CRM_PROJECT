package com.crm.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.crm.backend.model.User;
import com.crm.backend.repository.UserRepository;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(BackendApplication.class, args);
	}

	@Bean
	public CommandLineRunner createAdminUser(UserRepository userRepository, PasswordEncoder passwordEncoder) {
		return args -> {
			if (!userRepository.existsByUsername("superadmin")) {
				User admin = new User();
				admin.setUsername("superadmin");
				admin.setEmail("superadmin@crm.com");
				admin.setPassword(passwordEncoder.encode("superadmin123"));
				admin.setRole("ROLE_ADMIN");
				userRepository.save(admin);
				System.out.println("=================================================");
				System.out.println("SUPER ADMIN CREATED!");
				System.out.println("Username: superadmin");
				System.out.println("Password: superadmin123");
				System.out.println("=================================================");
			}
		};
	}
}
