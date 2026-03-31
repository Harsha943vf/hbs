package com.hotelbooking.service;

import com.hotelbooking.dto.response.BookingResponse;
import com.hotelbooking.dto.response.DashboardStats;
import com.hotelbooking.model.Booking;
import com.hotelbooking.model.BookingStatus;
import com.hotelbooking.repository.BookingRepository;
import com.hotelbooking.repository.HotelRepository;
import com.hotelbooking.repository.RoomRepository;
import com.hotelbooking.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final HotelRepository hotelRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final BookingService bookingService;

    public DashboardStats getDashboardStats() {
        long totalHotels = hotelRepository.count();
        long totalRooms = roomRepository.count();
        long totalUsers = userRepository.count();
        long totalBookings = bookingRepository.count();
        BigDecimal totalRevenue = bookingRepository.sumTotalRevenue();
        long confirmedBookings = bookingRepository.countByStatus(BookingStatus.CONFIRMED);
        long cancelledBookings = bookingRepository.countByStatus(BookingStatus.CANCELLED);
        long completedBookings = bookingRepository.countByStatus(BookingStatus.COMPLETED);

        List<Booking> recentRaw = bookingRepository.findRecentBookings(PageRequest.of(0, 10));
        List<BookingResponse> recentBookings = recentRaw.stream()
                .map(bookingService::toBookingResponse)
                .collect(Collectors.toList());

        Map<String, Long> bookingsByMonth = getBookingsByMonth();
        List<Map<String, Object>> topHotels = getTopHotels();

        return DashboardStats.builder()
                .totalHotels(totalHotels)
                .totalRooms(totalRooms)
                .totalUsers(totalUsers)
                .totalBookings(totalBookings)
                .totalRevenue(totalRevenue != null ? totalRevenue : BigDecimal.ZERO)
                .confirmedBookings(confirmedBookings)
                .cancelledBookings(cancelledBookings)
                .completedBookings(completedBookings)
                .recentBookings(recentBookings)
                .bookingsByMonth(bookingsByMonth)
                .topHotels(topHotels)
                .build();
    }

    private Map<String, Long> getBookingsByMonth() {
        LocalDateTime since = LocalDateTime.now().minusMonths(12);
        List<Object[]> results = bookingRepository.countBookingsByMonth(since);
        Map<String, Long> map = new LinkedHashMap<>();
        for (Object[] row : results) {
            map.put((String) row[0], (Long) row[1]);
        }
        return map;
    }

    private List<Map<String, Object>> getTopHotels() {
        List<Object[]> results = bookingRepository.findTopHotels(PageRequest.of(0, 5));
        List<Map<String, Object>> list = new ArrayList<>();
        for (Object[] row : results) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("hotelName", row[0]);
            entry.put("bookingCount", row[1]);
            entry.put("revenue", row[2]);
            list.add(entry);
        }
        return list;
    }
}
