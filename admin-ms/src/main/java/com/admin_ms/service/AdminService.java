package com.admin_ms.service;

import com.admin_ms.data.Admin;
import com.admin_ms.data.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminService {
    @Autowired
    private AdminRepository adminRepo;

    public String login(Admin loginUser) {
        Admin admin = adminRepo.findByUsername(loginUser.getUsername());

        if (admin != null && admin.getPassword().equals(loginUser.getPassword())) {
            return "Login successful as " + admin.getRole()+" "+ admin.getUsername();
        } else {
            return "Invalid username or password";
        }
    }
}
