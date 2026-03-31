package com.hotelbooking.dto.response;

import com.hotelbooking.model.BookingStatus;
import com.hotelbooking.model.RoomType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingReference;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private BigDecimal totalAmount;
    private int numberOfGuests;
    private BookingStatus status;
    private String specialRequests;
    private long numberOfNights;
    private LocalDateTime createdAt;

    // Room info
    private Long roomId;
    private String roomNumber;
    private RoomType roomType;
    private String roomTypeDisplay;

    // Hotel info
    private Long hotelId;
    private String hotelName;
    private String hotelLocation;
    private String hotelImageUrl;

    // User info
    private Long userId;
    private String userEmail;
    private String userName;
}
