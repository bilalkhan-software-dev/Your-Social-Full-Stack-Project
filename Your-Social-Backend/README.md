# **YourSocial – Backend API**

🚀 A full-stack **social media platform backend** built with **Spring Boot**, featuring real-time chat, post interactions, stories, and more.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-green)](https://spring.io/)
[![Java](https://img.shields.io/badge/Java-17-blue)](https://www.oracle.com/java/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-orange)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/Security-JWT%20Auth-red)](https://jwt.io/)
[![WebSocket](https://img.shields.io/badge/WebSocket-STOMP%20%2F%20SockJS-purple)](https://stomp.github.io/)

---

## 📌 **Overview**

YourSocial is a **feature-rich social media backend** designed with a modular and scalable architecture.
It powers core functionalities like **posts, comments, reels, stories, chat, and authentication**, while supporting **real-time communication**.

Swagger API docs are enabled for detailed endpoint exploration.

---

## ✨ **Features**

✅ User authentication & authorization with **JWT**
✅ User profile management with **avatar & banner support**
✅ **Post CRUD** operations (create, update, delete, like, save)
✅ **Comment system** (add, like, delete)
✅ **Reels** management (short video sharing)
✅ **Stories** (ephemeral content)
✅ **Real-time chat** (one-to-one messaging with WebSocket STOMP/SockJS, WhatsApp-like)
✅ Secure **password reset with OTP**
✅ Admin capabilities (manage users, posts, reels, comments)

---

## 🛠 **Tech Stack**

* **Backend Framework:** Spring Boot 3.4.5
* **Language:** Java 17
* **Database:** MySQL + Spring Data JPA
* **Authentication:** JWT
* **Real-time:** WebSocket with STOMP & SockJS
* **Build Tool:** Maven
* **Deployment Ready:** Railway.app / Docker

---

## ⚡ **Setup & Installation**

1. Clone the repository:

   ```bash
   git clone https://github.com/bilalkhan-software-dev/Your-Social-api.git
   cd your-social-api
   ```

2. **Configure properties** in `application.yml`:

   ```yaml
   spring:
     config:
       activate:
         on-profile: dev

     datasource:
       driver-class-name: com.mysql.cj.jdbc.Driver
       url: ${SQL_URL:jdbc:mysql://localhost:3306/your-social}
       username: ${SQL_USERNAME}
       password: ${SQL_PASSWORD}

     jpa:
       hibernate:
         ddl-auto: update
   ```

3. Run the application:

   ```bash
   mvn spring-boot:run
   ```

4. Access API documentation at:

   ```
   http://localhost:8081/swagger-ui.html
   ```

---

## 🚀 **Deployment Notes**

* Environment variables should store **DB credentials** & **JWT secret key**.
* Compatible with **Railway.app**, **Heroku**, or **Dockerized deployment**.

---

## 📬 **Contact**

👨‍💻 Muhammad Bilal Khan
📩 [bilalkhan.devse@gmail.com](mailto:bilalkhan.devse@gmail.com)
🔗 [LinkedIn – Muhammad Bilal Khan](https://www.linkedin.com/in/muhammad-bilal-khan-83660931b/)

---

🔥 *YourSocial Backend*

---
