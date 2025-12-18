package com.example.demo.service;

import org.springframework.stereotype.Service;

import com.example.demo.model.Greeting;

@Service
public class ServiceTest {
    private final String info_attach = "Huuligan"; 
    
    public Greeting GreetingService(String name) {
        return new Greeting(name, info_attach);
   } 
}
