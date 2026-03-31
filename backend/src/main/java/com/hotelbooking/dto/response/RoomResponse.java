package com.hotelbooking.dto.response;

import com.hotelbooking.model.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RoomResponse {
    private Long id;
    private String roomNumber;
    private RoomType roomType;
    private String roomTypeDisplay;
    private BigDecimal pricePerNight;
    private int maxOccupancy;
    private String description;
    private String imageUrl;
    private boolean isAvailable;
    private Set<String> amenities;
    private Long hotelId;
    private String hotelName;
}
