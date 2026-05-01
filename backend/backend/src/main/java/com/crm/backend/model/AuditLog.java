package com.crm.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_logs")
@Data
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String action; // e.g., CREATE, UPDATE, DELETE
    private String performedBy; // Username
    private String details;
    
    private LocalDateTime timestamp = LocalDateTime.now();
}
