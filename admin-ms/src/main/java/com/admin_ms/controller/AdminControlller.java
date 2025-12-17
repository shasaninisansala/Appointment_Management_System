package com.admin_ms.controller;

import com.admin_ms.data.Admin;
import com.admin_ms.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

@RestController
@CrossOrigin(origins = "http://localhost:3000/")
public class AdminControlller {
    @Autowired
    private AdminService adminService;

    @PostMapping(path ="/admins/login")
    public ResponseEntity<String> login(@RequestBody Admin loginUser) {
        String result = adminService.login(loginUser);

        if (result.startsWith("Login successful")) {
            return ResponseEntity.ok(result);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(result);
        }
    }
}
