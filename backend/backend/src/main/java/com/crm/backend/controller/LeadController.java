package com.crm.backend.controller;

import com.crm.backend.model.Lead;
import com.crm.backend.repository.LeadRepository;
import com.crm.backend.security.UserDetailsImpl;
import com.crm.backend.service.AuditLogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leads")
public class LeadController {

    private final LeadRepository leadRepository;
    private final AuditLogService auditLogService;

    public LeadController(LeadRepository leadRepository, AuditLogService auditLogService) {
        this.leadRepository = leadRepository;
        this.auditLogService = auditLogService;
    }

    @GetMapping
    public ResponseEntity<List<Lead>> getAllLeads(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getRole();

        if ("ROLE_USER".equals(role)) {
            return ResponseEntity.ok(leadRepository.findByAssignedUserId(userDetails.getId()));
        } else {
            return ResponseEntity.ok(leadRepository.findAll());
        }
    }

    @PostMapping
    public ResponseEntity<Lead> createLead(@RequestBody Lead lead, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        
        if ("ROLE_USER".equals(userDetails.getRole())) {
            lead.setAssignedUserId(userDetails.getId());
            lead.setAssignedUserName(userDetails.getUsername());
        }
        
        Lead savedLead = leadRepository.save(lead);
        auditLogService.logAction("CREATE_LEAD", userDetails.getUsername(), "Created lead: " + savedLead.getName());
        return ResponseEntity.ok(savedLead);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateLead(@PathVariable Long id, @RequestBody Lead leadDetails, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        Lead lead = leadRepository.findById(id).orElseThrow(() -> new RuntimeException("Lead not found"));

        if ("ROLE_USER".equals(userDetails.getRole()) && 
            (lead.getAssignedUserId() == null || !lead.getAssignedUserId().equals(userDetails.getId()))) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("You can only edit your own leads");
        }

        lead.setName(leadDetails.getName());
        lead.setEmail(leadDetails.getEmail());
        lead.setPhone(leadDetails.getPhone());
        lead.setCompany(leadDetails.getCompany());
        lead.setStatus(leadDetails.getStatus());
        lead.setDealValue(leadDetails.getDealValue());

        if (!"ROLE_USER".equals(userDetails.getRole())) {
            lead.setAssignedUserId(leadDetails.getAssignedUserId());
            lead.setAssignedUserName(leadDetails.getAssignedUserName());
        }

        Lead updatedLead = leadRepository.save(lead);
        auditLogService.logAction("UPDATE_LEAD", userDetails.getUsername(), "Updated lead: " + updatedLead.getName() + " to status " + updatedLead.getStatus());
        return ResponseEntity.ok(updatedLead);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteLead(@PathVariable Long id, Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        if ("ROLE_USER".equals(userDetails.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Sales Representatives cannot delete leads");
        }

        Lead lead = leadRepository.findById(id).orElse(null);
        if (lead != null) {
            leadRepository.deleteById(id);
            auditLogService.logAction("DELETE_LEAD", userDetails.getUsername(), "Deleted lead: " + lead.getName());
        }
        return ResponseEntity.ok().build();
    }
}
