package com.hotelbooking.controller;

import com.hotelbooking.dto.response.ApiResponse;
import com.hotelbooking.dto.response.DashboardStats;
import com.hotelbooking.model.User;
import com.hotelbooking.repository.UserRepository;
import com.hotelbooking.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAuthority('ROLE_ADMIN')")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<DashboardStats>> getDashboard() {
        log.info("Admin dashboard stats requested");
        return ResponseEntity.ok(ApiResponse.success("Dashboard stats retrieved",
                adminService.getDashboardStats()));
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }
}
