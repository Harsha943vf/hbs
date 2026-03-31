package com.hotelbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelResponse {
    private Long id;
    private String name;
    private String description;
    private String location;
    private String address;
    private int starRating;
    private String imageUrl;
    private String phoneNumber;
    private String email;
    private String checkInTime;
    private String checkOutTime;
    private Set<String> amenities;
    private List<RoomResponse> rooms;
    private BigDecimal startingPrice;
    private int totalRooms;
    private LocalDateTime createdAt;
}
