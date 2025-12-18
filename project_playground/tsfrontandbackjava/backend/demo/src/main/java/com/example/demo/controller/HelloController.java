package com.example.demo.controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.Greeting;
import com.example.demo.service.ServiceTest;

@RestController
public class HelloController {
    private final ServiceTest anything;

    public HelloController(ServiceTest anything) {
        this.anything = anything;
    }

    @GetMapping("/hello")
    public Greeting hello(@RequestParam(defaultValue="default") String name) {
        return anything.GreetingService(name);
    }
}
