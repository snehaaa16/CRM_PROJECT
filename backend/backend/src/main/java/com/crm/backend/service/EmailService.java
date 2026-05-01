package com.crm.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender emailSender;

    public EmailService(JavaMailSender emailSender) {
        this.emailSender = emailSender;
    }

    public void sendNewLeadNotification(String to, String leadName, String company) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("crm.system@example.com");
            message.setTo(to);
            message.setSubject("New Lead Alert: " + leadName);
            message.setText("Hello,\n\nA new lead has been captured from your website webhook.\n\n" +
                    "Name: " + leadName + "\n" +
                    "Company: " + company + "\n\n" +
                    "Please login to your CRM dashboard to assign and process this lead.\n\n" +
                    "Best regards,\nCRM Automated System");
            
            emailSender.send(message);
        } catch (Exception e) {
            System.err.println("Failed to send email. Check SMTP credentials in application.properties.");
        }
    }
}
