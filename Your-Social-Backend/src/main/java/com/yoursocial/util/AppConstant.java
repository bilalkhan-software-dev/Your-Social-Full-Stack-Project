package com.yoursocial.util;

import java.util.concurrent.TimeUnit;

public class AppConstant {


    public static String AUTHORIZATION_HEADER = "AUTHORIZATION";


    public static String SECRET_KEY = "SY-OYhbs7tpCE7aaLZvcXsZmNURW5bIWgG485Hpbcm3Ew_KVfjipCma60wbE_Cij";

    public static long JWT_TOKEN_EXPIRATION = TimeUnit.DAYS.toMillis(7);

    public static final int OTP_EXPIRATION_MINUTES = 15;
    public static final Integer PASSWORD_FINAL_LENGTH = 8;
}
