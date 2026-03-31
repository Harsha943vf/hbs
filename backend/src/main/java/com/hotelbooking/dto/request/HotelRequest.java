package com.hotelbooking.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.Set;

@Data
public class HotelRequest {
    @NotBlank(message = "Hotel name is required")
    private String name;

    private String description;

    @NotBlank(message = "Location is required")
    private String location;

    @NotBlank(message = "Address is required")
    private String address;

    @Min(value = 1, message = "Star rating must be at least 1")
    @Max(value = 5, message = "Star rating must be at most 5")
    private int starRating;

    private String imageUrl;
    private String phoneNumber;
    private String email;
    private String checkInTime;
    private String checkOutTime;
    private Set<String> amenities;
}
