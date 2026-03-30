package com.eventzen.auth.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class TestController {

    @GetMapping("/admin/test")
    public String adminTest() {
        return "ADMIN API WORKING";
    }

    @GetMapping("/customer/test")
    public String customerTest() {
        return "CUSTOMER API WORKING";
    }
}