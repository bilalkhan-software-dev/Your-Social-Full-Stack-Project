
# **YourSocial – Full Stack Social Media Platform**

🌐 A **feature-rich social media application** built with **React (frontend)** and **Spring Boot (backend)**.
Designed to showcase **real-world full stack development skills** including authentication, real-time chat, media handling, and modern UI/UX.

[![React](https://img.shields.io/badge/React-18.2-blue)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-green)](https://spring.io/)
[![MySQL](https://img.shields.io/badge/MySQL-Database-orange)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/Security-JWT-red)](https://jwt.io/)
[![WebSocket](https://img.shields.io/badge/RealTime-Chat-purple)](https://stomp.github.io/)

---

## ✨ **Key Features**

### 🔒 Authentication & Authorization

* JWT-based secure login/register
* Password reset with OTP
* Role-based access (admin/user)

### 👥 User Management

* Update profile (avatar + banner)
* Follow/unfollow system
* User search

### 📝 Social Interactions

* Post CRUD (create, edit, delete)
* Likes, comments, and saves
* Comment like/dislike system

### 🎥 Media Features

* Reels (short videos CRUD)
* Stories (temporary content)
* **Cloudinary integration** for image/video hosting

### 💬 Real-Time Communication

* One-to-one chat (WhatsApp-style)
* WebSocket with **SockJS + StompJS**
* Live message delivery + message history

---

## 🛠️ **Tech Stack**

| Layer            | Technologies                                                                  |
| ---------------- | ----------------------------------------------------------------------------- |
| **Frontend**     | React.js, Redux, Material UI, TailwindCSS, Axios, Formik + Yup                |
| **Backend**      | Spring Boot, Spring Data JPA, Spring Security (JWT), WebSocket (STOMP/SockJS) |
| **Database**     | MySQL                                                                         |
| **Media**        | Cloudinary                                                                    |

---

## 🚀 **Getting Started**

### 🔧 Backend Setup

1. Clone backend repo & configure DB:

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
2. Run with:

   ```bash
   mvn spring-boot:run
   ```
3. API Docs: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)

### 💻 Frontend Setup

1. Clone frontend repo & install dependencies:

   ```bash
   npm install
   npm start
   ```
2. Configure API URL in `src/config/api.js`:

   ```javascript
   export const API_BASE_URL = "http://localhost:8081/api/v1";
   ```

---

## 📬 **Contact**

👨‍💻 Muhammad Bilal Khan
📩 [bilalkhan.devse@gmail.com](mailto:bilalkhan.devse@gmail.com)
🔗 [LinkedIn](https://www.linkedin.com/in/muhammad-bilal-khan-83660931b/)
💻 [GitHub](https://github.com/bilalkhan-software-dev)

---

🔥 *YourSocial is a complete full-stack project highlighting backend, frontend, and real-time communication skills.*

---
