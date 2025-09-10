# **YourSocial Backend API Documentation**  
**🚀 Spring Boot REST API for Social Media Platform**  

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-green)](https://spring.io/)
[![Java](https://img.shields.io/badge/Java-17-blue)](https://www.oracle.com/java/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange)](https://jwt.io/)

## **📌 API Endpoints Summary**

### **🔐 Authentication Service** (`/api/v1/auth`)
| Endpoint | Method | Description | Request/Response |
|----------|--------|-------------|------------------|
| `/check/{email}` | POST | Check email availability | `String email` → `Boolean` |
| `/register` | POST | Register new user | `UserRequest` → `UserResponse` |
| `/login` | POST | User login | `LoginRequest` → `JWTResponse` |
| `/reset-password-request/{email}` | GET | Initiate password reset (sends OTP) | `String email` → `StatusResponse` |
| `/verify-otp/{otp}/{email}` | GET | Verify OTP for password reset | `Integer otp, String email` → `Boolean` |
| `/reset-password` | PUT | Complete password reset | `ResetPasswordRequest` → `StatusResponse` |

### **👤 User Management** (`/api/v1/user`)
| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/profile` | GET | Get current user profile | - |
| `/all` | GET | Get all users (admin) | - |
| `/search/{query}` | GET | Search users | `String query` |
| `/update` | PUT | Update user profile | `UpdateUserRequest` |
| `/follow/{userId}` | PUT | Follow/unfollow user | `Integer userId` |
| `/{userId}` | GET | Get user by ID | `Integer userId` |
| `/delete/{userId}` | DELETE | Delete user (admin) | `Integer userId` |

### **📝 Post Service** (`/api/v1/post`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/create` | POST | Create new post |
| `/all` | GET | Get all posts |
| `/user/all` | GET | Get current user's posts |
| `/user/save/all` | GET | Get user's saved posts |
| `/{postId}` | GET | Get post by ID |
| `/delete/{postId}` | DELETE | Delete post |
| `/like/{postId}` | PUT | Like/unlike post |
| `/saved/{postId}` | PUT | Save/unsave post |
| `/update/{postId}` | PUT | Update post |

### **💬 Comment Service** (`/api/v1/comment`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/create/post/{postId}` | POST | Add comment to post |
| `/all/{postId}` | GET | Get post comments |
| `/all` | GET | Get all comments (admin) |
| `/{commentId}` | GET | Get comment details |
| `/like/{commentId}` | PUT | Like/unlike comment |

### **🎥 Reel Service** (`/api/v1/reel`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/create` | POST | Create new reel |
| `/all` | GET | Get all reels (admin) |
| `/user/all` | GET | Get user's reels |
| `/user/delete/{reelId}` | DELETE | Delete reel |

### **📖 Story Service** (`/api/v1/story`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/create` | POST | Create new story |
| `/user` | GET | Get user's stories |
| `/delete/{storyId}` | DELETE | Delete story |

### **💬 Chat Service** (`/api/v1/chat`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/create` | POST | Create new chat |
| `/user/all` | GET | Get user's chats |
| `/{chatId}` | GET | Get chat details |
| `/user/delete/{chatId}` | DELETE | Delete chat |

### **✉️ Message Service** (`/api/v1/message`)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/create/chat/{chatId}` | POST | Send message |
| `/chat/{chatId}` | GET | Get chat messages |


## **🚀 Deployment Notes**
1. Configure database in `application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/yoursocial
   spring.datasource.username=dbuser
   spring.datasource.password=dbpass
   ```





---

**🌟 Looking for junior backend opportunities to grow my Spring Boot expertise!**  
📩 **Contact:** [bilalkhan.devse@gmail.com](mailto:bilalkhan.devse@gmail.com)  
🔗 **LinkedIn:** [Muhammad Bilal Khan](https://www.linkedin.com/in/muhammad-bilal-khan-83660931b/)  

**Happy Coding!** 👨‍💻
