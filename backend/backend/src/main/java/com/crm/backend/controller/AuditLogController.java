package com.crm.backend.controller;

import com.crm.backend.repository.AuditLogRepository;
import com.crm.backend.security.UserDetailsImpl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/audit-logs")
@CrossOrigin(origins = "*", maxAge = 3600)
public class AuditLogController {
    
    private final AuditLogRepository auditLogRepository;
    
    public AuditLogController(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }
    
    @GetMapping
    public ResponseEntity<?> getLogs(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        if (!"ROLE_ADMIN".equals(userDetails.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only Admins can view audit logs.");
        }
        return ResponseEntity.ok(auditLogRepository.findAllByOrderByTimestampDesc());
    }
}
