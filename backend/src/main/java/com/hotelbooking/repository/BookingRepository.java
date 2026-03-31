package com.hotelbooking.repository;

import com.hotelbooking.model.Booking;
import com.hotelbooking.model.BookingStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserEmailOrderByCreatedAtDesc(String email);

    Page<Booking> findAllByOrderByCreatedAtDesc(Pageable pageable);

    Optional<Booking> findByBookingReference(String bookingReference);

    long countByStatus(BookingStatus status);

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status != 'CANCELLED'")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(b.totalAmount), 0) FROM Booking b WHERE b.status != 'CANCELLED' " +
           "AND b.createdAt BETWEEN :start AND :end")
    BigDecimal sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(b) FROM Booking b WHERE b.createdAt BETWEEN :start AND :end")
    long countByCreatedAtBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT b.room.hotel.name, COUNT(b) as bookingCount, COALESCE(SUM(b.totalAmount),0) as revenue " +
           "FROM Booking b WHERE b.status != 'CANCELLED' " +
           "GROUP BY b.room.hotel.id, b.room.hotel.name ORDER BY bookingCount DESC")
    List<Object[]> findTopHotels(Pageable pageable);

    @Query("SELECT b FROM Booking b ORDER BY b.createdAt DESC")
    List<Booking> findRecentBookings(Pageable pageable);

    @Query("SELECT b FROM Booking b WHERE b.status = 'CONFIRMED' " +
           "AND b.room.id = :roomId " +
           "AND NOT (b.checkOutDate <= :checkIn OR b.checkInDate >= :checkOut)")
    List<Booking> findOverlappingBookings(@Param("roomId") Long roomId,
                                           @Param("checkIn") LocalDate checkIn,
                                           @Param("checkOut") LocalDate checkOut);

    @Query("SELECT FUNCTION('DATE_FORMAT', b.createdAt, '%Y-%m') as month, COUNT(b) " +
           "FROM Booking b WHERE b.createdAt >= :since GROUP BY month ORDER BY month")
    List<Object[]> countBookingsByMonth(@Param("since") LocalDateTime since);
}
