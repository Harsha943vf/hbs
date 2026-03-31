package com.hotelbooking.controller;

import com.hotelbooking.dto.request.HotelRequest;
import com.hotelbooking.dto.request.RoomRequest;
import com.hotelbooking.dto.response.ApiResponse;
import com.hotelbooking.dto.response.HotelResponse;
import com.hotelbooking.dto.response.PagedResponse;
import com.hotelbooking.dto.response.RoomResponse;
import com.hotelbooking.service.HotelService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/hotels")
@RequiredArgsConstructor
@Slf4j
public class HotelController {

    private final HotelService hotelService;

    @GetMapping
    public ResponseEntity<ApiResponse<PagedResponse<HotelResponse>>> getAllHotels(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(ApiResponse.success("Hotels retrieved", hotelService.getAllHotels(pageable)));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<PagedResponse<HotelResponse>>> searchHotels(
            @RequestParam(required = false) String location,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        log.info("Search hotels: location={}, checkIn={}, checkOut={}", location, checkIn, checkOut);
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(ApiResponse.success("Search results",
                hotelService.searchHotels(location, checkIn, checkOut, pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<HotelResponse>> getHotelById(
            @PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkIn,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate checkOut) {
        return ResponseEntity.ok(ApiResponse.success("Hotel retrieved",
                hotelService.getHotelById(id, checkIn, checkOut)));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<HotelResponse>> createHotel(@Valid @RequestBody HotelRequest request) {
        log.info("Creating hotel: {}", request.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Hotel created", hotelService.createHotel(request)));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<HotelResponse>> updateHotel(
            @PathVariable Long id, @Valid @RequestBody HotelRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Hotel updated", hotelService.updateHotel(id, request)));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteHotel(@PathVariable Long id) {
        hotelService.deleteHotel(id);
        return ResponseEntity.ok(ApiResponse.success("Hotel deleted"));
    }

    @PostMapping("/{hotelId}/rooms")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<RoomResponse>> addRoom(
            @PathVariable Long hotelId, @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Room added", hotelService.addRoom(hotelId, request)));
    }

    @PutMapping("/rooms/{roomId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
            @PathVariable Long roomId, @Valid @RequestBody RoomRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Room updated", hotelService.updateRoom(roomId, request)));
    }

    @DeleteMapping("/rooms/{roomId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteRoom(@PathVariable Long roomId) {
        hotelService.deleteRoom(roomId);
        return ResponseEntity.ok(ApiResponse.success("Room deleted"));
    }
}
