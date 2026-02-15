package com.todoapp.myplanner_be.util;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

@Component
public class AuthUtil {

    /**
     * Extract email from the current request
     * The email is set by JwtRequestFilter in request attributes
     */
    public static String getEmailFromRequest(HttpServletRequest request) {
        Object email = request.getAttribute("email");
        return email != null ? email.toString() : null;
    }

    /**
     * Extract userId from the current request
     * The userId is set by JwtRequestFilter in request attributes
     */
    public static Integer getUserIdFromRequest(HttpServletRequest request) {
        Object userId = request.getAttribute("userId");
        return userId != null ? (Integer) userId : null;
    }
}
