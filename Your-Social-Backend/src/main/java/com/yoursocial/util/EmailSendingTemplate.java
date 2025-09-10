package com.yoursocial.util;

public class EmailSendingTemplate {

    public static String sendEmailForPasswordReset(String firstName, Integer OTP) {
        return """
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                        }
                        .header {
                            background-color: #f2f2f3;
                            color: rgb(10, 115, 165);
                            padding: 10px 20px;
                            text-align: center;
                            border-radius: 5px 5px 0 0;
                        }
                        .content {
                            padding: 20px;
                            border: 1px solid #ddd;
                            border-top: none;
                            border-radius: 0 0 5px 5px;
                        }
                        .button {
                            display: inline-block;
                            padding: 10px 20px;
                            background-color: #4CAF50;
                            color: white;
                            text-decoration: none;
                            border-radius: 5px;
                            margin: 15px 0;
                        }
                        .footer {
                            margin-top: 20px;
                            font-size: 0.8em;
                            color: #777;
                            text-align: center;
                        }
                        .otp {
                            font-size: 24px;
                            font-weight: bold;
                            color: rgb(10, 115, 165);
                            text-align: center;
                            margin: 20px 0;
                        }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h2>Password Reset Request</h2>
                    </div>
                    <div class="content">
                        <p>Hello %s,</p>
                        <p>We received a request to reset your account password. Please use the following OTP to proceed:</p>
                
                        <div class="otp">%d</div>
                
                        <p>This OTP is valid for a 15 minutes. If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                        <p>For security reasons, don't share this OTP with anyone.</p>
                    </div>
                    <div class="footer">
                        <p>© 2025 Your Social. All rights reserved.</p>
                    </div>
                </body>
                </html>
                """.formatted(firstName, OTP);
    }
}
