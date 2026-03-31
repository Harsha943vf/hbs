package com.hotelbooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalHotels;
    private long totalRooms;
    private long totalUsers;
    private long totalBookings;
    private BigDecimal totalRevenue;
    private long confirmedBookings;
    private long cancelledBookings;
    private long completedBookings;
    private List<BookingResponse> recentBookings;
    private Map<String, Long> bookingsByMonth;
    private List<Map<String, Object>> topHotels;
}
