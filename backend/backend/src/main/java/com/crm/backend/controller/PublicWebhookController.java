package com.crm.backend.controller;

import com.crm.backend.model.Lead;
import com.crm.backend.repository.LeadRepository;
import com.crm.backend.service.AuditLogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/public/webhooks")
@CrossOrigin(origins = "*", maxAge = 3600)
public class PublicWebhookController {
    
    private final LeadRepository leadRepository;
    private final AuditLogService auditLogService;
    private final com.crm.backend.service.EmailService emailService;
    
    public PublicWebhookController(LeadRepository leadRepository, AuditLogService auditLogService, com.crm.backend.service.EmailService emailService) {
        this.leadRepository = leadRepository;
        this.auditLogService = auditLogService;
        this.emailService = emailService;
    }
    
    @PostMapping("/leads")
    public ResponseEntity<?> receiveLeadFromWebsite(@RequestBody Lead lead) {
        lead.setStatus("NEW");
        Lead savedLead = leadRepository.save(lead);
        
        auditLogService.logAction(
            "WEBHOOK_CREATE", 
            "System/Website", 
            "New lead received from website contact form: " + lead.getName() + " (" + lead.getCompany() + ")"
        );
        // Send email to admin
        emailService.sendNewLeadNotification("snehagaba233@gmail.com", lead.getName(), lead.getCompany());
        
        return ResponseEntity.ok(Map.of("message", "Lead received successfully from webhook"));
    }
}
