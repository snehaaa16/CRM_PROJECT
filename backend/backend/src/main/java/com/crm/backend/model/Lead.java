package com.crm.backend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "leads")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Lead {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    private String phone;
    
    private String company;

    // Status: NEW, CONTACTED, QUALIFIED, PROPOSAL, WON, LOST
    @Column(nullable = false)
    private String status = "NEW";

    private BigDecimal dealValue;

    private LocalDateTime createdAt = LocalDateTime.now();

    private Long assignedUserId;
    private String assignedUserName;
}
