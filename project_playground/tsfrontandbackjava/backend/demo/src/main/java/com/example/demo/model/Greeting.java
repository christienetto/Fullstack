package com.example.demo.model;

public class Greeting {
    
    private String message;
    private String info;

    public Greeting(String message, String info) {
        this.message = message;
        this.info = info;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
    public String getInfo() {
        return this.info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}
