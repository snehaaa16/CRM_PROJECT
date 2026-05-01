# CRM Pro - Enterprise B2B Sales Pipeline

![CRM Pro Dashboard](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

CRM Pro is a full-stack, production-ready Sales Customer Relationship Management (CRM) platform designed for B2B enterprises. It features a modern "Midnight Tech" dark theme, military-grade Role-Based Access Control (RBAC), real-time pipeline analytics, and an automated lead injection webhook.

## 🌟 Key Features

- **Role-Based Access Control (RBAC):** Strict permissions separating System Admins, Sales Managers, and Sales Representatives. Reps only see and interact with their assigned leads.
- **Interactive Kanban Board:** Drag-and-drop sales pipeline for seamless lead progression and tracking.
- **Real-Time Analytics:** Live-updating Recharts integrations showing Revenue Pipeline and active Deal Distribution.
- **Automated Webhook Integration:** Public REST endpoint to capture leads directly from external marketing forms, instantly injecting them into the pipeline.
- **Email Notifications:** Automated Spring Mail integration alerts Admins when new high-value leads enter the system.
- **System Audit Logs:** Immutable system logs tracking every user action, lead update, and permission change for ultimate transparency.

## 🛠️ Tech Stack

**Frontend:**
- **Framework:** React 18
- **Styling:** Tailwind CSS (Custom Dark Glassmorphism)
- **Visualizations:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios

**Backend:**
- **Framework:** Java Spring Boot 3
- **Security:** Spring Security + JWT (JSON Web Tokens)
- **ORM:** Spring Data JPA (Hibernate)
- **Email:** Spring Boot Starter Mail
- **Database:** MySQL

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Java 17+
- MySQL Server

### 1. Backend Setup
Navigate to the backend configuration folder:
```bash
cd backend/backend/src/main/resources
```
Copy the example properties file:
```bash
cp application.properties.example application.properties
```
Update `application.properties` with your MySQL credentials and Gmail App Password for SMTP functionality. Then run the Spring Boot application.

### 2. Frontend Setup
Open a new terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
npm run dev
```
The application will be running at `http://localhost:5173`.

## 🔒 Security Highlights
- Passwords are encrypted using BCrypt before storing in the database.
- Stateless authentication using securely signed JSON Web Tokens (JWT).
- API routes are protected by Spring Security filters at the endpoint level.
- Frontend rendering restricts component visibility based on user roles (Admin vs. Sales Rep).
