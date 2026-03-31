package com.hotelbooking.dto.request;

import com.hotelbooking.model.RoomType;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class RoomRequest {
    @NotBlank(message = "Room number is required")
    private String roomNumber;

    @NotNull(message = "Room type is required")
    private RoomType roomType;

    @NotNull(message = "Price per night is required")
    @Min(value = 0, message = "Price must be non-negative")
    private BigDecimal pricePerNight;

    @Min(value = 1, message = "Max occupancy must be at least 1")
    private int maxOccupancy;

    private String description;
    private String imageUrl;
    private boolean isAvailable = true;
    private Set<String> amenities;
}
