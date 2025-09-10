package com.yoursocial.exception;

public class DuplicateLikeException extends RuntimeException {
    public DuplicateLikeException(String message) {
        super(message);
    }
}
